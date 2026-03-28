import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { readingsService, sessionsService, translateWord } from '../services';
import { Reading, SessionAnswer, LEVELS } from '../types';
import { Spinner, LevelBadge, ProgressBar, XPChip, Card, EmptyState } from '../components/ui';

// ─── Tooltip state ─────────────────────────────────────────────────────────────
interface TooltipState { text: string; x: number; y: number; translation: string; }

// ─── Reader ───────────────────────────────────────────────────────────────────
function ReaderView({ reading, onBack }: { reading: Reading; onBack: (score?: number, xp?: number) => void }) {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState<'read' | 'questions' | 'result'>('read');
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  // ── Hide tooltip on click outside or scroll ──
  useEffect(() => {
    if (!tooltip) return;
    const hide = (e: Event) => {
      if (tooltipRef.current?.contains(e.target as Node)) return;
      setTooltip(null);
    };
    document.addEventListener('mousedown', hide);
    document.addEventListener('scroll', hide, { passive: true });
    document.addEventListener('touchstart', hide, { passive: true });
    return () => {
      document.removeEventListener('mousedown', hide);
      document.removeEventListener('scroll', hide);
      document.removeEventListener('touchstart', hide);
    };
  }, [tooltip]);

  // ── Detect text selection (works for single words AND phrases) ──
  const handleMouseUp = async () => {
    const selection = window.getSelection();
    const selected = selection?.toString().trim();
    if (!selected || selected.length < 2 || selected.length > 300) return;

    try {
      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const x = Math.min(
        Math.max(rect.left + rect.width / 2, 100),
        window.innerWidth - 100
      );
      const y = rect.top > 60 ? rect.top - 8 : rect.bottom + 8;

      setTooltip({ text: selected, x, y, translation: '…' });

      const lang = i18n.language === 'hy' ? 'hy' : 'ru';
      const tr = await translateWord(selected, lang);
      setTooltip(prev => prev?.text === selected ? { ...prev, translation: tr } : prev);
    } catch { /* ignore */ }
  };

  const selectAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => [...prev, idx]);
  };

  const nextQ = async () => {
    if (qIdx + 1 >= reading.questions.length) {
      const correct = answers.filter((a, i) => a === reading.questions[i].correctIndex).length;
      const score = Math.round(correct / reading.questions.length * 100);
      const sessionAnswers: SessionAnswer[] = answers.map((a, i) => ({
        itemId: reading._id, userAnswer: String(a), correctAnswer: String(reading.questions[i].correctIndex),
        isCorrect: a === reading.questions[i].correctIndex, timeSpentMs: 0, topic: reading.topic,
      }));
      const res = await sessionsService.create({
        type: 'reading', level: reading.level, answers: sessionAnswers,
        durationMs: Date.now() - startTime.current,
      });
      setResult({ score, correct, total: reading.questions.length, xpEarned: res.xpEarned });
      setPhase('result');
    } else {
      setQIdx(i => i + 1); setSelected(null);
    }
  };

  if (phase === 'result') return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{result.score >= 80 ? '🌟' : result.score >= 60 ? '👍' : '📚'}</div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '0.5rem' }}>Reading Complete!</h2>
      <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{result.score}%</div>
      <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>{result.correct}/{result.total} correct</p>
      {result.xpEarned > 0 && <XPChip amount={result.xpEarned} />}
      <button className="btn btn-ghost" style={{ marginTop: '1.5rem' }} onClick={() => onBack(result.score, result.xpEarned)}>← Back to list</button>
    </div>
  );

  if (phase === 'questions') {
    const q = reading.questions[qIdx];
    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }} className="fade-in">
        <ProgressBar value={qIdx} max={reading.questions.length} label={`Question ${qIdx + 1}/${reading.questions.length}`} />
        <Card style={{ marginTop: '1.25rem', padding: '2rem' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.6 }}>{q.question}</p>
          {q.options.map((opt, i) => {
            let bg = 'var(--surface)', border = 'var(--border-color)', color = 'var(--text-primary)';
            if (selected !== null) {
              if (i === q.correctIndex) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
              else if (i === selected) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
            }
            return (
              <button key={i} onClick={() => selectAnswer(i)} disabled={selected !== null}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '0.8rem 1rem', marginBottom: '0.5rem', borderRadius: '8px',
                  border: `1.5px solid ${border}`, background: bg, color,
                  cursor: selected !== null ? 'default' : 'pointer',
                  fontSize: '0.9rem', transition: 'all 0.15s',
                }}>
                {opt}
              </button>
            );
          })}
          {selected !== null && (
            <div className="fade-in">
              {q.explanation && <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0.75rem 0' }}>📝 {q.explanation}</p>}
              <div style={{ textAlign: 'right' }}>
                <button className="btn btn-primary" onClick={nextQ}>
                  {qIdx + 1 >= reading.questions.length ? 'See Results' : 'Next →'}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Tooltip — fixed position, pointer-events:none so it doesn't block selection */}
      {tooltip && (
        <div
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translateX(-50%) translateY(-100%)',
            background: 'var(--text-primary)',
            color: 'var(--surface)',
            padding: '0.45rem 0.9rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            zIndex: 500,
            boxShadow: 'var(--shadow-md)',
            maxWidth: 280,
            textAlign: 'center',
            pointerEvents: 'none',
            lineHeight: 1.4,
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.15rem' }}>{tooltip.text}</strong>
          <span style={{ opacity: 0.85 }}>{tooltip.translation}</span>
          <div style={{
            position: 'absolute', bottom: -5, left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '5px solid var(--text-primary)',
          }} />
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => onBack()}>← Back</button>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <LevelBadge level={reading.level} />
          <span className="tag">⏱ {reading.estimatedMinutes} min</span>
          <span className="tag">{reading.wordCount} words</span>
        </div>
      </div>

      <Card style={{ marginBottom: '1.5rem', padding: '2.5rem' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
          {reading.title}
        </h1>

        {/* Reading content — select any text to translate */}
        <div
          onMouseUp={handleMouseUp}
          style={{
            fontSize: '1.05rem', lineHeight: 1.9, color: 'var(--text-secondary)',
            userSelect: 'text', cursor: 'text',
          }}
        >
          {reading.content}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1.25rem' }}>
          💡 Select any word or phrase for translation
        </p>
      </Card>

      {reading.questions?.length > 0 && (
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => setPhase('questions')}>
            Answer Questions ({reading.questions.length}) →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── List Page ─────────────────────────────────────────────────────────────────
export default function ReadingPage() {
  const { t } = useTranslation();
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [selected, setSelected] = useState<Reading | null>(null);

  useEffect(() => {
    readingsService.getAll(filterLevel).then(data => { setReadings(data); setLoading(false); });
  }, [filterLevel]);

  const openReading = async (r: any) => {
    const full = await readingsService.getById(r._id);
    setSelected(full);
  };

  if (selected) return (
    <div className="page">
      <ReaderView reading={selected} onBack={() => setSelected(null)} />
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>📄 {t('reading.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Read and answer comprehension questions</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setFilterLevel('')}
          style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid', borderColor: !filterLevel ? 'var(--accent)' : 'var(--border-color)', background: !filterLevel ? 'var(--accent-light)' : 'transparent', color: !filterLevel ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          All
        </button>
        {LEVELS.map(l => (
          <button key={l} onClick={() => setFilterLevel(l)}
            style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid', borderColor: filterLevel === l ? 'var(--accent)' : 'var(--border-color)', background: filterLevel === l ? 'var(--accent-light)' : 'transparent', color: filterLevel === l ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '3rem' }}><Spinner size="lg" /></div>
      ) : readings.length === 0 ? (
        <EmptyState icon="📄" title="No readings yet" description="Add reading texts from the Admin panel." />
      ) : (
        <div className="grid-2">
          {readings.map(r => (
            <Card key={r._id} onClick={() => openReading(r)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <LevelBadge level={r.level} />
                <span className="tag">{r.topic}</span>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{r.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>⏱ {r.estimatedMinutes} min</span>
                <span>📝 {r.wordCount} words</span>
                <span>❓ {r.questionCount ?? r.questions?.length ?? 0} questions</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}