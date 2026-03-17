import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { levelTestService, progressService, authService } from '../services';
import { useAuthStore } from '../store/authStore';
import { LevelProgress } from '../types';
import { Spinner, LevelBadge, ProgressBar, ScoreRing, Card, Alert } from '../components/ui';

type TestPhase = 'locked' | 'ready' | 'active' | 'result';

function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(s => {
        if (s <= 1) { clearInterval(ref.current); onExpire(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, []);

  const m = Math.floor(left / 60);
  const s = left % 60;
  const isLow = left < 300;

  return (
    <div style={{
      position: 'fixed', top: '1rem', right: '1.5rem', zIndex: 300,
      background: isLow ? 'var(--danger)' : 'var(--surface)',
      color: isLow ? '#fff' : 'var(--text-primary)',
      border: `1px solid ${isLow ? 'var(--danger)' : 'var(--border-color)'}`,
      borderRadius: '12px', padding: '0.6rem 1.1rem',
      boxShadow: 'var(--shadow-md)',
      fontFamily: 'DM Mono, monospace', fontSize: '1.2rem', fontWeight: 700,
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      animation: isLow && left % 2 === 0 ? 'pulse 1s ease-in-out' : 'none',
    }}>
      ⏱ {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </div>
  );
}

export default function LevelTestPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [phase, setPhase] = useState<TestPhase>('locked');
  const [progress, setProgress] = useState<LevelProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [startedAt, setStartedAt] = useState('');
  const [answers, setAnswers] = useState<Record<string, { answer: string; correct: string; isCorrect: boolean; section: string }>>({});
  const [currentSection, setCurrentSection] = useState<'grammar' | 'vocabulary' | 'reading' | 'listening'>('grammar');
  const [grammarInput, setGrammarInput] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await progressService.get();
        setProgress(data?.progress || null);
        if (data?.progress?.isReadyForTest) setPhase('ready');
        else setPhase('locked');
      } catch { setPhase('locked'); }
      finally { setLoading(false); }
    })();
  }, []);

  const startTest = async () => {
    setLoading(true); setError('');
    try {
      const data = await levelTestService.getQuestions();
      setTestData(data);
      setStartedAt(data.startedAt);
      setPhase('active');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cannot start test');
    } finally { setLoading(false); }
  };

  const handleExpire = () => submitTest(true);

  const submitTest = async (expired = false) => {
    if (submitting) return;
    setSubmitting(true);
    const allAnswers = Object.entries(answers).map(([id, a]) => ({
      itemId: id, userAnswer: a.answer, correctAnswer: a.correct,
      isCorrect: a.isCorrect, sectionType: a.section,
    }));
    try {
      const res = await levelTestService.submit({ answers: allAnswers, startedAt });
      setResult({ ...res, expired });
      setPhase('result');
      if (res.passed) {
        const me = await authService.getMe();
        updateUser(me);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submit failed');
    } finally { setSubmitting(false); }
  };

  const setAnswer = (id: string, answer: string, correct: string, isCorrect: boolean, section: string) => {
    setAnswers(prev => ({ ...prev, [id]: { answer, correct, isCorrect, section } }));
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spinner size="lg" />
    </div>
  );

  // LOCKED
  if (phase === 'locked') return (
    <div className="page" style={{ maxWidth: 560 }}>
      <Card style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '1rem' }}>
          {t('levelTest.title')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          Complete all requirements for your current level to unlock the Level Test.
        </p>
        <Alert type="info">{t('levelTest.score85')}</Alert>
        {progress && (
          <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>REQUIREMENTS</h4>
            {[
              { label: 'Grammar', v: progress.requirements.grammar.completed, m: progress.requirements.grammar.required },
              { label: 'Vocabulary', v: progress.requirements.vocabulary.learned, m: progress.requirements.vocabulary.required },
              { label: 'Reading', v: progress.requirements.reading.completed, m: progress.requirements.reading.required },
              { label: 'Quiz', v: progress.requirements.quiz.completed, m: progress.requirements.quiz.required },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: '0.6rem' }}>
                <ProgressBar label={r.label} value={r.v} max={r.m} />
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-ghost" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/progress')}>
          View Full Progress →
        </button>
      </Card>
    </div>
  );

  // READY
  if (phase === 'ready') return (
    <div className="page" style={{ maxWidth: 560 }}>
      <Card style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'levelUp 1s ease-in-out' }}>🏆</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          {t('levelTest.readyTitle')}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          {t('levelTest.readyDesc')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          {[
            { icon: '📝', label: '50 questions', sub: '20G · 15V · 10R · 5L' },
            { icon: '⏱', label: '45 minutes', sub: 'Strict time limit' },
            { icon: '🎯', label: '85% to pass', sub: 'Score required' },
            { icon: '⏰', label: '24h cooldown', sub: 'On failure' },
          ].map(info => (
            <div key={info.label} style={{ padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{info.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{info.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{info.sub}</div>
            </div>
          ))}
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }} onClick={startTest} disabled={loading}>
          {loading ? <Spinner size="sm" /> : `${t('levelTest.startTest')} →`}
        </button>
      </Card>
    </div>
  );

  // RESULT
  if (phase === 'result' && result) return (
    <div className="page" style={{ maxWidth: 640 }}>
      <Card style={{ textAlign: 'center', padding: '2.5rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {result.passed ? '🎉' : '😔'}
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          {result.passed ? t('levelTest.passed') : t('levelTest.failed')}
        </h2>
        {result.passed && (
          <p style={{ color: 'var(--success)', fontWeight: 600, marginBottom: '0.5rem' }}>
            {result.oldLevel} → {result.newLevel}
          </p>
        )}
        {!result.passed && (
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('levelTest.failedDesc')}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '1.5rem 0', flexWrap: 'wrap' }}>
          <div>
            <ScoreRing score={result.score} size={100} />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Overall</div>
          </div>
          {result.breakdown && Object.entries(result.breakdown).map(([k, v]) => (
            <div key={k} style={{ textAlign: 'center' }}>
              <ScoreRing score={v as number} size={65} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem', textTransform: 'capitalize' }}>{k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/progress')}>View Progress</button>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>Go Home</button>
        </div>
      </Card>
    </div>
  );

  // ACTIVE TEST
  if (phase !== 'active' || !testData) return null;

  const sections = [
    { key: 'grammar' as const, label: 'Grammar', icon: '✏️', count: testData.questions.grammar?.length || 0 },
    { key: 'vocabulary' as const, label: 'Vocabulary', icon: '📚', count: testData.questions.vocabulary?.length || 0 },
    { key: 'reading' as const, label: 'Reading', icon: '📄', count: testData.questions.reading?.length || 0 },
    { key: 'listening' as const, label: 'Listening', icon: '🎧', count: testData.questions.listening?.length || 0 },
  ];

  const answeredCount = Object.keys(answers).length;
  const totalQ = sections.reduce((s, sec) => s + sec.count, 0);

  const renderSection = () => {
    const qs = testData.questions[currentSection] || [];
    if (currentSection === 'grammar') {
      return qs.map((ex: any, i: number) => (
        <div key={ex._id} style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--surface-elevated)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontFamily: 'DM Mono, monospace' }}>
            #{i + 1} · {ex.topic}
          </div>
          <div style={{ fontSize: '1rem', marginBottom: '0.75rem', lineHeight: 1.7 }}>
            {ex.sentence.split('_____').map((part: string, pi: number, arr: string[]) => (
              <span key={pi}>
                {part}
                {pi < arr.length - 1 && (
                  checked[ex._id] ? (
                    <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, padding: '0 4px', color: answers[ex._id]?.isCorrect ? 'var(--success)' : 'var(--danger)' }}>
                      {answers[ex._id]?.isCorrect ? grammarInput[ex._id] : ex.blanks[0]?.answer}
                    </span>
                  ) : (
                    <input
                      value={grammarInput[ex._id] || ''}
                      onChange={e => setGrammarInput(p => ({ ...p, [ex._id]: e.target.value }))}
                      style={{ border: 'none', borderBottom: '2px solid var(--accent)', background: 'transparent', fontFamily: 'DM Mono, monospace', fontWeight: 600, fontSize: '0.95rem', width: '120px', textAlign: 'center', outline: 'none', color: 'var(--text-primary)' }}
                    />
                  )
                )}
              </span>
            ))}
          </div>
          {!checked[ex._id] ? (
            <button className="btn btn-ghost btn-sm" onClick={() => {
              const ans = grammarInput[ex._id]?.toLowerCase().trim() || '';
              const correct = ex.blanks[0]?.answer?.toLowerCase().trim() || '';
              setAnswer(ex._id, grammarInput[ex._id] || '', ex.blanks[0]?.answer, ans === correct, 'grammar');
              setChecked(p => ({ ...p, [ex._id]: true }));
            }} disabled={!grammarInput[ex._id]?.trim()}>Check</button>
          ) : (
            <span style={{ fontSize: '0.82rem', color: answers[ex._id]?.isCorrect ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {answers[ex._id]?.isCorrect ? '✓ Correct' : `✗ Answer: ${ex.blanks[0]?.answer}`}
            </span>
          )}
        </div>
      ));
    }

    if (currentSection === 'vocabulary' || currentSection === 'listening') {
      const sectionKey = currentSection === 'vocabulary' ? 'vocabulary' : 'listening';
      return qs.map((q: any, i: number) => {
        const qId = q._id + '_' + i;
        return (
          <div key={qId} style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--surface-elevated)', borderRadius: '12px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontFamily: 'DM Mono, monospace' }}>#{i + 1}</div>
            {currentSection === 'listening' && (
              <button className="btn btn-ghost btn-sm" style={{ marginBottom: '0.75rem' }}
                onClick={() => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(q.text); u.lang = 'en-US'; window.speechSynthesis.speak(u); } }}>
                🔊 Play
              </button>
            )}
            <p style={{ fontWeight: 600, marginBottom: '1rem', lineHeight: 1.6, fontSize: '0.95rem' }}>{q.question || q.questions?.[0]?.question}</p>
            {(q.options || q.questions?.[0]?.options || []).map((opt: string, oi: number) => {
              const correctIdx = q.correctIndex ?? q.questions?.[0]?.correctIndex ?? 0;
              const sel = answers[qId]?.answer === String(oi);
              let bg = 'var(--surface)', border = 'var(--border-color)', color = 'var(--text-primary)';
              if (answers[qId]) {
                if (oi === correctIdx) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
                else if (sel) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
              }
              return (
                <button key={oi} disabled={!!answers[qId]} onClick={() => setAnswer(qId, String(oi), String(correctIdx), oi === correctIdx, sectionKey)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.65rem 0.9rem', marginBottom: '0.4rem', borderRadius: '8px', border: `1.5px solid ${border}`, background: bg, color, cursor: answers[qId] ? 'default' : 'pointer', fontSize: '0.875rem', transition: 'all 0.15s' }}>
                  {opt}
                </button>
              );
            })}
          </div>
        );
      });
    }

    if (currentSection === 'reading') {
      const grouped: Record<string, any[]> = {};
      qs.forEach((q: any) => {
        const key = q.readingId;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(q);
      });
      return Object.entries(grouped).map(([readingId, rqs]) => (
        <div key={readingId} style={{ marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--surface-elevated)', borderRadius: '12px', marginBottom: '1.25rem', fontSize: '0.92rem', lineHeight: 1.9, color: 'var(--text-secondary)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.75rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {rqs[0]?.readingTitle}
            </h3>
            {rqs[0]?.readingContent}
          </div>
          {rqs.map((q: any, i: number) => {
            const qId = readingId + '_q' + i;
            return (
              <div key={qId} style={{ marginBottom: '1rem', padding: '1.25rem', background: 'var(--surface-elevated)', borderRadius: '12px' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>{q.question}</p>
                {q.options.map((opt: string, oi: number) => {
                  const sel = answers[qId]?.answer === String(oi);
                  let bg = 'var(--surface)', border = 'var(--border-color)', color = 'var(--text-primary)';
                  if (answers[qId]) {
                    if (oi === q.correctIndex) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
                    else if (sel) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
                  }
                  return (
                    <button key={oi} disabled={!!answers[qId]} onClick={() => setAnswer(qId, String(oi), String(q.correctIndex), oi === q.correctIndex, 'reading')}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.9rem', marginBottom: '0.35rem', borderRadius: '8px', border: `1.5px solid ${border}`, background: bg, color, cursor: answers[qId] ? 'default' : 'pointer', fontSize: '0.85rem', transition: 'all 0.15s' }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <Timer seconds={testData.timeLimit} onExpire={handleExpire} />

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}>{t('levelTest.title')}</h1>
          <LevelBadge level={user?.currentLevel || 'A1'} />
        </div>
        <ProgressBar value={answeredCount} max={totalQ} label={`${answeredCount}/${totalQ} answered`} />
      </div>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {sections.map(s => {
          const sAnswered = Object.values(answers).filter(a => a.section === s.key).length;
          return (
            <button key={s.key} onClick={() => setCurrentSection(s.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '100px', border: '1.5px solid',
                borderColor: currentSection === s.key ? 'var(--accent)' : 'var(--border-color)',
                background: currentSection === s.key ? 'var(--accent-light)' : 'transparent',
                color: currentSection === s.key ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              }}>
              {s.icon} {s.label}
              <span style={{
                background: sAnswered === s.count ? 'var(--success)' : 'var(--surface-elevated)',
                color: sAnswered === s.count ? '#fff' : 'var(--text-muted)',
                borderRadius: '100px', fontSize: '0.72rem', padding: '0.1rem 0.45rem',
                fontFamily: 'DM Mono, monospace',
              }}>
                {sAnswered}/{s.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div style={{ marginBottom: '2rem' }}>{renderSection()}</div>

      {error && <Alert type="danger">{error}</Alert>}

      {/* Submit */}
      <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
        <button className="btn btn-primary btn-lg" onClick={() => submitTest()} disabled={submitting} style={{ minWidth: 200 }}>
          {submitting ? <Spinner size="sm" /> : `Submit Test (${answeredCount}/${totalQ})`}
        </button>
        <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          You can submit with unanswered questions — unanswered count as wrong.
        </p>
      </div>
    </div>
  );
}
