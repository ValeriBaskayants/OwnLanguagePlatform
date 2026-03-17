import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LevelProgress, LevelProgressDocument } from './schemas/level-progress.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { DailyActivity, DailyActivityDocument } from '../daily-activity/schemas/daily-activity.schema';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';

const LEVEL_THRESHOLDS: Record<string, any> = {
  A1: { 
    grammar: 30, vocabulary: 500, reading: 5, writing: 3, listening: 5, quiz: 20, 
    grammarAcc: 70, readingAcc: 70, quizAcc: 75, writingAvg: 60, listeningAcc: 65 
  },
  'A1+': { 
    grammar: 50, vocabulary: 800, reading: 8, writing: 6, listening: 10, quiz: 30, 
    grammarAcc: 72, readingAcc: 72, quizAcc: 77, writingAvg: 65, listeningAcc: 68 
  },
  A2: { 
    grammar: 80, vocabulary: 1200, reading: 12, writing: 10, listening: 15, quiz: 45, 
    grammarAcc: 75, readingAcc: 75, quizAcc: 80, writingAvg: 70, listeningAcc: 72 
  },
  'A2+': { 
    grammar: 110, vocabulary: 1800, reading: 18, writing: 15, listening: 25, quiz: 60, 
    grammarAcc: 77, readingAcc: 77, quizAcc: 82, writingAvg: 73, listeningAcc: 75 
  },
  B1: { 
    grammar: 150, vocabulary: 2500, reading: 25, writing: 20, listening: 40, quiz: 80, 
    grammarAcc: 80, readingAcc: 80, quizAcc: 84, writingAvg: 75, listeningAcc: 78 
  },
  'B1+': { 
    grammar: 200, vocabulary: 3500, reading: 35, writing: 30, listening: 60, quiz: 110, 
    grammarAcc: 82, readingAcc: 82, quizAcc: 86, writingAvg: 78, listeningAcc: 80 
  },
  B2: { 
    grammar: 280, vocabulary: 5000, reading: 50, writing: 45, listening: 90, quiz: 150, 
    grammarAcc: 84, readingAcc: 84, quizAcc: 88, writingAvg: 80, listeningAcc: 82 
  },
  'B2+': { 
    grammar: 350, vocabulary: 6500, reading: 70, writing: 60, listening: 120, quiz: 200, 
    grammarAcc: 85, readingAcc: 85, quizAcc: 89, writingAvg: 82, listeningAcc: 84 
  },
  C1: { 
    grammar: 450, vocabulary: 8000, reading: 100, writing: 80, listening: 160, quiz: 300, 
    grammarAcc: 87, readingAcc: 87, quizAcc: 90, writingAvg: 85, listeningAcc: 86 
  },
};

export const NEXT_LEVELS: Record<string, string> = {
  A1: 'A1+', 'A1+': 'A2', A2: 'A2+', 'A2+': 'B1',
  B1: 'B1+', 'B1+': 'B2', B2: 'B2+', 'B2+': 'C1', C1: 'C2',
};

function checkReadyForTest(req: any, thresholds: any): boolean {
  const g = req.grammar.completed >= thresholds.grammar && req.grammar.accuracy >= thresholds.grammarAcc;
  const v = req.vocabulary.learned >= thresholds.vocabulary;
  const r = req.reading.completed >= thresholds.reading && req.reading.accuracy >= thresholds.readingAcc;
  const w = thresholds.writing === 0 || (req.writing.completed >= thresholds.writing && req.writing.avgScore >= thresholds.writingAvg);
  const l = thresholds.listening === 0 || (req.listening.completed >= thresholds.listening && req.listening.accuracy >= thresholds.listeningAcc);
  const q = req.quiz.completed >= thresholds.quiz && req.quiz.accuracy >= thresholds.quizAcc;
  return g && v && r && w && l && q;
}

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(LevelProgress.name) private progressModel: Model<LevelProgressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(DailyActivity.name) private activityModel: Model<DailyActivityDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  async getUserProgress(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return null;
    const progress = await this.progressModel.findOne({ userId, level: user.currentLevel }).lean();
    return { user, progress };
  }

  async getDashboard(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) return null;
    const progress = await this.progressModel.findOne({ userId, level: user.currentLevel }).lean();
    const today = new Date().toISOString().slice(0, 10);
    const last30 = new Date(); last30.setDate(last30.getDate() - 30);
    const activities = await this.activityModel
      .find({ userId, date: { $gte: last30.toISOString().slice(0, 10) } })
      .sort({ date: 1 }).lean();
    const last14Sessions = await this.sessionModel
      .find({ userId, completedAt: { $gte: new Date(Date.now() - 14 * 86400000) } })
      .sort({ startedAt: -1 }).lean();
    return { user, progress, activities, last14Sessions };
  }

  async getStreak(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    return { streak: user?.streak || 0, lastActivityDate: user?.lastActivityDate };
  }

  async updateAfterSession(
    userId: string,
    type: string,
    score: number,
    correctCount: number,
    totalItems: number,
    xpEarned: number,
    durationMs: number,
    writingScore?: number,
    vocabLearned?: number,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) return;

    const accuracy = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = user.lastActivityDate ? new Date(user.lastActivityDate).toISOString().slice(0, 10) : null;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Update streak
    if (lastDate !== today) {
      if (lastDate === yesterday) user.streak += 1;
      else if (lastDate !== today) user.streak = 1;
      user.lastActivityDate = new Date();
    }

    // XP multiplier
    let multiplier = 1;
    if (user.streak >= 30) multiplier = 2.0;
    else if (user.streak >= 14) multiplier = 1.5;
    else if (user.streak >= 7) multiplier = 1.2;
    const actualXp = Math.round(xpEarned * multiplier);
    user.xp += actualXp;

    // Update stats
    const stats = user.stats || ({} as any);
    if (type === 'grammar') {
      stats.grammarCompleted = (stats.grammarCompleted || 0) + correctCount;
      const prev = stats.grammarAccuracy || 0;
      const count = stats.grammarCompleted || 1;
      stats.grammarAccuracy = Math.round((prev * (count - correctCount) + accuracy * correctCount) / count);
    } else if (type === 'quiz') {
      stats.quizCompleted = (stats.quizCompleted || 0) + totalItems;
    } else if (type === 'reading') {
      stats.readingCompleted = (stats.readingCompleted || 0) + 1;
    } else if (type === 'writing') {
      stats.writingSubmitted = (stats.writingSubmitted || 0) + 1;
    } else if (type === 'listening') {
      stats.listeningCompleted = (stats.listeningCompleted || 0) + 1;
    } else if (type === 'flashcard') {
      stats.vocabularyLearned = (stats.vocabularyLearned || 0) + (vocabLearned || 0);
    }
    stats.totalSessionTime = (stats.totalSessionTime || 0) + Math.round(durationMs / 60000);
    user.stats = stats;
    await user.save();

    // Update daily activity
    await this.activityModel.findOneAndUpdate(
      { userId, date: today },
      {
        $inc: { xpEarned: actualXp, sessionsCount: 1, minutesSpent: Math.round(durationMs / 60000) },
        $setOnInsert: { userId, date: today },
      },
      { upsert: true },
    );

    // Update level progress
    await this.updateLevelProgress(userId, user.currentLevel, type, accuracy, correctCount, totalItems, writingScore, vocabLearned);

    return { xpEarned: actualXp, streak: user.streak, multiplier };
  }

  private async updateLevelProgress(
    userId: string, level: string, type: string,
    accuracy: number, correctCount: number, totalItems: number,
    writingScore?: number, vocabLearned?: number,
  ) {
    const progress = await this.progressModel.findOne({ userId, level });
    if (!progress) return;

    const r = progress.requirements;
    if (type === 'grammar') {
      r.grammar.completed += correctCount;
      r.grammar.accuracy = accuracy;
    } else if (type === 'quiz') {
      r.quiz.completed += totalItems;
      r.quiz.accuracy = accuracy;
    } else if (type === 'reading') {
      r.reading.completed += 1;
      r.reading.accuracy = accuracy;
    } else if (type === 'writing' && writingScore !== undefined) {
      r.writing.completed += 1;
      const prev = r.writing.avgScore || 0;
      r.writing.avgScore = Math.round((prev * (r.writing.completed - 1) + writingScore) / r.writing.completed);
    } else if (type === 'listening') {
      r.listening.completed += 1;
      r.listening.accuracy = accuracy;
    } else if (type === 'flashcard' && vocabLearned) {
      r.vocabulary.learned += vocabLearned;
    }

    const thresholds = LEVEL_THRESHOLDS[level];
    if (thresholds) {
      const ready = checkReadyForTest(r, thresholds);
      if (ready && !progress.isReadyForTest) {
        progress.isReadyForTest = true;
        progress.testUnlockedAt = new Date();
      }
    }

    await progress.save();
    return progress;
  }

  async promoteUser(userId: string, newLevel: string) {
    await this.userModel.findByIdAndUpdate(userId, { currentLevel: newLevel });
    const nextLevel = NEXT_LEVELS[newLevel];
    if (!nextLevel) return;

    const thresholds = LEVEL_THRESHOLDS[newLevel];
    if (!thresholds) return;

    await this.progressModel.findOneAndUpdate(
      { userId, level: newLevel },
      {
        userId, level: newLevel, targetLevel: nextLevel,
        requirements: {
          grammar: { required: thresholds.grammar, completed: 0, accuracy: 0 },
          vocabulary: { required: thresholds.vocabulary, learned: 0 },
          reading: { required: thresholds.reading, completed: 0, accuracy: 0 },
          writing: { required: thresholds.writing, completed: 0, avgScore: 0 },
          listening: { required: thresholds.listening, completed: 0, accuracy: 0 },
          quiz: { required: thresholds.quiz, completed: 0, accuracy: 0 },
        },
        isReadyForTest: false, testUnlockedAt: null,
      },
      { upsert: true, new: true },
    );
  }
}
