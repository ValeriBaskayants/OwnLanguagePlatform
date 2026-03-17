import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { vocabularyService, sessionsService } from '../services';
import { VocabularyWord, LEVELS } from '../types';
import { Spinner, LevelBadge, Card, Tabs, EmptyState } from '../components/ui';

function FlashcardView({ level, onDone }: { level: string; onDone: (vocabLearned: number) => void }) {
  const { t } = useTranslation();
  const [cards, setCards] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [startTime] = useState(Date.now());
  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    vocabularyService.getFlashcards(level, 20).then(data => {
      setCards(data); setLoading(false);
    });
  }, [level]);

  const handleQuality = async (quality: 0 | 1 | 2 | 3) => {
    const card = cards[idx];
    if (!card) return;
    await vocabularyService.review(card.word._id, quality);
    setAnswers(prev => [...prev, {
      itemId: card.word._id, userAnswer: String(quality),
      correctAnswer: '2', isCorrect: quality >= 2, timeSpentMs: 0,
      topic: 'Vocabulary', difficulty: 'easy',
    }]);
    setReviewed(r => r + 1);
    if (idx + 1 >= cards.length) {
      const dur = Date.now() - startTime;
      await sessionsService.create({
        type: 'flashcard', level, answers: answers,
        durationMs: dur, vocabLearned: answers.filter(a => a.isCorrect).length,
      });
      setDone(true);
    } else {
      setIdx(i => i + 1); setFlipped(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', paddingTop: '4rem' }}><Spinner size="lg" /></div>;
  if (cards.length === 0) return <EmptyState icon="📭" title="No flashcards due" description="Come back later or add vocabulary!" />;
  if (done) return (
    <div style={{ textAlign: 'center', padding: '3rem' }} className="fade-in">
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Session complete!</h2>
      <p style={{ color: 'var(--text-secondary)' }}>{reviewed} cards reviewed</p>
      <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => onDone(reviewed)}>Done</button>
    </div>
  );

  const card = cards[idx];
  const word: VocabularyWord = card.word;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        <span>{idx + 1} / {cards.length}</span>
        <span>{t('vocabulary.cardsToday', { n: cards.length })}</span>
      </div>

      {/* Flashcard with 3D flip */}
      <div
        onClick={() => setFlipped(f => !f)}
        style={{
          perspective: '1000px', cursor: 'pointer', marginBottom: '1.5rem', height: '260px',
        }}
      >
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            background: 'var(--surface)', border: '1px solid var(--border-color)',
            borderRadius: '20px', boxShadow: 'var(--shadow-md)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}>
            <LevelBadge level={word.level} />
            <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0 0.5rem', fontFamily: 'Playfair Display, serif' }}>
              {word.word}
            </div>
            {word.pronunciation && (
              <div style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.9rem' }}>
                /{word.pronunciation}/
              </div>
            )}
            <div style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              Tap to reveal →
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'var(--surface-elevated)', border: '1px solid var(--border-color)',
            borderRadius: '20px', boxShadow: 'var(--shadow-md)',
            padding: '1.5rem', overflowY: 'auto',
          }}>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent)', fontSize: '0.78rem', letterSpacing: '0.05em' }}>
              {word.type?.toUpperCase()}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>{word.definition}</div>
            {word.definitionRu && (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                AM {word.definitionRu}
              </div>
            )}
            {word.examples?.slice(0, 2).map((ex, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.4rem 0', borderTop: i === 0 ? '1px solid var(--border-color)' : 'none' }}>
                "{ex}"
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }} className="fade-in">
          {[
            { label: '🚫 ' + t('vocabulary.dontKnow'), quality: 0 as const, color: 'var(--danger)', bg: 'var(--danger-light)' },
            { label: '😓 ' + t('vocabulary.hard'), quality: 1 as const, color: 'var(--warning)', bg: 'rgba(230,126,34,0.12)' },
            { label: '👍 ' + t('vocabulary.know'), quality: 2 as const, color: 'var(--info)', bg: 'rgba(41,128,185,0.12)' },
            { label: '⚡ ' + t('vocabulary.easy'), quality: 3 as const, color: 'var(--success)', bg: 'var(--success-light)' },
          ].map(btn => (
            <button key={btn.quality} onClick={() => handleQuality(btn.quality)}
              style={{
                padding: '0.7rem 0.4rem', borderRadius: '10px', border: 'none',
                background: btn.bg, color: btn.color, fontSize: '0.8rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
              {btn.label}
            </button>
          ))}
        </div>
      )}

      {!flipped && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Click the card to reveal the definition
        </p>
      )}
    </div>
  );
}

function WordCard({ word }: { word: VocabularyWord }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{word.word}</span>
            <LevelBadge level={word.level} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-elevated)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{word.type}</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{word.definition}</p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>{expanded ? '▲' : '▼'}</span>
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
        <p style={{ color: 'var(--text-secondary)' }}>Master vocabulary with spaced repetition</p>
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
            <input className="input" placeholder={t('common.search')} value={search}
              onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
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
