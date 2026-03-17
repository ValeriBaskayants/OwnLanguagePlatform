import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { progressService } from '../services';
import { LevelProgress, DailyActivity, LEVELS } from '../types';
import { Spinner, LevelBadge, ProgressBar, Card } from '../components/ui';

function XPChart({ activities }: { activities: DailyActivity[] }) {
  const last14: DailyActivity[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const act = activities.find(a => a.date === key);
    last14.push(act || { _id: '', userId: '', date: key, xpEarned: 0, sessionsCount: 0, minutesSpent: 0 });
  }
  const maxXp = Math.max(...last14.map(a => a.xpEarned), 1);
  const chartH = 100;

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: chartH + 30, padding: '0 4px' }}>
      {last14.map((a, i) => {
        const h = Math.max(4, Math.round((a.xpEarned / maxXp) * chartH));
        const date = new Date(a.date);
        const label = date.toLocaleDateString('en', { weekday: 'short' });
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {a.xpEarned > 0 && (
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
                {a.xpEarned}
              </span>
            )}
            <div style={{
              width: '100%', height: h,
              background: a.xpEarned > 0
                ? 'linear-gradient(180deg, var(--accent), var(--accent-hover))'
                : 'var(--surface-elevated)',
              borderRadius: '4px 4px 2px 2px',
              transition: 'height 0.4s ease',
              minHeight: 4,
            }} title={`${a.date}: ${a.xpEarned} XP`} />
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', writingMode: 'vertical-lr', transform: 'rotate(180deg)', height: 24 }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function RequirementRow({ label, icon, value, max, accuracy, accThreshold, isVocab = false }: {
  label: string; icon: string; value: number; max: number;
  accuracy?: number; accThreshold?: number; isVocab?: boolean;
}) {
  const done = isVocab ? value >= max : (value >= max && (!accThreshold || (accuracy || 0) >= accThreshold));
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div style={{ padding: '0.85rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{label}</span>
          {done && <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>✓</span>}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
          <span style={{ color: value >= max ? 'var(--success)' : 'var(--text-secondary)' }}>
            {value}/{max}
          </span>
          {accThreshold && accuracy !== undefined && (
            <span style={{ color: accuracy >= accThreshold ? 'var(--success)' : 'var(--danger)' }}>
              {accuracy}% / {accThreshold}%
            </span>
          )}
        </div>
      </div>
      <div style={{ height: 6, background: 'var(--surface-elevated)', borderRadius: 3 }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 3,
          background: done ? 'var(--success)' : 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
          transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }} />
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService.getDashboard().then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spinner size="lg" />
    </div>
  );

  const user = data?.user;
  const progress: LevelProgress | null = data?.progress || null;
  const activities: DailyActivity[] = data?.activities || [];
  const levelIdx = LEVELS.indexOf(user?.currentLevel as any);
  const testHistory = user?.levelTests || [];

  const totalXp = user?.xp || 0;
  const milestones = [500, 1000, 2500, 5000, 10000, 25000];
  const nextMilestone = milestones.find(m => m > totalXp) || milestones[milestones.length - 1];
  const prevMilestone = milestones[milestones.indexOf(nextMilestone) - 1] || 0;
  const xpPct = Math.round(((totalXp - prevMilestone) / (nextMilestone - prevMilestone)) * 100);

  return (
    <div className="page">
      <div className="page-header">
        <h1>📊 {t('progress.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your journey to English mastery</p>
      </div>

      {/* Top stats */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>LEVEL</div>
          <LevelBadge level={user?.currentLevel} />
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {levelIdx + 1} of {LEVELS.length}
          </div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>TOTAL XP</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
            {totalXp.toLocaleString()}
          </div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>STREAK</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E67E22', fontFamily: 'DM Mono, monospace' }}>
            🔥 {user?.streak || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>days</div>
        </Card>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>STUDY TIME</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--info)', fontFamily: 'DM Mono, monospace' }}>
            {user?.stats?.totalSessionTime || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>minutes</div>
        </Card>
      </div>

      {/* XP Progress to milestone */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>XP to next milestone</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {totalXp.toLocaleString()} / {nextMilestone.toLocaleString()}
          </span>
        </div>
        <div style={{ height: 10, background: 'var(--surface-elevated)', borderRadius: 100 }}>
          <div style={{
            height: '100%', width: `${xpPct}%`, borderRadius: 100,
            background: 'linear-gradient(90deg, var(--accent), var(--accent-hover))',
            transition: 'width 0.8s ease',
          }} />
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          {(nextMilestone - totalXp).toLocaleString()} XP to go
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Requirements card */}
        {progress && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
                {t('progress.requirements')}
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <LevelBadge level={progress.level} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→</span>
                <LevelBadge level={progress.targetLevel} />
              </div>
            </div>
            {progress.isReadyForTest && (
              <div style={{ padding: '0.6rem 0.9rem', background: 'var(--success-light)', borderRadius: '8px', marginBottom: '0.75rem', fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>
                ✅ All requirements met — take the Level Test!
              </div>
            )}
            <RequirementRow label="Grammar" icon="✏️"
              value={progress.requirements.grammar.completed}
              max={progress.requirements.grammar.required}
              accuracy={progress.requirements.grammar.accuracy}
              accThreshold={70} />
            <RequirementRow label="Vocabulary" icon="📚" isVocab
              value={progress.requirements.vocabulary.learned}
              max={progress.requirements.vocabulary.required} />
            <RequirementRow label="Reading" icon="📄"
              value={progress.requirements.reading.completed}
              max={progress.requirements.reading.required}
              accuracy={progress.requirements.reading.accuracy}
              accThreshold={70} />
            {progress.requirements.quiz.required > 0 && (
              <RequirementRow label="Quiz" icon="🎯"
                value={progress.requirements.quiz.completed}
                max={progress.requirements.quiz.required}
                accuracy={progress.requirements.quiz.accuracy}
                accThreshold={70} />
            )}
            {progress.requirements.writing.required > 0 && (
              <RequirementRow label="Writing" icon="🖊️"
                value={progress.requirements.writing.completed}
                max={progress.requirements.writing.required}
                accuracy={progress.requirements.writing.avgScore}
                accThreshold={65} />
            )}
            {progress.requirements.listening.required > 0 && (
              <RequirementRow label="Listening" icon="🎧"
                value={progress.requirements.listening.completed}
                max={progress.requirements.listening.required}
                accuracy={progress.requirements.listening.accuracy}
                accThreshold={65} />
            )}
          </Card>
        )}

        {/* Activity stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Card>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
              📈 Activity (14 days)
            </h3>
            <XPChart activities={activities} />
          </Card>

          <Card>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
              📋 Overall Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Grammar exercises', value: user?.stats?.grammarCompleted || 0, icon: '✏️' },
                { label: 'Words learned', value: user?.stats?.vocabularyLearned || 0, icon: '📚' },
                { label: 'Texts read', value: user?.stats?.readingCompleted || 0, icon: '📄' },
                { label: 'Writing submissions', value: user?.stats?.writingSubmitted || 0, icon: '🖊️' },
                { label: 'Listening done', value: user?.stats?.listeningCompleted || 0, icon: '🎧' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{s.icon} {s.label}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Level test history */}
      {testHistory.length > 0 && (
        <Card>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
            🏆 {t('progress.testHistory')}
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Level</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Score</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Result</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Grammar</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Vocab</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Reading</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...testHistory].reverse().map((t, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem 0.75rem' }}><LevelBadge level={t.level} /></td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: t.score >= 85 ? 'var(--success)' : 'var(--danger)' }}>{t.score}%</td>
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span style={{ padding: '0.15rem 0.6rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600, background: t.passed ? 'var(--success-light)' : 'var(--danger-light)', color: t.passed ? 'var(--success)' : 'var(--danger)' }}>
                        {t.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.breakdown?.grammar}%</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.breakdown?.vocabulary}%</td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.breakdown?.reading}%</td>
                    <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{new Date(t.takenAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
