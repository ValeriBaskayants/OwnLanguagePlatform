import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { grammarRulesService, bookmarksService } from '../services';
import { GrammarRule, LEVELS } from '../types';
import { Spinner, LevelBadge, Card, EmptyState } from '../components/ui';

function RuleDetail({ rule, onClose }: { rule: GrammarRule; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 200, overflowY: 'auto' }} className="fade-in">
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ marginBottom: '1.5rem' }}>← Back</button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem' }}>{rule.topic}</h1>
          <LevelBadge level={rule.level} />
        </div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>{rule.summary}</p>

        {/* Core concept */}
        {rule.coreConcept && (
          <div style={{ padding: '1.25rem', background: 'var(--surface-elevated)', borderLeft: '4px solid var(--accent)', borderRadius: '8px', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent)', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
              💡 Core Concept
            </h4>
            <p style={{ color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>{rule.coreConcept}</p>
          </div>
        )}

        {/* Structure formula */}
        {rule.structure && (
          <div style={{ padding: '1rem 1.25rem', background: 'var(--accent-light)', borderRadius: '10px', marginBottom: '2rem', fontFamily: 'DM Mono, monospace', fontSize: '1rem', color: 'var(--accent-hover)', fontWeight: 600 }}>
            📐 Structure: {rule.structure}
          </div>
        )}

        {/* When to use */}
        {rule.usages && rule.usages.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
              📌 When to use?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rule.usages.map((u, i) => (
                <Card key={i}>
                  <h4 style={{ color: 'var(--accent)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                    {i + 1}. {u.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {u.explanation}
                  </p>
                  {u.examples?.map((ex, j) => (
                    <div key={j} style={{ padding: '0.5rem 0.75rem', borderLeft: '3px solid var(--border-color)', marginBottom: '0.5rem', background: 'var(--surface-elevated)', borderRadius: '0 6px 6px 0' }}>
                      <p style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '0.9rem' }}>{ex.sentence}</p>
                      {ex.translation && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>AM {ex.translation}</p>}
                    </div>
                  ))}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Forms */}
        {rule.sections && rule.sections.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
              🏗️ Forms
            </h3>
            {rule.sections.map((s, i) => (
              <Card key={i} style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', color: 'var(--accent)', fontSize: '0.95rem', fontWeight: 700 }}>{s.title}</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.content}</p>
                {s.examples?.map((ex, j) => (
                  <div key={j} style={{ padding: '0.5rem 0.75rem', borderLeft: '3px solid var(--accent)', marginBottom: '0.5rem' }}>
                    <p style={{ fontStyle: 'italic', fontWeight: 500, fontSize: '0.9rem' }}>{ex.sentence}</p>
                    {ex.translation && <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>🇷🇺 {ex.translation}</p>}
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        {/* Comparisons */}
        {rule.comparisons && rule.comparisons.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem' }}>
              ⚖️ Compare with other tenses
            </h3>
            {rule.comparisons.map((comp, i) => (
              <Card key={i} style={{ marginBottom: '1rem', borderColor: 'var(--accent-light)' }}>
                <h4 style={{ marginBottom: '0.5rem', color: 'var(--accent-hover)', fontSize: '0.95rem' }}>
                  vs. {comp.compareWith}
                </h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {comp.explanation}
                </p>
                {comp.examples?.map((ex, j) => (
                  <div key={j} style={{ padding: '0.6rem 0.9rem', background: 'var(--accent-light)', borderRadius: '6px', marginBottom: '0.4rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-hover)' }}>{ex.sentence}</p>
                    {ex.translation && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{ex.translation}</p>}
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        {/* Signal words + Mistakes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {rule.signalWords?.length > 0 && (
            <Card>
              <h4 style={{ marginBottom: '0.75rem' }}>⚡ Signal Words</h4>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {rule.signalWords.map(w => (
                  <span key={w} style={{ padding: '0.25rem 0.6rem', background: 'var(--accent-light)', color: 'var(--accent-hover)', borderRadius: '6px', fontSize: '0.82rem', fontFamily: 'DM Mono, monospace' }}>
                    {w}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {rule.commonMistakes?.length > 0 && (
            <Card>
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--danger)' }}>⚠️ Common Mistakes</h4>
              {rule.commonMistakes.map((m, i) => (
                <p key={i} style={{ padding: '0.4rem 0', borderTop: i > 0 ? '1px solid var(--border-color)' : 'none', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  • {m}
                </p>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LessonsPage() {
  const { t } = useTranslation();
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [selected, setSelected] = useState<GrammarRule | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const [r, bm] = await Promise.all([
          grammarRulesService.getAll(filterLevel),
          bookmarksService.getAll(),
        ]);
        setRules(r);
        setBookmarks(new Set(
          bm.filter((b: any) => b.itemType === 'grammar_rule').map((b: any) => b.itemId)
        ));
      } catch {}
      finally { setLoading(false); }
    })();
  }, [filterLevel]);

  const toggleBookmark = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await bookmarksService.toggle(id, 'grammar_rule');
      setBookmarks(prev => {
        const s = new Set(prev);
        s.has(id) ? s.delete(id) : s.add(id);
        return s;
      });
    } catch {}
  };

  if (selected) return <RuleDetail rule={selected} onClose={() => setSelected(null)} />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>📖 {t('nav.lessons')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Grammar rules with explanations, examples and comparisons</p>
      </div>

      {/* Level filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setFilterLevel('')}
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
      ) : rules.length === 0 ? (
        <EmptyState icon="📖" title="No grammar rules yet" description="Import grammar rules from the Admin panel." />
      ) : (
        <div className="grid-2">
          {rules.map(rule => (
            <Card key={rule._id} onClick={() => setSelected(rule)} style={{ cursor: 'pointer', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <LevelBadge level={rule.level} />
                  {rule.usages && rule.usages.length > 0 && (
                    <span className="badge badge-muted">{rule.usages.length} usages</span>
                  )}
                </div>
                <button
                  onClick={e => toggleBookmark(e, rule._id)}
                  style={{ background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', opacity: bookmarks.has(rule._id) ? 1 : 0.25, transition: 'opacity 0.15s' }}>
                  🔖
                </button>
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', marginBottom: '0.4rem' }}>
                {rule.topic}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                {rule.summary}
              </p>
              {rule.coreConcept && (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                  💡 {rule.coreConcept.slice(0, 80)}{rule.coreConcept.length > 80 ? '…' : ''}
                </p>
              )}
              {rule.structure && (
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: 'var(--accent)', background: 'var(--accent-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  {rule.structure}
                </span>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}