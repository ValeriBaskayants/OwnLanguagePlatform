import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../services';
import { Spinner, Card, Tabs, Alert } from '../components/ui';

const IMPORT_TYPES = [
  {
    key: 'exercises', label: 'Grammar Exercises', icon: '✏️',
    fn: (d: any) => adminService.importExercises(d),
    placeholder: `{
  "exercises": [
    {
      "topic": "Present Simple",
      "level": "A1",
      "difficulty": "easy",
      "sentence": "She _____ to school every day.",
      "blanks": [{ "position": 0, "answer": "goes", "hint": "3rd person" }],
      "explanation": "We use 's' with he/she/it in Present Simple.",
      "tags": ["a1", "present-simple"]
    }
  ]
}`,
  },
  {
    key: 'grammar-rules', label: 'Grammar Rules', icon: '📖',
    fn: (d: any) => adminService.importGrammarRules(d),
    placeholder: `{
  "grammarRules": [
    {
      "topic": "Present Simple",
      "slug": "present-simple",
      "level": "A1",
      "summary": "Used for habits, routines and permanent facts.",
      "coreConcept": "Describes permanent states and repeated actions — the 'default settings' of reality. If something is always true or happens regularly, use Present Simple.",
      "structure": "Subject + V(s/es) | don't/doesn't + V | Do/Does + Subject + V?",
      "usages": [
        {
          "title": "Habits and routines",
          "explanation": "Actions that happen regularly, with signal words: always, usually, every day.",
          "examples": [
            { "sentence": "I drink coffee every morning.", "translation": "Я пью кофе каждое утро." },
            { "sentence": "She never eats meat.", "translation": "Она никогда не ест мясо." }
          ]
        },
        {
          "title": "Permanent facts and general truths",
          "explanation": "Things that are always true — scientific facts, geography, definitions.",
          "examples": [
            { "sentence": "Water boils at 100 degrees.", "translation": "Вода кипит при 100 градусах." }
          ]
        }
      ],
      "sections": [
        {
          "title": "Affirmative",
          "content": "I/You/We/They + base verb. He/She/It + verb + s/es.",
          "examples": [
            { "sentence": "She goes to work.", "translation": "Она ходит на работу." },
            { "sentence": "They play football.", "translation": "Они играют в футбол." }
          ]
        },
        {
          "title": "Negative",
          "content": "I/You/We/They + don't + base verb. He/She/It + doesn't + base verb.",
          "examples": [
            { "sentence": "He doesn't like coffee.", "translation": "Он не любит кофе." }
          ]
        },
        {
          "title": "Question",
          "content": "Do + I/You/We/They + base verb? Does + He/She/It + base verb?",
          "examples": [
            { "sentence": "Does she speak French?", "translation": "Она говорит по-французски?" }
          ]
        }
      ],
      "comparisons": [
        {
          "compareWith": "Present Continuous",
          "explanation": "Present Simple = permanent / always true. Present Continuous = happening right now or temporarily.",
          "examples": [
            { "sentence": "I live in London. (Simple — permanent)", "translation": "Я живу в Лондоне (постоянно)." },
            { "sentence": "I am living in London. (Continuous — temporary)", "translation": "Я живу в Лондоне (временно, несколько месяцев)." }
          ]
        }
      ],
      "signalWords": ["always", "usually", "often", "sometimes", "never", "every day", "on Mondays"],
      "commonMistakes": [
        "She go to school. ✗ → She goes to school. ✓",
        "He don't like it. ✗ → He doesn't like it. ✓",
        "Do she work here? ✗ → Does she work here? ✓"
      ],
      "relatedTopics": ["Present Continuous", "Past Simple"]
    }
  ]
}`,
  },
  {
    key: 'vocabulary', label: 'Vocabulary', icon: '📚',
    fn: (d: any) => adminService.importVocabulary(d),
    placeholder: `{
  "vocabulary": [
    {
      "word": "apple",
      "level": "A1",
      "type": "noun",
      "pronunciation": "ˈæp.əl",
      "definition": "A round fruit with red, green or yellow skin.",
      "definitionRu": "Яблоко",
      "examples": ["I eat an apple every day.", "She bought three red apples."],
      "synonyms": [],
      "antonyms": [],
      "isIrregularVerb": false
    }
  ]
}`,
  },
  {
    key: 'readings', label: 'Reading Texts', icon: '📄',
    fn: (d: any) => adminService.importReadings(d),
    placeholder: `{
  "readings": [
    {
      "title": "My Family",
      "level": "A1",
      "topic": "Family",
      "content": "My name is Anna. I have a small family. My mother's name is Maria. She is a teacher. My father's name is Peter. He is a doctor. I have one brother. His name is Tom. He is eight years old. We live in a small house. We are very happy.",
      "questions": [
        {
          "question": "What does Anna's mother do?",
          "options": ["Doctor", "Teacher", "Engineer", "Nurse"],
          "correctIndex": 1,
          "explanation": "The text says 'My mother is a teacher'.",
          "type": "detail"
        }
      ]
    }
  ]
}`,
  },
  {
    key: 'multiple-choice', label: 'Quiz Questions', icon: '🎯',
    fn: (d: any) => adminService.importMultipleChoice(d),
    placeholder: `{
  "multipleChoice": [
    {
      "question": "Which sentence is correct?",
      "options": [
        "She don't like coffee.",
        "She doesn't likes coffee.",
        "She doesn't like coffee.",
        "She not like coffee."
      ],
      "correctIndex": 2,
      "explanation": "With he/she/it we use 'doesn't' + base verb.",
      "topic": "Present Simple",
      "level": "A1",
      "difficulty": "easy"
    }
  ]
}`,
  },
  {
    key: 'writing-prompts', label: 'Writing Prompts', icon: '🖊️',
    fn: (d: any) => adminService.importWritingPrompts(d),
    placeholder: `{
  "writingPrompts": [
    {
      "prompt": "Write about your family. Describe who is in your family and what they do.",
      "level": "A1",
      "type": "paragraph",
      "minWords": 50,
      "maxWords": 100,
      "topic": "Family",
      "instructions": "Include: names, ages, jobs, relationships"
    }
  ]
}`,
  },
  {
    key: 'listening', label: 'Listening', icon: '🎧',
    fn: (d: any) => adminService.importListening(d),
    placeholder: `{
  "listening": [
    {
      "text": "My name is Anna. I am ten years old. I live in London. I go to school every day. My favourite subject is English.",
      "level": "A1",
      "type": "dictation",
      "difficulty": "easy",
      "topic": "Introductions"
    },
    {
      "text": "Tom goes to the supermarket. He buys milk, bread and eggs. He pays five dollars.",
      "level": "A1",
      "type": "comprehension",
      "difficulty": "easy",
      "topic": "Shopping",
      "questions": [
        {
          "question": "Where does Tom go?",
          "options": ["School", "Supermarket", "Park", "Bank"],
          "correctIndex": 1
        }
      ]
    }
  ]
}`,
  },
];

function ImportTab({ type }: { type: typeof IMPORT_TYPES[0] }) {
  const { t } = useTranslation();
  const [json, setJson] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: number } | null>(null);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateJson = (text: string) => {
    if (!text.trim()) { setIsValid(null); return; }
    try { JSON.parse(text); setIsValid(true); } catch { setIsValid(false); }
  };

  const handleChange = (v: string) => { setJson(v); validateJson(v); setResult(null); setError(''); };

  const handleImport = async () => {
    if (!isValid) return;
    setLoading(true); setResult(null); setError('');
    try {
      const data = JSON.parse(json);
      const res = await type.fn(data);
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Import failed');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.82rem', color: isValid === null ? 'var(--text-muted)' : isValid ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
          {isValid === null ? 'Paste JSON below' : isValid ? t('admin.validJson') : t('admin.invalidJson')}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => { setJson(type.placeholder); validateJson(type.placeholder); }}>
          Load Example
        </button>
      </div>

      <textarea
        value={json}
        onChange={e => handleChange(e.target.value)}
        rows={16}
        className="input"
        placeholder={type.placeholder}
        spellCheck={false}
        style={{
          fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', resize: 'vertical',
          borderColor: isValid === true ? 'var(--success)' : isValid === false ? 'var(--danger)' : undefined,
          lineHeight: 1.7,
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
        <button className="btn btn-primary" onClick={handleImport} disabled={!isValid || loading} style={{ minWidth: 130 }}>
          {loading ? <Spinner size="sm" /> : `${t('admin.importBtn')} →`}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--surface-elevated)', borderRadius: '10px', display: 'flex', gap: '1.5rem' }} className="fade-in">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'DM Mono, monospace' }}>{result.inserted}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Inserted</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)', fontFamily: 'DM Mono, monospace' }}>{result.skipped}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skipped (dupes)</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: result.errors > 0 ? 'var(--danger)' : 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>{result.errors}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Errors</div>
          </div>
        </div>
      )}

      {error && <Alert type="danger">{error}</Alert>}
    </div>
  );
}

function StatsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await adminService.getStats();
    setStats(data); setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif' }}>User Statistics</h3>
        <button className="btn btn-ghost btn-sm" onClick={load} disabled={loading}>
          {loading ? <Spinner size="sm" /> : '↻ Refresh'}
        </button>
      </div>

      {!stats && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          Click Refresh to load user data
        </div>
      )}

      {stats && (
        <>
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--accent-light)', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-hover)' }}>
            Total users: {stats.totalUsers}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Level</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>XP</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Streak</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Grammar</th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>Vocab</th>
                </tr>
              </thead>
              <tbody>
                {stats.users.map((u: any) => (
                  <tr key={u.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.55rem 0.75rem', fontWeight: 500 }}>{u.email}</td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>
                      <span style={{ padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: 600, background: u.role === 'admin' ? 'var(--accent-light)' : 'var(--surface-elevated)', color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: '0.78rem' }}>{u.currentLevel}</td>
                    <td style={{ padding: '0.55rem 0.75rem', fontFamily: 'DM Mono, monospace', color: 'var(--accent)' }}>{u.xp?.toLocaleString()}</td>
                    <td style={{ padding: '0.55rem 0.75rem' }}>🔥 {u.streak}</td>
                    <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>{u.stats?.grammarCompleted || 0}</td>
                    <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)' }}>{u.stats?.vocabularyLearned || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('exercises');

  const tabs = [
    ...IMPORT_TYPES.map(t => ({ key: t.key, label: t.label, icon: t.icon })),
    { key: 'stats', label: 'User Stats', icon: '👥' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>⚙️ {t('admin.title')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Import content and monitor users</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <Card style={{ maxWidth: 820 }}>
        {activeTab === 'stats' ? (
          <StatsPanel />
        ) : (
          <>
            {IMPORT_TYPES.filter(t => t.key === activeTab).map(type => (
              <div key={type.key}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: '0.35rem' }}>
                    {type.icon} Import {type.label}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Paste JSON array. Duplicates are skipped automatically.
                  </p>
                </div>
                <ImportTab type={type} />
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}