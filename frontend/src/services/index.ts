import api from './api.client';

export const authService = {
  register: (email: string, password: string) => api.post('/api/auth/register', { email, password }).then(r => r.data),
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }).then(r => r.data),
  getMe: () => api.get('/api/auth/me').then(r => r.data),
};

export const exercisesService = {
  getAll: (params?: Record<string, string | number>) => api.get('/api/exercises', { params }).then(r => r.data),
  getTopics: (level?: string) => api.get('/api/exercises/topics', { params: { level } }).then(r => r.data),
};

export const grammarRulesService = {
  getAll: (level?: string) => api.get('/api/grammar-rules', { params: { level } }).then(r => r.data),
  getBySlug: (slug: string) => api.get(`/api/grammar-rules/${slug}`).then(r => r.data),
};

export const vocabularyService = {
  getAll: (params?: Record<string, string | number>) => api.get('/api/vocabulary', { params }).then(r => r.data),
  getFlashcards: (level?: string, type?: string, limit = 20) =>
    api.get('/api/vocabulary/flashcards', { params: { level, type, limit } }).then(r => r.data),
  getUserProgress: () => api.get('/api/vocabulary/user-progress').then(r => r.data),
  review: (wordId: string, quality: 0 | 1 | 2 | 3) =>
    api.post('/api/vocabulary/review', { wordId, quality }).then(r => r.data),
};

export const readingsService = {
  getAll: (level?: string, topic?: string) => api.get('/api/readings', { params: { level, topic } }).then(r => r.data),
  getById: (id: string) => api.get(`/api/readings/${id}`).then(r => r.data),
};

export const multipleChoiceService = {
  getAll: (params?: Record<string, string | number>) => api.get('/api/multiple-choice', { params }).then(r => r.data),
};

export const listeningService = {
  getAll: (params?: Record<string, string>) => api.get('/api/listening', { params }).then(r => r.data),
};

export const writingService = {
  getPrompts: (level?: string) => api.get('/api/writing/prompts', { params: { level } }).then(r => r.data),
  getPromptById: (id: string) => api.get(`/api/writing/prompts/${id}`).then(r => r.data),
  submit: (promptId: string, text: string) => api.post('/api/writing/submit', { promptId, text }).then(r => r.data),
  getSubmissions: (promptId?: string) => api.get('/api/writing/submissions', { params: { promptId } }).then(r => r.data),
  getSubmission: (id: string) => api.get(`/api/writing/submissions/${id}`).then(r => r.data),
};

export const sessionsService = {
  create: (data: any) => api.post('/api/sessions', data).then(r => r.data),
  getHistory: () => api.get('/api/sessions/history').then(r => r.data),
};

export const mistakesService = {
  getAll: (itemType?: string) => api.get('/api/mistakes', { params: { itemType } }).then(r => r.data),
  getWeakSpots: () => api.get('/api/mistakes/weak-spots').then(r => r.data),
};

export const progressService = {
  get: () => api.get('/api/progress').then(r => r.data),
  getDashboard: () => api.get('/api/progress/dashboard').then(r => r.data),
  getStreak: () => api.get('/api/progress/streak').then(r => r.data),
};

export const levelTestService = {
  getQuestions: () => api.get('/api/level-test/questions').then(r => r.data),
  submit: (data: any) => api.post('/api/level-test/submit', data).then(r => r.data),
};

export const bookmarksService = {
  getAll: () => api.get('/api/bookmarks').then(r => r.data),
  toggle: (itemId: string, itemType: string) => api.post('/api/bookmarks', { itemId, itemType }).then(r => r.data),
  remove: (id: string) => api.delete(`/api/bookmarks/${id}`).then(r => r.data),
};

export const adminService = {
  importExercises: (data: any) => api.post('/api/admin/import/exercises', data).then(r => r.data),
  importGrammarRules: (data: any) => api.post('/api/admin/import/grammar-rules', data).then(r => r.data),
  importVocabulary: (data: any) => api.post('/api/admin/import/vocabulary', data).then(r => r.data),
  importReadings: (data: any) => api.post('/api/admin/import/readings', data).then(r => r.data),
  importMultipleChoice: (data: any) => api.post('/api/admin/import/multiple-choice', data).then(r => r.data),
  importWritingPrompts: (data: any) => api.post('/api/admin/import/writing-prompts', data).then(r => r.data),
  importListening: (data: any) => api.post('/api/admin/import/listening', data).then(r => r.data),
  getStats: () => api.get('/api/admin/stats').then(r => r.data),
};

export const translateWord = async (text: string, targetLang = 'ru'): Promise<string> => {
  try {
    const r = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`);
    const data = await r.json();
    return data.responseData?.translatedText || text;
  } catch {
    return text;
  }
};