import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { writingService, sessionsService } from '../services';
import { WritingPrompt, WritingSubmission, LEVELS } from '../types';
import { Spinner, LevelBadge, Card, EmptyState, ScoreRing, Alert } from '../components/ui';

function WritingEditor({ prompt, onBack }: { prompt: WritingPrompt; onBack: () => void }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);
  const [polling, setPolling] = useState(false);
  const [history, setHistory] = useState<WritingSubmission[]>([]);

  useEffect(() => {
    writingService.getSubmissions(prompt._id).then(setHistory);
  }, [prompt._id]);

  useEffect(() => {
    if (!submissionId || !polling) return;
    const interval = setInterval(async () => {
      const sub = await writingService.getSubmission(submissionId);
      if (sub.status !== 'pending') {
        setSubmission(sub); setPolling(false);
        if (sub.status === 'analyzed' && sub.analysis) {
          await sessionsService.create({
            type: 'writing', level: prompt.level,
            answers: [{ itemId: prompt._id, userAnswer: text, correctAnswer: '', isCorrect: sub.analysis.overallScore >= 65, timeSpentMs: 0, topic: prompt.topic }],
            durationMs: 0, writingScore: sub.analysis.overallScore,
          });
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [submissionId, polling]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const res = await writingService.submit(prompt._id, text);
    setSubmissionId(res.submissionId); setPolling(true); setSubmitting(false);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isEnough = wordCount >= prompt.minWords;

  return (
    <div style={{ maxWidth: 720 }}>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: '1.5rem' }}>← Back</button>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <LevelBadge level={prompt.level} />
        <span className="badge badge-muted">{prompt.type}</span>
        <span className="tag">{prompt.topic}</span>
      </div>

      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.05rem' }}>📝 Task</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.7, fontSize: '1rem' }}>{prompt.prompt}</p>
        {prompt.instructions && (
          <div style={{ padding: '0.75rem', background: 'var(--accent-light)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--accent-hover)' }}>
            💡 {prompt.instructions}
          </div>
        )}
        <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          {t('writing.minWords', { n: prompt.minWords })} — max {prompt.maxWords} words
        </div>
      </Card>

      {!submission && (
        <>
          <div style={{ position: 'relative' }}>
            <textarea
              value={text} onChange={e => setText(e.target.value)}
              rows={12} className="input"
              placeholder="Start writing here…"
              style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1rem', lineHeight: 1.8, resize: 'vertical', paddingBottom: '2.5rem' }}
            />
            <div style={{ position: 'absolute', bottom: '0.75rem', right: '1rem', fontSize: '0.82rem', fontFamily: 'DM Mono, monospace', color: isEnough ? 'var(--success)' : 'var(--text-muted)' }}>
              {wordCount} / {prompt.minWords} {t('common.words')}
            </div>
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={!isEnough || submitting}>
              {submitting || polling ? <><Spinner size="sm" /> {t('writing.analyzing')}</> : t('writing.submitReview')}
            </button>
          </div>
        </>
      )}

      {submission && submission.status === 'analyzed' && submission.analysis && (
        <div className="fade-in">
          <Card style={{ marginBottom: '1.25rem', textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1.5rem' }}>AI Review Results</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <ScoreRing score={submission.analysis.overallScore} size={90} />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{t('writing.overallScore')}</div>
              </div>
              {[
                { label: t('writing.grammarScore'), val: submission.analysis.grammarScore },
                { label: t('writing.taskScore'), val: submission.analysis.taskScore },
                { label: t('writing.coherenceScore'), val: submission.analysis.coherenceScore },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <ScoreRing score={s.val} size={65} />
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>📝 {submission.analysis.wordCount} words</span>
              <span>⚠️ {submission.analysis.errorCount} errors</span>
            </div>
          </Card>

          {submission.analysis.errors.length === 0 ? (
            <Alert type="success">{t('writing.noErrors')}</Alert>
          ) : (
            <Card>
              <h4 style={{ marginBottom: '1rem' }}>⚠️ {t('writing.errors')}: {submission.analysis.errorCount}</h4>
              {submission.analysis.errors.map((err, i) => (
                <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--surface-elevated)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--danger)', marginBottom: '0.3rem' }}>{err.message}</div>
                  <div style={{ color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                    "…{err.context}…"
                  </div>
                  {err.replacements?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Suggestions:</span>
                      {err.replacements.map(r => <span key={r} style={{ padding: '0.15rem 0.5rem', background: 'var(--success-light)', color: 'var(--success)', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'DM Mono, monospace' }}>{r}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </Card>
          )}
          <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={() => { setSubmission(null); setSubmissionId(null); }}>Write Again</button>
        </div>
      )}

      {history.length > 0 && !submission && (
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Previous Submissions</h4>
          {history.slice(0, 3).map(h => (
            <div key={h._id} style={{ padding: '0.75rem', background: 'var(--surface-elevated)', borderRadius: '8px', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{new Date(h.submittedAt).toLocaleDateString()}</span>
              {h.analysis ? <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{h.analysis.overallScore}%</span> : <span style={{ color: 'var(--text-muted)' }}>Pending…</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WritingPage() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState<WritingPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [selected, setSelected] = useState<WritingPrompt | null>(null);

  useEffect(() => {
    writingService.getPrompts(filterLevel).then(d => { setPrompts(d); setLoading(false); });
  }, [filterLevel]);

  if (selected) return <div className="page"><WritingEditor prompt={selected} onBack={() => setSelected(null)} /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>🖊️ {t('writing.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Write responses and get AI-powered feedback</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button onClick={() => setFilterLevel('')} style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid', borderColor: !filterLevel ? 'var(--accent)' : 'var(--border-color)', background: !filterLevel ? 'var(--accent-light)' : 'transparent', color: !filterLevel ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>All</button>
        {LEVELS.map(l => <button key={l} onClick={() => setFilterLevel(l)} style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid', borderColor: filterLevel === l ? 'var(--accent)' : 'var(--border-color)', background: filterLevel === l ? 'var(--accent-light)' : 'transparent', color: filterLevel === l ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Mono, monospace' }}>{l}</button>)}
      </div>
      {loading ? <div style={{ textAlign: 'center', paddingTop: '3rem' }}><Spinner size="lg" /></div>
        : prompts.length === 0 ? <EmptyState icon="🖊️" title="No writing prompts" description="Add prompts from the Admin panel." />
        : (
          <div className="grid-2">
            {prompts.map(p => (
              <Card key={p._id} onClick={() => setSelected(p)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <LevelBadge level={p.level} />
                  <span className="badge badge-muted">{p.type}</span>
                  <span className="tag">{p.topic}</span>
                </div>
                <p style={{ fontWeight: 500, marginBottom: '0.5rem', lineHeight: 1.5 }}>{p.prompt}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.minWords}–{p.maxWords} words</div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
