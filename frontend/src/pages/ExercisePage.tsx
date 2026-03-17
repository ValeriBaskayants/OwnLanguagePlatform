import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { exercisesService, sessionsService } from '../services';
import { Exercise, SessionAnswer, LEVELS } from '../types';
import { Spinner, LevelBadge, DifficultyBadge, ProgressBar, XPChip, Card } from '../components/ui';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Spaced Repetition (localStorage) ────────────────────────────────────────
const SR_KEY = 'toefl_exercise_sr';

function getSRData(): Record<string, { nextShow: number; streak: number }> {
  try { return JSON.parse(localStorage.getItem(SR_KEY) || '{}'); } catch { return {}; }
}

function saveSRData(data: Record<string, { nextShow: number; streak: number }>) {
  localStorage.setItem(SR_KEY, JSON.stringify(data));
}

function markExercise(id: string, correct: boolean) {
  const data = getSRData();
  const now = Date.now();
  const prev = data[id] || { nextShow: now, streak: 0 };

  if (correct) {
    // Correct: show again after increasing interval
    const streak = prev.streak + 1;
    const intervals = [0, 4, 24, 72, 168]; // hours
    const hours = intervals[Math.min(streak, intervals.length - 1)];
    data[id] = { nextShow: now + hours * 3600000, streak };
  } else {
    // Wrong: show again in this session (5 min)
    data[id] = { nextShow: now + 5 * 60000, streak: 0 };
  }
  saveSRData(data);
}

function filterBySpacedRep(exercises: Exercise[]): Exercise[] {
  const data = getSRData();
  const now = Date.now();
  // Prioritise: due first, then new
  const due = exercises.filter(e => !data[e._id] || data[e._id].nextShow <= now);
  const notDue = exercises.filter(e => data[e._id] && data[e._id].nextShow > now);
  return [...shuffle(due), ...shuffle(notDue)];
}

type Phase = 'config' | 'quiz' | 'result';

export default function ExercisePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('config');
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState(user?.currentLevel || 'A1');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [noExercisesMsg, setNoExercisesMsg] = useState('');

  // Quiz state
  const [queue, setQueue] = useState<Exercise[]>([]);
  const [idx, setIdx] = useState(0);
  // Multi-blank: array of inputs, one per blank
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [blankResults, setBlankResults] = useState<boolean[]>([]);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [sessionResult, setSessionResult] = useState<any>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    exercisesService.getTopics(filterLevel).then(setTopics).catch(() => { });
  }, [filterLevel]);

  const startSession = async () => {
    setLoading(true);
    setNoExercisesMsg('');
    try {
const params: Record<string, string | number> = { limit: 100 };
if (filterLevel) params.level = filterLevel;
if (filterDiff) params.difficulty = filterDiff;
if (filterTopic) params.topic = filterTopic;

const data = await exercisesService.getAll(params);
      if (!data || data.length === 0) {
        setNoExercisesMsg(`No exercises for level ${filterLevel}${filterDiff ? ` / ${filterDiff}` : ''}. Import exercises via Admin panel.`);
        setLoading(false);
        return;
      }
      const sorted = filterBySpacedRep(data).slice(0, 10);
      setQueue(sorted);
      setIdx(0);
      setAnswers([]);
      setUserInputs(new Array(sorted[0]?.blanks?.length || 1).fill(''));
      setChecked(false);
      setBlankResults([]);
      setStartTime(Date.now());
      setQuestionStart(Date.now());
      setPhase('quiz');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setNoExercisesMsg('Failed to load exercises. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    const ex = queue[idx];
    if (!ex) return;

    const results = ex.blanks.map((blank, i) => {
      const correct = blank.answer.toLowerCase().trim();
      const given = (userInputs[i] || '').toLowerCase().trim();
      return given === correct;
    });

    const allCorrect = results.every(Boolean);
    setBlankResults(results);
    setChecked(true);

    // Mark each blank in spaced repetition
    markExercise(ex._id, allCorrect);

    setAnswers(prev => [...prev, {
      itemId: ex._id,
      userAnswer: userInputs.join(' | '),
      correctAnswer: ex.blanks.map(b => b.answer).join(' | '),
      isCorrect: allCorrect,
      timeSpentMs: Date.now() - questionStart,
      topic: ex.topic,
      difficulty: ex.difficulty,
    }]);
  };

  const nextQuestion = async () => {
    if (idx + 1 >= queue.length) {
      const dur = Date.now() - startTime;
      try {
        const result = await sessionsService.create({
          type: 'grammar',
          level: filterLevel,
          answers,
          durationMs: dur,
        });
        setSessionResult(result);
      } catch {
        setSessionResult({ score: 0, correctCount: 0, totalItems: answers.length, xpEarned: 0 });
      }
      setPhase('result');
    } else {
      const next = queue[idx + 1];
      setIdx(i => i + 1);
      setUserInputs(new Array(next?.blanks?.length || 1).fill(''));
      setChecked(false);
      setBlankResults([]);
      setQuestionStart(Date.now());
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, blankIdx: number) => {
    if (e.key === 'Enter') {
      if (checked) {
        nextQuestion();
      } else {
        // Move to next input or check if last
        if (blankIdx < (queue[idx]?.blanks?.length || 1) - 1) {
          inputRefs.current[blankIdx + 1]?.focus();
        } else {
          checkAnswer();
        }
      }
    }
    if (e.key === 'Tab' && !e.shiftKey && !checked) {
      e.preventDefault();
      if (blankIdx < (queue[idx]?.blanks?.length || 1) - 1) {
        inputRefs.current[blankIdx + 1]?.focus();
      }
    }
  };

  const renderSentence = (ex: Exercise) => {
    const parts = ex.sentence.split('_____');

    return (
      <div style={{ fontSize: '1.2rem', lineHeight: 2.2, textAlign: 'center', wordBreak: 'break-word' }}>
        {parts.map((part, i) => (
          <span key={i}>
            <span style={{ color: 'var(--text-primary)' }}>{part}</span>
            {i < parts.length - 1 && (
              checked ? (
                <span style={{
                  display: 'inline-block',
                  minWidth: '120px',
                  borderBottom: '2px solid',
                  padding: '0 8px',
                  fontWeight: 700,
                  fontFamily: 'DM Mono, monospace',
                  borderColor: blankResults[i] ? 'var(--success)' : 'var(--danger)',
                  color: blankResults[i] ? 'var(--success)' : 'var(--danger)',
                  margin: '0 4px',
                }}>
                  {blankResults[i] ? userInputs[i] : ex.blanks[i]?.answer}
                </span>
              ) : (
                <input
                  ref={el => { inputRefs.current[i] = el; }}
                  value={userInputs[i] || ''}
                  onChange={e => {
                    const next = [...userInputs];
                    next[i] = e.target.value;
                    setUserInputs(next);
                  }}
                  onKeyDown={e => handleKeyDown(e, i)}
                  placeholder={ex.blanks[i]?.hint ? `(${ex.blanks[i].hint})` : '...'}
                  style={{
                    display: 'inline-block',
                    width: '140px',
                    border: 'none',
                    borderBottom: '2px solid var(--accent)',
                    background: 'transparent',
                    textAlign: 'center',
                    fontSize: '1rem',
                    fontFamily: 'DM Mono, monospace',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    padding: '0 4px',
                    margin: '0 4px',
                    transition: 'border-color 0.15s',
                  }}
                />
              )
            )}
          </span>
        ))}
      </div>
    );
  };

  // ─── CONFIG ───────────────────────────────────────────────────────────────
  if (phase === 'config') return (
    <div className="page">
      <div className="page-header">
        <h1>{t('exercise.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fill in the blanks — smart repetition shows weak spots more often</p>
      </div>
      <Card style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Level</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => { setFilterLevel(l); setFilterTopic(''); }}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid',
                  borderColor: filterLevel === l ? 'var(--accent)' : 'var(--border-color)',
                  background: filterLevel === l ? 'var(--accent-light)' : 'transparent',
                  color: filterLevel === l ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'DM Mono, monospace',
                }}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Difficulty</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['', 'easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setFilterDiff(d)}
                style={{
                  padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid',
                  borderColor: filterDiff === d ? 'var(--accent)' : 'var(--border-color)',
                  background: filterDiff === d ? 'var(--accent-light)' : 'transparent',
                  color: filterDiff === d ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                }}>
                {d || 'All'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label className="label">Topic</label>
          <select className="input" value={filterTopic} onChange={e => setFilterTopic(e.target.value)}>
            <option value="">All topics</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '0.85rem' }}
          onClick={startSession}
          disabled={loading}
        >
          {loading ? <Spinner size="sm" /> : '✏️ Start Session (10 questions)'}
        </button>

        {noExercisesMsg && (
          <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.875rem' }}>
            ⚠️ {noExercisesMsg}
          </div>
        )}

        {/* SR legend */}
        <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          🧠 <strong>Smart repetition:</strong> Wrong answers reappear in ~5 min. Correct answers are shown less often over time (4h → 24h → 72h → 1 week).
        </div>
      </Card>
    </div>
  );

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if (phase === 'result') return (
    <div className="page" style={{ maxWidth: 600 }}>
      <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          {(sessionResult?.score || 0) >= 80 ? '🎉' : (sessionResult?.score || 0) >= 60 ? '👍' : '📚'}
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          Session Complete!
        </h2>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', margin: '1rem 0' }}>
          {sessionResult?.score ?? 0}%
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          {sessionResult?.correctCount ?? 0}/{sessionResult?.totalItems ?? 0} correct
        </p>
        {(sessionResult?.xpEarned || 0) > 0 && <XPChip amount={sessionResult.xpEarned} />}

        {/* Wrong answers */}
        {answers.filter(a => !a.isCorrect).length > 0 && (
          <div style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              MISTAKES TO REVIEW
            </h4>
            {answers.filter(a => !a.isCorrect).map((a, i) => (
              <div key={i} style={{ padding: '0.75rem', background: 'var(--danger-light)', borderRadius: '8px', marginBottom: '0.5rem', fontSize: '0.875rem', textAlign: 'left' }}>
                <span style={{ color: 'var(--danger)' }}>You: <strong>{a.userAnswer || '(empty)'}</strong></span>
                {' → '}
                <span style={{ color: 'var(--success)' }}>Correct: <strong>{a.correctAnswer}</strong></span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  📌 Will reappear in ~5 min
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={() => { setPhase('config'); setSessionResult(null); }}>
            New Session
          </button>
          <button className="btn btn-ghost" onClick={startSession}>
            Retry Same
          </button>
        </div>
      </Card>
    </div>
  );

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
  const current = queue[idx];
  if (!current) return null;

  const allFilled = userInputs.every(v => v.trim().length > 0);
  const isMultiBlank = current.blanks.length > 1;

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <ProgressBar value={idx} max={queue.length} label={`Question ${idx + 1} of ${queue.length}`} />
      </div>

      <Card style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <LevelBadge level={current.level} />
            <DifficultyBadge difficulty={current.difficulty} />
            <span className="tag">{current.topic}</span>
            {isMultiBlank && (
              <span className="badge badge-accent">{current.blanks.length} blanks</span>
            )}
          </div>

          {/* SR status */}
          {(() => {
            const sr = getSRData()[current._id];
            if (!sr) return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>🆕 New</span>;
            if (sr.streak >= 3) return <span style={{ fontSize: '0.75rem', color: 'var(--success)' }}>✅ Streak: {sr.streak}</span>;
            return <span style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>🔄 Streak: {sr.streak}</span>;
          })()}
        </div>

        {/* Hints row */}
        {isMultiBlank && !checked && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {current.blanks.map((b, i) => b.hint && (
              <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--surface-elevated)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                [{i + 1}] {b.hint}
              </span>
            ))}
          </div>
        )}

        {/* Sentence */}
        <div style={{ padding: '2rem 1.5rem', background: 'var(--surface-elevated)', borderRadius: '12px', marginBottom: '1.5rem' }}>
          {renderSentence(current)}
        </div>

        {/* Single-blank hint */}
        {!isMultiBlank && current.blanks[0]?.hint && !checked && (
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
            💡 {current.blanks[0].hint}
          </div>
        )}

        {/* Result feedback */}
        {checked && (
          <div style={{
            padding: '1rem',
            borderRadius: '10px',
            marginBottom: '1rem',
            background: blankResults.every(Boolean) ? 'var(--success-light)' : 'var(--danger-light)',
            border: `1px solid ${blankResults.every(Boolean) ? 'rgba(74,124,89,0.3)' : 'rgba(192,57,43,0.3)'}`,
          }} className="fade-in">
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: blankResults.every(Boolean) ? 'var(--success)' : 'var(--danger)' }}>
              {blankResults.every(Boolean)
                ? '✅ Perfect!'
                : `❌ ${blankResults.filter(Boolean).length}/${blankResults.length} correct`}
            </div>

            {/* Show each blank result if multi-blank */}
            {isMultiBlank && (
              <div style={{ marginBottom: '0.5rem' }}>
                {current.blanks.map((b, i) => (
                  <div key={i} style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {blankResults[i]
                      ? <span style={{ color: 'var(--success)' }}>✓ [{i + 1}] {b.answer}</span>
                      : <span style={{ color: 'var(--danger)' }}>✗ [{i + 1}] You: "{userInputs[i]}" → <strong>{b.answer}</strong></span>}
                  </div>
                ))}
              </div>
            )}

            {current.explanation && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                📝 {current.explanation}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          {!checked ? (
            <>
              {isMultiBlank && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Tab / Enter to move between fields
                </span>
              )}
              <button
                className="btn btn-primary"
                onClick={checkAnswer}
                disabled={!allFilled}
              >
                Check Answer →
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={nextQuestion}>
              {idx + 1 >= queue.length ? '🏁 Finish' : 'Next →'}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}