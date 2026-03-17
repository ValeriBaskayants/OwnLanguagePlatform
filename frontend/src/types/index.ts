export interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin';
  currentLevel: string;
  xp: number;
  streak: number;
  lastActivityDate?: string;
  stats: {
    grammarCompleted: number;
    grammarAccuracy: number;
    vocabularyLearned: number;
    readingCompleted: number;
    writingSubmitted: number;
    listeningCompleted: number;
    quizCompleted: number;
    totalSessionTime: number;
  };
  levelTests: LevelTestHistory[];
}

export interface LevelTestHistory {
  level: string;
  attemptNumber: number;
  score: number;
  passed: boolean;
  takenAt: string;
  breakdown: { grammar: number; vocabulary: number; reading: number; listening: number };
}

export interface LevelProgress {
  _id: string;
  userId: string;
  level: string;
  targetLevel: string;
  requirements: {
    grammar:    { required: number; completed: number; accuracy: number };
    vocabulary: { required: number; learned: number };
    reading:    { required: number; completed: number; accuracy: number };
    writing:    { required: number; completed: number; avgScore: number };
    listening:  { required: number; completed: number; accuracy: number };
    quiz:       { required: number; completed: number; accuracy: number };
  };
  isReadyForTest: boolean;
  testUnlockedAt?: string;
}

export interface Exercise {
  _id: string;
  topic: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sentence: string;
  blanks: Array<{ position: number; answer: string; hint?: string }>;
  explanation: string;
  tags: string[];
}

export interface GrammarRule {
  _id: string;
  topic: string;
  slug: string;
  level: string;
  summary: string;
  coreConcept?: string;
  structure: string;
  usages?: Array<{
    title: string;
    explanation: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;
  sections: Array<{
    title: string;
    content: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;
  comparisons?: Array<{
    compareWith: string;
    explanation: string;
    examples: Array<{ sentence: string; translation?: string }>;
  }>;
  commonMistakes: string[];
  signalWords: string[];
  relatedTopics: string[];
}

export interface VocabularyWord {
  _id: string;
  word: string;
  level: string;
  type: string;
  pronunciation?: string;
  definition: string;
  definitionRu?: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  imageUrl?: string;
  forms?: Record<string, string>;
  isIrregularVerb: boolean;
}

export interface FlashcardItem {
  word: VocabularyWord;
  progress: {
    status: string;
    interval: number;
    repetitions: number;
    easinessFactor: number;
    nextReviewDate: string;
  } | null;
}

export interface Reading {
  _id: string;
  title: string;
  level: string;
  topic: string;
  content: string;
  wordCount: number;
  estimatedMinutes: number;
  questions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    type: string;
  }>;
}

export interface MultipleChoiceQuestion {
  _id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ListeningExercise {
  _id: string;
  text: string;
  level: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'dictation' | 'comprehension';
  questions?: Array<{ question: string; options: string[]; correctIndex: number }>;
}

export interface WritingPrompt {
  _id: string;
  prompt: string;
  level: string;
  type: 'sentence' | 'paragraph' | 'essay';
  minWords: number;
  maxWords: number;
  topic: string;
  instructions: string;
}

export interface WritingSubmission {
  _id: string;
  userId: string;
  promptId: string | WritingPrompt;
  text: string;
  analysis: {
    overallScore: number;
    grammarScore: number;
    taskScore: number;
    coherenceScore: number;
    wordCount: number;
    errorCount: number;
    errors: Array<{ message: string; context: string; offset: number; length: number; replacements: string[] }>;
  } | null;
  status: 'pending' | 'analyzed' | 'error';
  submittedAt: string;
}

export interface Mistake {
  _id: string;
  userId: string;
  itemId: string;
  itemType: 'grammar' | 'quiz' | 'vocabulary' | 'listening';
  topic: string;
  level: string;
  difficulty: string;
  wrongAnswers: Array<{ userAnswer: string; correctAnswer: string; occurredAt: string }>;
  occurrenceCount: number;
  lastAttemptAt: string;
}

export interface WeakSpot {
  topic: string;
  itemType: string;
  count: number;
  level: string;
}

export interface DailyActivity {
  _id: string;
  userId: string;
  date: string;
  xpEarned: number;
  sessionsCount: number;
  minutesSpent: number;
}

export interface Bookmark {
  _id: string;
  userId: string;
  itemId: string;
  itemType: 'grammar_rule' | 'vocabulary' | 'reading' | 'writing_prompt';
  createdAt: string;
}

export interface SessionAnswer {
  itemId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpentMs: number;
  topic?: string;
  difficulty?: string;
  sectionType?: string;
}

export const LEVELS = ['A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C2'] as const;
export type Level = typeof LEVELS[number];