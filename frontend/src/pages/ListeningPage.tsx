import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { listeningService, sessionsService } from '../services';
import { ListeningExercise, SessionAnswer, LEVELS } from '../types';
import { Spinner, LevelBadge, DifficultyBadge, Card, EmptyState, XPChip } from '../components/ui';

function speak(text: string, rate = 1.0) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = 'en-US'; utt.rate = rate; utt.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const eng = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (eng) utt.voice = eng;
  window.speechSynthesis.speak(utt);
}

function DictationExercise({ ex, onDone }: { ex: ListeningExercise; onDone: (score: number, xp: number) => void }) {
  const { t } = useTranslation();
  const [rate, setRate] = useState(1.0);
  const [userText, setUserText] = useState('');
  const [result, setResult] = useState<any>(null);
  const startTime = Date.now();

  const submit = async () => {
    const words1 = ex.text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const words2 = userText.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
    const correct = words1.filter((w, i) => w === words2[i]).length;
    const score = Math.round(correct / Math.max(words1.length, 1) * 100);
    const res = await sessionsService.create({
      type: 'listening', level: ex.level,
      answers: [{ itemId: ex._id, userAnswer: userText, correctAnswer: ex.text, isCorrect: score >= 70, timeSpentMs: Date.now() - startTime, topic: ex.topic }],
      durationMs: Date.now() - startTime,
    });
    setResult({ score, correct, total: words1.length, xpEarned: res.xpEarned, userWords: words2, correctWords: words1 });
  };

  if (result) return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{result.score >= 80 ? '🎉' : result.score >= 60 ? '👍' : '📚'}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{result.score}%</div>
        {result.xpEarned > 0 && <XPChip amount={result.xpEarned} />}
      </div>
      <div style={{ fontSize: '0.875rem', lineHeight: 2, fontFamily: 'DM Mono, monospace', background: 'var(--surface-elevated)', padding: '1rem', borderRadius: '10px' }}>
        {result.correctWords.map((w: string, i: number) => (
          <span key={i} style={{ marginRight: '4px', padding: '1px 4px', borderRadius: '3px', background: result.userWords[i] === w ? 'var(--success-light)' : 'var(--danger-light)', color: result.userWords[i] === w ? 'var(--success)' : 'var(--danger)' }}>
            {w}
          </span>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={() => onDone(result.score, result.xpEarned)}>← Back</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => speak(ex.text, rate)}>🔊 {t('listening.play')}</button>
        <button className="btn btn-ghost" onClick={() => speak(ex.text, rate)}>↺ {t('listening.replay')}</button>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t('listening.speed')}:</span>
          {[0.7, 1.0, 1.3].map(r => (
            <button key={r} onClick={() => setRate(r)} style={{ padding: '0.25rem 0.6rem', borderRadius: '100px', border: '1px solid', borderColor: rate === r ? 'var(--accent)' : 'var(--border-color)', background: rate === r ? 'var(--accent-light)' : 'transparent', color: rate === r ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>{r}x</button>
          ))}
        </div>
      </div>
      <textarea
        value={userText} onChange={e => setUserText(e.target.value)}
        placeholder={t('listening.typeHeard')}
        className="input" rows={5}
        style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.95rem', resize: 'vertical', marginBottom: '1rem' }}
      />
      <button className="btn btn-primary" onClick={submit} disabled={!userText.trim()}>
        {t('listening.submitDictation')} →
      </button>
    </div>
  );
}

function ComprehensionExercise({ ex, onDone }: { ex: ListeningExercise; onDone: (score: number, xp: number) => void }) {
  const [rate, setRate] = useState(1.0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [result, setResult] = useState<any>(null);
  const startTime = Date.now();

  const q = ex.questions?.[qIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setAnswers(prev => [...prev, idx]);
  };

  const next = async () => {
    if (qIdx + 1 >= (ex.questions?.length || 0)) {
      const qs = ex.questions || [];
      const correct = answers.filter((a, i) => a === qs[i].correctIndex).length;
      const score = Math.round(correct / qs.length * 100);
      const sessionAnswers: SessionAnswer[] = answers.map((a, i) => ({
        itemId: ex._id, userAnswer: String(a), correctAnswer: String(qs[i].correctIndex),
        isCorrect: a === qs[i].correctIndex, timeSpentMs: 0, topic: ex.topic,
      }));
      const res = await sessionsService.create({ type: 'listening', level: ex.level, answers: sessionAnswers, durationMs: Date.now() - startTime });
      setResult({ score, xpEarned: res.xpEarned });
    } else {
      setQIdx(i => i + 1); setSelected(null);
    }
  };

  if (result) return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{result.score}%</div>
      {result.xpEarned > 0 && <XPChip amount={result.xpEarned} />}
      <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={() => onDone(result.score, result.xpEarned)}>← Back</button>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => speak(ex.text, rate)}>🔊 Play Audio</button>
        {[0.7, 1.0, 1.3].map(r => (
          <button key={r} onClick={() => setRate(r)} style={{ padding: '0.25rem 0.6rem', borderRadius: '100px', border: '1px solid', borderColor: rate === r ? 'var(--accent)' : 'var(--border-color)', background: rate === r ? 'var(--accent-light)' : 'transparent', color: rate === r ? 'var(--accent)' : 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>{r}x</button>
        ))}
      </div>
      {q && (
        <div>
          <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{q.question}</p>
          {q.options.map((opt, i) => {
            let bg = 'var(--surface)', border = 'var(--border-color)', color = 'var(--text-primary)';
            if (selected !== null) {
              if (i === q.correctIndex) { bg = 'var(--success-light)'; border = 'var(--success)'; color = 'var(--success)'; }
              else if (i === selected) { bg = 'var(--danger-light)'; border = 'var(--danger)'; color = 'var(--danger)'; }
            }
            return <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', marginBottom: '0.5rem', borderRadius: '8px', border: `1.5px solid ${border}`, background: bg, color, cursor: selected !== null ? 'default' : 'pointer', fontSize: '0.9rem', transition: 'all 0.15s' }}>{opt}</button>;
          })}
          {selected !== null && <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={next}>{qIdx + 1 >= (ex.questions?.length || 0) ? 'See Results' : 'Next →'}</button>}
        </div>
      )}
    </div>
  );
}

export default function ListeningPage() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<ListeningExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterType, setFilterType] = useState('');
  const [selected, setSelected] = useState<ListeningExercise | null>(null);

  useEffect(() => {
    listeningService.getAll({ level: filterLevel || undefined, type: filterType || undefined }).then(d => { setExercises(d); setLoading(false); });
  }, [filterLevel, filterType]);

  if (selected) return (
    <div className="page" style={{ maxWidth: 640 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ marginBottom: '1.5rem' }}>← Back</button>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <LevelBadge level={selected.level} />
        <DifficultyBadge difficulty={selected.difficulty} />
        <span className="badge badge-muted">{selected.type}</span>
      </div>
      <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>{selected.topic}</h2>
      <Card>
        {selected.type === 'dictation'
          ? <DictationExercise ex={selected} onDone={() => setSelected(null)} />
          : <ComprehensionExercise ex={selected} onDone={() => setSelected(null)} />}
      </Card>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1>🎧 {t('listening.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Improve listening skills with dictation and comprehension</p>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select className="input" value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All levels</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ width: 'auto' }}>
          <option value="">All types</option>
          <option value="dictation">Dictation</option>
          <option value="comprehension">Comprehension</option>
        </select>
      </div>
      {loading ? <div style={{ textAlign: 'center', paddingTop: '3rem' }}><Spinner size="lg" /></div>
        : exercises.length === 0 ? <EmptyState icon="🎧" title="No listening exercises" description="Add exercises from the Admin panel." />
        : (
          <div className="grid-2">
            {exercises.map(ex => (
              <Card key={ex._id} onClick={() => setSelected(ex)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <LevelBadge level={ex.level} />
                  <DifficultyBadge difficulty={ex.difficulty} />
                  <span className="badge badge-muted">{ex.type}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>{ex.topic}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {ex.text.substring(0, 80)}…
                </p>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
