import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { vocabularyService, sessionsService } from '../services';
import { VocabularyWord, LEVELS } from '../types';
import { Spinner, LevelBadge, Card, Tabs, EmptyState, XPChip } from '../components/ui';

// ─── 4-Option Flashcard Quiz ──────────────────────────────────────────────────
function FlashcardView({ level, onDone }: { level: string; onDone: (vocabLearned: number) => void }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState<VocabularyWord[]>([]);
  const [pool, setPool] = useState<VocabularyWord[]>([]);
  const [idx, setIdx] = useState(0);
  const [options, setOptions] = useState<Array<{ word: VocabularyWord; isCorrect: boolean }>>([]);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [startTime] = useState(Date.now());
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    Promise.all([
      vocabularyService.getFlashcards(level, 20),
      vocabularyService.getAll({ level, limit: 150 }),
    ]).then(([flashcardsData, poolData]) => {
      const wordList = (flashcardsData as any[])
        .map((f: any) => f.word)
        .filter(Boolean) as VocabularyWord[];
      setCards(wordList);
      setPool(poolData as VocabularyWord[]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [level]);

  useEffect(() => {
    if (cards.length > 0 && pool.length > 0 && idx < cards.length) {
      buildOptions(cards[idx]);
    }
  }, [idx, cards, pool]);

  function buildOptions(target: VocabularyWord) {
    const distractors = pool
      .filter(w => w._id !== target._id && w.definition !== target.definition)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    // Pad with placeholders if not enough distractors
    while (distractors.length < 3) {
      distractors.push({ ...target, definition: `(not a valid definition ${distractors.length})`, _id: 'placeholder_' + distractors.length } as any);
    }
    const all = [
      ...distractors.map(w => ({ word: w, isCorrect: false })),
      { word: target, isCorrect: true },
    ].sort(() => Math.random() - 0.5);
    setOptions(all);
    setSelectedOpt(null);
  }

  const handleSelect = async (optIdx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(optIdx);

    const isCorrect = options[optIdx]?.isCorrect ?? false;
    const currentWord = cards[idx];
    const quality: 0 | 1 | 2 | 3 = isCorrect ? 3 : 0;

    if (isCorrect) setCorrectCount(c => c + 1);
    setTotalCount(t => t + 1);

    setAnswers(prev => [...prev, {
      itemId: currentWord._id,
      userAnswer: options[optIdx]?.word.definition || '',
      correctAnswer: currentWord.definition,
      isCorrect,
      timeSpentMs: 0,
      topic: 'Vocabulary',
      difficulty: 'easy',
    }]);

    try {
      await vocabularyService.review(currentWord._id, quality);
    } catch { /* ignore */ }

    setTimeout(async () => {
      const newIdx = idx + 1;
      if (newIdx >= cards.length) {
        // Create session
        try {
          const res = await sessionsService.create({
            type: 'flashcard',
            level,
            answers: [...answers, {
              itemId: currentWord._id,
              userAnswer: options[optIdx]?.word.definition || '',
              correctAnswer: currentWord.definition,
              isCorrect,
              timeSpentMs: 0,
              topic: 'Vocabulary',
            }],
            durationMs: Date.now() - startTime,
            vocabLearned: correctCount + (isCorrect ? 1 : 0),
          });
          setXpEarned(res.xpEarned || 0);
        } catch { /* ignore */ }
        setDone(true);
      } else {
        setIdx(newIdx);
      }
    }, 1400);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}><Spinner size="lg" /></div>
  );

  if (cards.length === 0) return (
    <EmptyState icon="📭" title="No flashcards due" description="Come back later or add vocabulary!" />
  );

  if (done) return (
    <div style={{ textAlign: 'center', padding: '3rem' }} className="fade-in">
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
        {correctCount / Math.max(totalCount, 1) >= 0.8 ? '🎉' : correctCount / Math.max(totalCount, 1) >= 0.5 ? '👍' : '📚'}
      </div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Session complete!</h2>
      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', margin: '0.75rem 0' }}>
        {Math.round((correctCount / Math.max(totalCount, 1)) * 100)}%
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        {correctCount}/{totalCount} correct
      </p>
      {xpEarned > 0 && <XPChip amount={xpEarned} />}
      <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => onDone(correctCount)}>Done</button>
    </div>
  );

  const currentWord = cards[idx];
  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        <span style={{ fontFamily: 'DM Mono, monospace' }}>{idx + 1} / {cards.length}</span>
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {correctCount} correct</span>
      </div>

      {/* Word card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-light), var(--surface-elevated))',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '1.5rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        <LevelBadge level={currentWord.level} />
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          margin: '1rem 0 0.5rem',
          fontFamily: 'Playfair Display, serif',
          color: 'var(--text-primary)',
        }}>
          {currentWord.word}
        </div>
        {currentWord.pronunciation && (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            /{currentWord.pronunciation}/
          </div>
        )}
        <span style={{
          fontSize: '0.75rem', color: 'var(--accent-hover)',
          background: 'var(--accent-light)', padding: '0.15rem 0.6rem',
          borderRadius: '100px', fontWeight: 600,
        }}>
          {currentWord.type}
        </span>
        <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          Choose the correct definition ↓
        </div>
      </div>

      {/* 4 Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {options.map((opt, i) => {
          let bg = 'var(--surface)';
          let border = 'var(--border-color)';
          let color = 'var(--text-primary)';
          let icon = '';

          if (selectedOpt !== null) {
            if (opt.isCorrect) {
              bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; icon = '✓';
            } else if (i === selectedOpt) {
              bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; icon = '✗';
            } else {
              color = 'var(--text-muted)';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selectedOpt !== null}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                border: `1.5px solid ${border}`,
                background: bg, color,
                textAlign: 'left',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                cursor: selectedOpt !== null ? 'default' : 'pointer',
                transition: 'all 0.15s',
                minHeight: 52,
              }}
            >
              <span style={{
                fontFamily: 'DM Mono, monospace', fontWeight: 700,
                fontSize: '0.85rem', minWidth: '1.5rem',
                opacity: selectedOpt !== null ? 1 : 0.5,
              }}>
                {icon || LABELS[i]}
              </span>
              <span>{opt.word.definition}</span>
            </button>
          );
        })}
      </div>

      {/* Hint after answer */}
      {selectedOpt !== null && (
        <div style={{ marginTop: '1rem' }} className="fade-in">
          {options[selectedOpt]?.isCorrect ? (
            currentWord.examples?.[0] && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'var(--success-light)',
                borderRadius: '10px',
                fontSize: '0.875rem',
                color: 'var(--success)',
                fontStyle: 'italic',
              }}>
                💬 "{currentWord.examples[0]}"
              </div>
            )
          ) : (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'var(--surface-elevated)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
            }}>
              ✅ <strong>Correct:</strong> {currentWord.definition}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Word Card (list view) ────────────────────────────────────────────────────
function WordCard({ word }: { word: VocabularyWord }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{word.word}</span>
            <LevelBadge level={word.level} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-elevated)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{word.type}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{word.definition}</p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem', flexShrink: 0, marginLeft: '0.5rem' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }} className="fade-in">
          {word.definitionRu && <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>🇷🇺 {word.definitionRu}</p>}
          {word.pronunciation && <p style={{ marginBottom: '0.5rem', fontFamily: 'DM Mono, monospace', color: 'var(--accent)', fontSize: '0.88rem' }}>/{word.pronunciation}/</p>}
          {word.examples?.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>EXAMPLES</div>
              {word.examples.map((ex, i) => <p key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>• "{ex}"</p>)}
            </div>
          )}
          {word.synonyms?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Synonyms:</span>
              {word.synonyms.map(s => <span key={s} className="tag">{s}</span>)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VocabularyPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<'list' | 'flashcards'>('list');
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [search, setSearch] = useState('');

  const fetchWords = async () => {
    setLoading(true);
    const params: Record<string, string | number> = {};
    if (filterLevel) params.level = filterLevel;
    if (search) params.search = search;
    const data = await vocabularyService.getAll(params);
    setWords(data);
    setLoading(false);
  };

  useEffect(() => { fetchWords(); }, [filterLevel, search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t('vocabulary.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Master vocabulary with smart quiz-style flashcards</p>
      </div>

      <Tabs
        tabs={[
          { key: 'list', label: t('vocabulary.listView'), icon: '📋' },
          { key: 'flashcards', label: t('vocabulary.flashcardView'), icon: '🃏' },
        ]}
        active={mode}
        onChange={k => setMode(k as any)}
      />

      {mode === 'flashcards' ? (
        <FlashcardView level={user?.currentLevel || 'A1'} onDone={() => setMode('list')} />
      ) : (
        <>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input
              className="input"
              placeholder={t('common.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 180 }}
            />
            <select className="input" value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ width: 'auto' }}>
              <option value="">{t('common.all')} levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', paddingTop: '3rem' }}><Spinner size="lg" /></div>
          ) : words.length === 0 ? (
            <EmptyState icon="📭" title="No words found" description="Try a different filter or add vocabulary in Admin." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {words.map(w => <WordCard key={w._id} word={w} />)}
            </div>
          )}
        </>
      )}
    </div>
  );
}