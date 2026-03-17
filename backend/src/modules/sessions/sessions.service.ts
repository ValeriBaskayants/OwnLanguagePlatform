import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { Mistake, MistakeDocument } from '../mistakes/schemas/mistake.schema';
import { ProgressService } from '../progress/progress.service';

const XP_TABLE: Record<string, number> = {
  grammar: 5, quiz: 5, flashcard: 3, reading: 15, writing: 10, listening: 8, level_test: 500,
};

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Mistake.name) private mistakeModel: Model<MistakeDocument>,
    private progressService: ProgressService,
  ) {}

  async createSession(userId: string, body: {
    type: string; level: string;
    answers: Array<{ itemId: string; userAnswer: string; correctAnswer: string; isCorrect: boolean; timeSpentMs: number; topic?: string; difficulty?: string }>;
    durationMs: number; writingScore?: number; vocabLearned?: number;
  }) {
    const { type, level, answers, durationMs, writingScore, vocabLearned } = body;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalItems = answers.length;
    const score = totalItems > 0 ? Math.round((correctCount / totalItems) * 100) : 0;

    // XP calculation
    let xpEarned = correctCount * (XP_TABLE[type] || 5);
    if (type === 'grammar' && score === 100) xpEarned += 20;
    if (type === 'reading' && score >= 80) xpEarned += 0; // already 15 per text
    if (type === 'writing' && writingScore && writingScore >= 80) xpEarned += 25;
    if (type === 'level_test') xpEarned = 500;

    const session = await this.sessionModel.create({
      userId, type, level,
      answers: answers.map(a => ({
        itemId: a.itemId, userAnswer: a.userAnswer,
        correctAnswer: a.correctAnswer, isCorrect: a.isCorrect, timeSpentMs: a.timeSpentMs,
      })),
      score, totalItems, correctCount, xpEarned, durationMs,
      startedAt: new Date(Date.now() - durationMs), completedAt: new Date(),
    });

    // Track mistakes
    for (const a of answers) {
      if (!a.isCorrect && a.itemId) {
        await this.mistakeModel.findOneAndUpdate(
          { userId, itemId: a.itemId },
          {
            $setOnInsert: { userId, itemId: a.itemId, itemType: type as any, topic: a.topic || 'Unknown', level, difficulty: a.difficulty || 'easy' },
            $push: { wrongAnswers: { userAnswer: a.userAnswer, correctAnswer: a.correctAnswer, occurredAt: new Date() } },
            $inc: { occurrenceCount: 1 },
            $set: { lastAttemptAt: new Date() },
          },
          { upsert: true },
        );
      }
    }

    // Update progress and XP
    const progressResult = await this.progressService.updateAfterSession(
      userId, type, score, correctCount, totalItems, xpEarned, durationMs, writingScore, vocabLearned,
    );

    return { session, xpEarned, score, correctCount, totalItems, progressResult };
  }

  async getHistory(userId: string) {
    return this.sessionModel.find({ userId }).sort({ startedAt: -1 }).limit(50).lean();
  }
}
