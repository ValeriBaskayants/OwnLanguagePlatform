import { ReactNode, CSSProperties } from 'react';

// ── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`spinner ${size === 'lg' ? 'spinner-lg' : size === 'sm' ? '' : ''}`}
    style={size === 'sm' ? { width: 14, height: 14, borderWidth: 2 } : undefined} />;
}

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'muted' }: { children: ReactNode; variant?: 'accent' | 'success' | 'danger' | 'muted' | 'level' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function LevelBadge({ level }: { level: string }) {
  const color = level?.startsWith('A') ? '#4A7C59' : level?.startsWith('B') ? '#2980B9' : '#8E44AD';
  return (
    <span style={{
      background: color, color: '#fff',
      padding: '0.18rem 0.6rem', borderRadius: '100px',
      fontSize: '0.75rem', fontWeight: 700, fontFamily: 'DM Mono, monospace',
    }}>{level}</span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, 'success' | 'accent' | 'danger'> = {
    easy: 'success', medium: 'accent', hard: 'danger',
  };
  return <Badge variant={map[difficulty] || 'muted'}>{difficulty}</Badge>;
}

// ── ProgressBar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, max, color = 'default', label }: {
  value: number; max: number; color?: 'default' | 'success' | 'danger'; label?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          <span>{label}</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600 }}>{value}/{max}</span>
        </div>
      )}
      <div className="progress-track">
        <div className={`progress-fill ${color === 'success' ? 'success' : ''}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, className = '', onClick }: {
  children: ReactNode; style?: CSSProperties; className?: string; onClick?: () => void;
}) {
  return (
    <div className={`card ${className}`} style={style}
      onClick={onClick} role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, children, title }: {
  open: boolean; onClose: () => void; children: ReactNode; title?: string;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box fade-in">
        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>{title}</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: 'var(--text-muted)', cursor: 'pointer', lineHeight: 1 }}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ── XP Chip ──────────────────────────────────────────────────────────────────
export function XPChip({ amount }: { amount: number }) {
  return <span className="xp-chip">+{amount} XP</span>;
}

// ── ScoreRing ─────────────────────────────────────────────────────────────────
export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--accent)' : 'var(--danger)';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-color)" strokeWidth={6} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s ease-in-out' }} />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
        style={{ transform: `rotate(90deg) translate(0, -${size}px)`, fontSize: size > 60 ? '1.1rem' : '0.8rem', fontWeight: 700, fill: 'var(--text-primary)', fontFamily: 'DM Mono, monospace' }}>
        {score}%
      </text>
    </svg>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📭', title, description, action }: {
  icon?: string; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p style={{ marginBottom: '1rem' }}>{description}</p>}
      {action}
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: {
  tabs: Array<{ key: string; label: string; icon?: string }>;
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button key={tab.key} className={`tab-btn ${active === tab.key ? 'active' : ''}`}
          onClick={() => onChange(tab.key)}>
          {tab.icon && <span style={{ marginRight: '0.3rem' }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Alert ─────────────────────────────────────────────────────────────────────
export function Alert({ type = 'info', children }: { type?: 'info' | 'success' | 'danger' | 'warning'; children: ReactNode }) {
  const icons = { info: 'ℹ️', success: '✅', danger: '❌', warning: '⚠️' };
  return (
    <div className={`alert alert-${type}`}>
      <span>{icons[type]}</span>
      <div>{children}</div>
    </div>
  );
}
