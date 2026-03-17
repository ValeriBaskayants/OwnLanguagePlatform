import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { progressService, mistakesService, vocabularyService, authService } from '../services';
import { LevelBadge, ProgressBar, Spinner, Card } from '../components/ui';
import { DailyActivity, WeakSpot, LevelProgress } from '../types';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function StreakCalendar({ activities }: { activities: DailyActivity[] }) {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const actMap = new Map(activities.map(a => [a.date, a.xpEarned]));
  return (
    <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
      {days.map(day => {
        const xp = actMap.get(day) || 0;
        const intensity = xp === 0 ? 0 : xp < 50 ? 1 : xp < 150 ? 2 : xp < 300 ? 3 : 4;
        const colors = ['var(--surface-elevated)', 'rgba(232,168,69,0.25)', 'rgba(232,168,69,0.5)', 'rgba(232,168,69,0.75)', 'var(--accent)'];
        return (
          <div key={day} title={`${day}: ${xp} XP`} style={{
            width: 12, height: 12, borderRadius: 3,
            background: colors[intensity],
            border: '1px solid var(--border-color)',
          }} />
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [weakSpots, setWeakSpots] = useState<WeakSpot[]>([]);
  const [vocabProgress, setVocabProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [dash, weak, vp, me] = await Promise.all([
          progressService.getDashboard(),
          mistakesService.getWeakSpots(),
          vocabularyService.getUserProgress(),
          authService.getMe(),
        ]);
        setDashboard(dash);
        setWeakSpots(weak.slice(0, 3));
        setVocabProgress(vp);
        updateUser(me);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Spinner size="lg" />
    </div>
  );

  const progress: LevelProgress | null = dashboard?.progress || null;
  const activities: DailyActivity[] = dashboard?.activities || [];
  const todayXp = activities.find(a => a.date === new Date().toISOString().slice(0, 10))?.xpEarned || 0;

  const greet = getGreeting();
  const greetText = t(`home.${greet}`);

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          {t('home.title', { time: greetText })} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user?.email}
        </p>
      </div>

      {/* Top stats row */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        {/* Level card */}
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            {t('common.level')}
          </div>
          <LevelBadge level={user?.currentLevel || 'A1'} />
          {progress && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              → {progress.targetLevel}
            </div>
          )}
        </Card>

        {/* XP card */}
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Total XP
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
            {(user?.xp || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            +{todayXp} {t('home.xpToday')}
          </div>
        </Card>

        {/* Streak card */}
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            {t('common.streak')}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#E67E22', fontFamily: 'DM Mono, monospace' }}>
            🔥 {user?.streak || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {t('home.weeklyStreak')}
          </div>
        </Card>

        {/* Vocab due */}
        <Card style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            Flashcards
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--info)', fontFamily: 'DM Mono, monospace' }}>
            {vocabProgress?.dueToday || 0}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {t('home.dueToday')}
          </div>
        </Card>
      </div>

      {/* Main content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Level progress */}
        {progress && (
          <Card style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem' }}>
                Progress to <LevelBadge level={progress.targetLevel} />
              </h3>
              {progress.isReadyForTest && (
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/level-test')}>
                  🏆 Take Test!
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <ProgressBar label="Grammar" value={progress.requirements.grammar.completed} max={progress.requirements.grammar.required} />
              <ProgressBar label="Vocabulary" value={progress.requirements.vocabulary.learned} max={progress.requirements.vocabulary.required} />
              <ProgressBar label="Reading" value={progress.requirements.reading.completed} max={progress.requirements.reading.required} />
              {progress.requirements.quiz.required > 0 && (
                <ProgressBar label="Quiz" value={progress.requirements.quiz.completed} max={progress.requirements.quiz.required} />
              )}
              {progress.requirements.writing.required > 0 && (
                <ProgressBar label="Writing" value={progress.requirements.writing.completed} max={progress.requirements.writing.required} />
              )}
              {progress.requirements.listening.required > 0 && (
                <ProgressBar label="Listening" value={progress.requirements.listening.completed} max={progress.requirements.listening.required} />
              )}
            </div>
          </Card>
        )}

        {/* Quick actions */}
        <Card>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { label: '✏️ ' + t('home.continueExercises'), to: '/exercises', primary: true },
              { label: '📚 ' + t('home.startFlashcards'), to: '/vocabulary' },
              { label: '🔍 ' + t('home.reviewMistakes'), to: '/mistakes' },
              { label: '📄 Reading Practice', to: '/reading' },
            ].map(a => (
              <button key={a.to} onClick={() => navigate(a.to)}
                className={`btn ${a.primary ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start' }}>
                {a.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Weak spots */}
        <Card>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
            🎯 {t('home.weakTopics')}
          </h3>
          {weakSpots.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No weak spots yet — keep practicing!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {weakSpots.map((w, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{w.topic}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{w.itemType}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--danger)', fontFamily: 'DM Mono, monospace', fontWeight: 700 }}>
                      {w.count}× wrong
                    </span>
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/exercises')}>
                      Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Activity calendar */}
      <Card>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
          📅 Activity (Last 30 days)
        </h3>
        <StreakCalendar activities={activities} />
        {activities.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.75rem' }}>
            {t('home.noActivity')}
          </p>
        )}
      </Card>
    </div>
  );
}
