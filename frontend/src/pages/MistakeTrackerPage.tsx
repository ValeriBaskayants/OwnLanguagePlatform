// MistakeTrackerPage
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mistakesService } from '../services';
import { Mistake, WeakSpot } from '../types';
import { Spinner, Card, EmptyState } from '../components/ui';

export function MistakeTrackerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([mistakesService.getAll(filter || undefined), mistakesService.getWeakSpots()])
      .then(([m, w]) => { setMistakes(m); setWeakSpots(w); setLoading(false); });
  }, [filter]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>🔍 {t('mistakes.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track and fix your weak areas</p>
      </div>

      {weakSpots.length > 0 && (
        <Card style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', marginBottom: '1rem' }}>🎯 {t('mistakes.weakAreas')}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {weakSpots.slice(0, 5).map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.875rem' }}>
                    <span style={{ fontWeight: 500 }}>{w.topic}</span>
                    <span style={{ color: 'var(--danger)', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>{w.count}×</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--surface-elevated)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${Math.min(100, w.count * 10)}%`, background: 'var(--danger)', borderRadius: 3, transition: 'width 0.5s' }} />
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: '1rem' }}
                  onClick={() => navigate(w.itemType === 'grammar' ? '/exercises' : w.itemType === 'quiz' ? '/quiz' : '/')}>
                  {t('mistakes.repeatTopic')}
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['', 'grammar', 'quiz', 'vocabulary', 'listening'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.85rem', borderRadius: '100px', border: '1px solid', borderColor: filter === f ? 'var(--accent)' : 'var(--border-color)', background: filter === f ? 'var(--accent-light)' : 'transparent', color: filter === f ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', paddingTop: '2rem' }}><Spinner size="lg" /></div>
        : mistakes.length === 0 ? <EmptyState icon="✨" title={t('mistakes.noMistakes')} />
        : mistakes.map(m => (
          <Card key={m._id} style={{ marginBottom: '0.75rem', cursor: 'pointer' }} onClick={() => setExpanded(expanded === m._id ? null : m._id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{m.topic}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.itemType} · {m.level}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--danger)', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.875rem' }}>
                  {t('mistakes.occurrences', { n: m.occurrenceCount })}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{expanded === m._id ? '▲' : '▼'}</span>
              </div>
            </div>
            {expanded === m._id && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }} className="fade-in">
                {m.wrongAnswers.slice(-3).map((w, i) => (
                  <div key={i} style={{ fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: i < m.wrongAnswers.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <span style={{ color: 'var(--danger)' }}>❌ "{w.userAnswer}"</span> → <span style={{ color: 'var(--success)' }}>✅ "{w.correctAnswer}"</span>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{new Date(w.occurredAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
    </div>
  );
}

export default MistakeTrackerPage;
