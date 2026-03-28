import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { vocabularyService, sessionsService } from '../services';
import { VocabularyWord, LEVELS } from '../types';
import { Spinner, LevelBadge, Card, EmptyState, XPChip } from '../components/ui';

// ─── Types ────────────────────────────────────────────────────────────────────
type AppMode = 'menu' | 'learn' | 'review' | 'list';

interface QuizOption { word: VocabularyWord; isCorrect: boolean; }

interface SessionStats {
  learned: string[];   // IDs correctly answered at least once
  missed: string[];    // IDs still wrong at session end
  total: number;
  xpEarned: number;
}

// ─── Util ─────────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildOptions(target: VocabularyWord, pool: VocabularyWord[]): QuizOption[] {
  const distractors = shuffle(pool.filter(w => w._id !== target._id && w.definition !== target.definition)).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push({ ...target, _id: `placeholder_${distractors.length}`, definition: `(distractor ${distractors.length + 1})` } as any);
  }
  return shuffle([
    ...distractors.map(w => ({ word: w, isCorrect: false })),
    { word: target, isCorrect: true },
  ]);
}

// ─── Quiz Component ───────────────────────────────────────────────────────────
interface QuizProps {
  mode: 'learn' | 'review';
  level: string;
  wordType: string;
  onFinish: (stats: SessionStats) => void;
  onBack: () => void;
}

function QuizSession({ mode, level, wordType, onFinish, onBack }: QuizProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<VocabularyWord[]>([]);
  const [pool, setPool] = useState<VocabularyWord[]>([]);
  const [options, setOptions] = useState<QuizOption[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [wrongAttempts, setWrongAttempts] = useState<Map<string, number>>(new Map());
  const [sessionAnswers, setSessionAnswers] = useState<any[]>([]);
  const startTime = useRef(Date.now());
  const totalWords = useRef(0);

  const current = queue[0] ?? null;

  useEffect(() => {
    (async () => {
      try {
        const [flashcards, allWords] = await Promise.all([
          vocabularyService.getFlashcards(level || user?.currentLevel, wordType || undefined, 30),
          vocabularyService.getAll({ level: level || user?.currentLevel, type: wordType || undefined, limit: 150 }),
        ]);

        let words: VocabularyWord[];
        if (mode === 'review') {
          words = (flashcards as any[])
            .filter((f: any) => f.progress && f.progress.status !== 'new')
            .map((f: any) => f.word)
            .filter(Boolean) as VocabularyWord[];
        } else {
          words = (flashcards as any[])
            .map((f: any) => f.word)
            .filter(Boolean) as VocabularyWord[];
        }

        if (words.length === 0) {
          onFinish({ learned: [], missed: [], total: 0, xpEarned: 0 });
          return;
        }

        const shuffled = shuffle(words);
        setQueue(shuffled);
        setPool(allWords as VocabularyWord[]);
        totalWords.current = shuffled.length;
        setLoading(false);
      } catch {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (current && pool.length > 0) {
      setOptions(buildOptions(current, pool));
      setSelectedIdx(null);
      setIsCorrect(null);
    }
  }, [current?._id]);

  const handleSelect = useCallback(async (idx: number) => {
    if (selectedIdx !== null || !current) return;
    const opt = options[idx];
    const correct = opt.isCorrect;

    setSelectedIdx(idx);
    setIsCorrect(correct);

    // Update attempts
    const newAttempts = new Map(wrongAttempts);
    if (!correct) newAttempts.set(current._id, (newAttempts.get(current._id) || 0) + 1);
    setWrongAttempts(newAttempts);

    // Backend review
    const quality: 0 | 1 | 2 | 3 = correct ? 3 : 0;
    try { await vocabularyService.review(current._id, quality); } catch { /* ignore */ }

    // Track session answer
    setSessionAnswers(prev => [...prev, {
      itemId: current._id,
      userAnswer: opt.word.definition,
      correctAnswer: current.definition,
      isCorrect: correct,
      timeSpentMs: 0,
      topic: 'Vocabulary',
      difficulty: 'easy',
    }]);

    // Advance after delay
    setTimeout(() => {
      if (correct) {
        setLearnedIds(prev => new Set([...prev, current._id]));
        setQueue(prev => prev.slice(1));
      } else {
        const attempts = newAttempts.get(current._id) || 0;
        if (attempts >= 3) {
          // Force move on after 3 wrong attempts
          setQueue(prev => prev.slice(1));
        } else {
          // Move to end of queue
          setQueue(prev => [...prev.slice(1), current]);
        }
      }
    }, 1500);
  }, [selectedIdx, current, options, wrongAttempts]);

  // Session complete
  useEffect(() => {
    if (!loading && queue.length === 0 && totalWords.current > 0) {
      (async () => {
        let xp = 0;
        try {
          const res = await sessionsService.create({
            type: 'flashcard',
            level: level || user?.currentLevel || 'A1',
            answers: sessionAnswers,
            durationMs: Date.now() - startTime.current,
            vocabLearned: learnedIds.size,
          });
          xp = res.xpEarned || 0;
        } catch { /* ignore */ }

        const allIds = Array.from(new Set(sessionAnswers.map(a => a.itemId)));
        const learned = allIds.filter(id => learnedIds.has(id));
        const missed = allIds.filter(id => !learnedIds.has(id));

        onFinish({ learned, missed, total: totalWords.current, xpEarned: xp });
      })();
    }
  }, [queue.length, loading]);

  if (loading) return (
    <div style={{ textAlign: 'center', paddingTop: '4rem' }}><Spinner size="lg" /></div>
  );

  if (!current) return null;

  const LABELS = ['A', 'B', 'C', 'D'];
  const progress = ((totalWords.current - queue.length) / totalWords.current) * 100;
  const learnedThisSession = learnedIds.size;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ {learnedThisSession}</span>
          <span>{queue.length} left</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'var(--surface-elevated)', borderRadius: 100, marginBottom: '1.5rem' }}>
        <div style={{
          height: '100%', width: `${progress}%`, borderRadius: 100,
          background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
          transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Word card */}
      <div style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <LevelBadge level={current.level} />
          <span style={{
            fontSize: '0.72rem', color: 'var(--accent-hover)',
            background: 'var(--accent-light)', padding: '0.15rem 0.6rem',
            borderRadius: '100px', fontWeight: 600,
          }}>{current.type}</span>
          {(wrongAttempts.get(current._id) || 0) > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--danger)', background: 'var(--danger-light)', padding: '0.15rem 0.6rem', borderRadius: '100px', fontWeight: 600 }}>
              ✗ {wrongAttempts.get(current._id)}× wrong
            </span>
          )}
        </div>
        <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'Playfair Display, serif', margin: '0.5rem 0' }}>
          {current.word}
        </div>
        {current.pronunciation && (
          <div style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.88rem' }}>
            /{current.pronunciation}/
          </div>
        )}
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Choose the correct definition ↓
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {options.map((opt, i) => {
          let bg = 'var(--surface)';
          let border = 'var(--border-color)';
          let color = 'var(--text-primary)';
          let icon = '';

          if (selectedIdx !== null) {
            if (opt.isCorrect) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; icon = '✓'; }
            else if (i === selectedIdx) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; icon = '✗'; }
            else { color = 'var(--text-muted)'; }
          }

          return (
            <button
              key={`${current._id}_${i}`}
              onClick={() => handleSelect(i)}
              disabled={selectedIdx !== null}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                border: `1.5px solid ${border}`,
                background: bg, color,
                textAlign: 'left',
                fontSize: '0.9rem', lineHeight: 1.5,
                cursor: selectedIdx !== null ? 'default' : 'pointer',
                transition: 'all 0.12s',
                minHeight: 48,
              }}
            >
              <span style={{
                fontFamily: 'DM Mono, monospace', fontWeight: 700,
                fontSize: '0.85rem', minWidth: '1.5rem', flexShrink: 0,
                opacity: selectedIdx !== null ? 1 : 0.45,
              }}>
                {icon || LABELS[i]}
              </span>
              <span>{opt.word.definition}</span>
            </button>
          );
        })}
      </div>

      {/* Post-answer hint */}
      {selectedIdx !== null && isCorrect !== null && (
        <div style={{ marginTop: '0.85rem' }} className="fade-in">
          {isCorrect ? (
            current.examples?.[0] ? (
              <div style={{ padding: '0.7rem 1rem', background: 'var(--success-light)', borderRadius: '10px', fontSize: '0.875rem', color: 'var(--success)', fontStyle: 'italic' }}>
                💬 "{current.examples[0]}"
              </div>
            ) : null
          ) : (
            <div style={{ padding: '0.7rem 1rem', background: 'var(--danger-light)', borderRadius: '10px', fontSize: '0.875rem', color: 'var(--danger)' }}>
              🔁 Will appear again in this session
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Session Result ────────────────────────────────────────────────────────────
function SessionResult({ stats, onLearnMore, onReview, onMenu }: {
  stats: SessionStats;
  onLearnMore: () => void;
  onReview: () => void;
  onMenu: () => void;
}) {
  const pct = stats.total > 0 ? Math.round((stats.learned.length / stats.total) * 100) : 0;

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }} className="fade-in">
      <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
        {pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚'}
      </div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Session complete!</h2>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', margin: '0.75rem 0' }}>
        {pct}%
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        {stats.learned.length} learned / {stats.missed.length} need more practice
      </p>
      {stats.xpEarned > 0 && <div style={{ marginBottom: '1rem' }}><XPChip amount={stats.xpEarned} /></div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'var(--success-light)', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'DM Mono, monospace' }}>{stats.learned.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Words learned ✓</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--danger-light)', borderRadius: '12px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger)', fontFamily: 'DM Mono, monospace' }}>{stats.missed.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>Need practice ✗</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onLearnMore}>Learn more words</button>
        {stats.learned.length > 0 && (
          <button className="btn btn-ghost" onClick={onReview}>Review learned</button>
        )}
        <button className="btn btn-ghost" onClick={onMenu}>← Menu</button>
      </div>
    </div>
  );
}

// ─── Word Card (list) ─────────────────────────────────────────────────────────
function WordCard({ word }: { word: VocabularyWord }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{word.word}</span>
            <LevelBadge level={word.level} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--surface-elevated)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              {word.type}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{word.definition}</p>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem', flexShrink: 0, marginLeft: '0.5rem' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>
      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }} className="fade-in">
          {word.definitionRu && <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>🇷🇺 {word.definitionRu}</p>}
          {word.pronunciation && <p style={{ marginBottom: '0.5rem', fontFamily: 'DM Mono, monospace', color: 'var(--accent)', fontSize: '0.88rem' }}>/{word.pronunciation}/</p>}
          {word.examples?.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>EXAMPLES</div>
              {word.examples.map((ex, i) => (
                <p key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>• "{ex}"</p>
              ))}
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

  const [appMode, setAppMode] = useState<AppMode>('menu');
  const [quizMode, setQuizMode] = useState<'learn' | 'review'>('learn');
  const [sessionStats, setSessionStats] = useState<SessionStats | null>(null);

  // Filters
  const [filterLevel, setFilterLevel] = useState(user?.currentLevel || '');
  const [filterType, setFilterType] = useState('');

  // List mode
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [search, setSearch] = useState('');
  const [listLevel, setListLevel] = useState('');
  const [listType, setListType] = useState('');

  // Progress
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    vocabularyService.getUserProgress().then(setProgress).catch(() => {});
  }, [appMode]);

  const fetchWords = async () => {
    setLoadingList(true);
    const params: Record<string, string | number> = {};
    if (listLevel) params.level = listLevel;
    if (listType) params.type = listType;
    if (search) params.search = search;
    const data = await vocabularyService.getAll(params);
    setWords(data);
    setLoadingList(false);
  };

  useEffect(() => {
    if (appMode === 'list') fetchWords();
  }, [appMode, listLevel, listType, search]);

  const startLearn = () => { setQuizMode('learn'); setAppMode('learn'); setSessionStats(null); };
  const startReview = () => { setQuizMode('review'); setAppMode('review'); setSessionStats(null); };

  const handleFinish = (stats: SessionStats) => {
    setSessionStats(stats);
    setAppMode('menu');
  };

  // ── Menu ──
  if (appMode === 'menu') return (
    <div className="page">
      <div className="page-header">
        <h1>{t('vocabulary.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Smart spaced repetition — only correct answers count as learned
        </p>
      </div>

      {/* Session result (if just finished) */}
      {sessionStats && (
        <div style={{ marginBottom: '2rem' }}>
          <SessionResult
            stats={sessionStats}
            onLearnMore={startLearn}
            onReview={startReview}
            onMenu={() => setSessionStats(null)}
          />
        </div>
      )}

      {!sessionStats && (
        <>
          {/* Progress summary */}
          {progress && (
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              {[
                { label: 'Total words', val: progress.total, color: 'var(--text-primary)' },
                { label: 'Learned', val: progress.learned, color: 'var(--success)' },
                { label: 'Mastered', val: progress.mastered, color: 'var(--accent)' },
                { label: 'Due today', val: progress.dueToday, color: 'var(--info)' },
              ].map(s => (
                <Card key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, fontFamily: 'DM Mono, monospace' }}>{s.val}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
                </Card>
              ))}
            </div>
          )}

          {/* Filters */}
          <Card style={{ marginBottom: '1.5rem', maxWidth: 520 }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
              Session filters
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Level</label>
                <select className="input" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}>
                  <option value="">All levels</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <label className="label">Word type</label>
                <select className="input" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="">All types</option>
                  {['noun', 'verb', 'adjective', 'adverb', 'phrase'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={startLearn}>
                📚 Learn new words
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={startReview}
                disabled={!progress || progress.dueToday === 0}
              >
                🔄 Review due ({progress?.dueToday || 0})
              </button>
            </div>
          </Card>

          {/* Browse link */}
          <button
            className="btn btn-ghost"
            onClick={() => setAppMode('list')}
            style={{ marginBottom: '0.5rem' }}
          >
            📋 Browse all vocabulary
          </button>
        </>
      )}
    </div>
  );

  // ── Quiz mode ──
  if (appMode === 'learn' || appMode === 'review') return (
    <div className="page">
      <QuizSession
        mode={quizMode}
        level={filterLevel}
        wordType={filterType}
        onFinish={handleFinish}
        onBack={() => setAppMode('menu')}
      />
    </div>
  );

  // ── List mode ──
  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setAppMode('menu')}>← Back</button>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>Browse vocabulary</h2>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input
          className="input"
          placeholder={t('common.search')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 160 }}
        />
        <select className="input" value={listLevel} onChange={e => setListLevel(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All levels</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input" value={listType} onChange={e => setListType(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All types</option>
          {['noun', 'verb', 'adjective', 'adverb', 'phrase'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {loadingList ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}><Spinner size="lg" /></div>
      ) : words.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No words found"
          description="Try different filters or add vocabulary in Admin."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{words.length} words</p>
          {words.map(w => <WordCard key={w._id} word={w} />)}
        </div>
      )}
    </div>
  );
}