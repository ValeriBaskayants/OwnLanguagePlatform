import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { multipleChoiceService, sessionsService } from '../services';
import { MultipleChoiceQuestion, SessionAnswer, LEVELS } from '../types';
import { Spinner, LevelBadge, DifficultyBadge, ProgressBar, XPChip, Card } from '../components/ui';

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

type Phase = 'config' | 'quiz' | 'result';

export default function MultipleChoicePage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [phase, setPhase] = useState<Phase>('config');
  const [loading, setLoading] = useState(false);
  const [filterLevel, setFilterLevel] = useState(user?.currentLevel || 'A1');
  const [filterDiff, setFilterDiff] = useState('');
  const [queue, setQueue] = useState<MultipleChoiceQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [timer, setTimer] = useState(20);
  const [useTimer, setUseTimer] = useState(false);

  useEffect(() => {
    if (phase !== 'quiz' || selected !== null || !useTimer) return;
    if (timer <= 0) { handleSelect(-1); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer, phase, selected, useTimer]);

  const startSession = async () => {
    setLoading(true);
    const params: Record<string, string | number> = { limit: 50 };
    if (filterLevel) params.level = filterLevel;
    if (filterDiff) params.difficulty = filterDiff;
    const data = await multipleChoiceService.getAll(params);
    const shuffled = shuffle(data as MultipleChoiceQuestion[]).slice(0, 10);
    setQueue(shuffled); setIdx(0); setAnswers([]);
    setSelected(null); setStartTime(Date.now()); setQuestionStart(Date.now());
    setTimer(20); setPhase('quiz'); setLoading(false);
  };

  const handleSelect = async (optIdx: number) => {
    if (selected !== null) return;
    const q = queue[idx];
    setSelected(optIdx);
    const ok = optIdx === q.correctIndex;
    setAnswers(prev => [...prev, {
      itemId: q._id, userAnswer: String(optIdx), correctAnswer: String(q.correctIndex),
      isCorrect: ok, timeSpentMs: Date.now() - questionStart,
      topic: q.topic, difficulty: q.difficulty,
    }]);
  };

  const nextQ = async () => {
    if (idx + 1 >= queue.length) {
      const dur = Date.now() - startTime;
      const res = await sessionsService.create({ type: 'quiz', level: filterLevel, answers, durationMs: dur });
      setResult(res); setPhase('result');
    } else {
      setIdx(i => i + 1); setSelected(null);
      setTimer(20); setQuestionStart(Date.now());
    }
  };

  if (phase === 'config') return (
    <div className="page">
      <div className="page-header">
        <h1>🎯 {t('nav.quiz')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>4-option multiple choice questions</p>
      </div>
      <Card style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Level</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {LEVELS.map(l => (
              <button key={l} onClick={() => setFilterLevel(l)} style={{
                padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid',
                borderColor: filterLevel === l ? 'var(--accent)' : 'var(--border-color)',
                background: filterLevel === l ? 'var(--accent-light)' : 'transparent',
                color: filterLevel === l ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Mono, monospace',
              }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="label">Difficulty</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['', 'easy', 'medium', 'hard'].map(d => (
              <button key={d} onClick={() => setFilterDiff(d)} style={{
                padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid',
                borderColor: filterDiff === d ? 'var(--accent)' : 'var(--border-color)',
                background: filterDiff === d ? 'var(--accent-light)' : 'transparent',
                color: filterDiff === d ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              }}>{d || 'All'}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="checkbox" id="timerCheck" checked={useTimer} onChange={e => setUseTimer(e.target.checked)} />
          <label htmlFor="timerCheck" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>30-second timer per question</label>
        </div>
        <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={startSession} disabled={loading}>
          {loading ? <Spinner size="sm" /> : '🎯 Start Quiz (10 questions)'}
        </button>
      </Card>
    </div>
  );

  if (phase === 'result') return (
    <div className="page" style={{ maxWidth: 580 }}>
      <Card style={{ textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{result?.score >= 80 ? '🏆' : result?.score >= 60 ? '👍' : '📚'}</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Quiz Complete!</h2>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', margin: '1rem 0' }}>{result?.score}%</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{result?.correctCount}/{result?.totalItems} correct</p>
        {result?.xpEarned > 0 && <XPChip amount={result.xpEarned} />}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={() => { setPhase('config'); setResult(null); }}>New Quiz</button>
          <button className="btn btn-ghost" onClick={startSession}>Retry</button>
        </div>
      </Card>
    </div>
  );

  const q = queue[idx];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <ProgressBar value={idx} max={queue.length} label={`${idx + 1} / ${queue.length}`} />
        {useTimer && selected === null && (
          <div style={{
            marginLeft: '1rem', fontFamily: 'DM Mono, monospace', fontWeight: 700,
            fontSize: '1.1rem', color: timer <= 10 ? 'var(--danger)' : 'var(--text-secondary)',
            minWidth: 40, textAlign: 'center',
          }}>
            {timer}s
          </div>
        )}
      </div>

      <Card style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <LevelBadge level={q.level} />
          <DifficultyBadge difficulty={q.difficulty} />
          {q.topic && <span className="tag">{q.topic}</span>}
        </div>

        <div style={{
          fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.75rem',
          padding: '1.25rem', background: 'var(--surface-elevated)', borderRadius: '12px', lineHeight: 1.6,
        }}>
          {q.question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {q.options.map((opt, i) => {
            let bg = 'var(--surface)', border = 'var(--border-color)', color = 'var(--text-primary)';
            if (selected !== null) {
              if (i === q.correctIndex) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
              else if (i === selected && i !== q.correctIndex) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
            }
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.9rem 1.25rem', borderRadius: '10px',
                  border: `1.5px solid ${border}`, background: bg, color,
                  cursor: selected !== null ? 'default' : 'pointer',
                  textAlign: 'left', fontSize: '0.95rem', fontWeight: 500,
                  transition: 'all 0.15s', width: '100%',
                }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.9rem', minWidth: '1.5rem' }}>
                  {optionLabels[i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div style={{ marginTop: '1.25rem' }} className="fade-in">
            <div style={{
              padding: '0.9rem', borderRadius: '8px', marginBottom: '1rem',
              background: selected === q.correctIndex ? 'var(--success-light)' : 'var(--danger-light)',
              fontSize: '0.875rem',
              color: selected === q.correctIndex ? 'var(--success)' : 'var(--danger)',
              fontWeight: 600,
            }}>
              {selected === q.correctIndex ? '✅ Correct!' : `❌ Correct answer: ${optionLabels[q.correctIndex]}. ${q.options[q.correctIndex]}`}
            </div>
            {q.explanation && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>📝 {q.explanation}</p>}
            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-primary" onClick={nextQ}>
                {idx + 1 >= queue.length ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}