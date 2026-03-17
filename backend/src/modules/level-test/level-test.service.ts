import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LevelProgress, LevelProgressDocument } from '../progress/schemas/level-progress.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Exercise, ExerciseDocument } from '../exercises/schemas/exercise.schema';
import { MultipleChoice, MultipleChoiceDocument } from '../multiple-choice/schemas/multiple-choice.schema';
import { Reading, ReadingDocument } from '../readings/schemas/reading.schema';
import { Listening, ListeningDocument } from '../listening/schemas/listening.schema';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class LevelTestService {
  constructor(
    @InjectModel(LevelProgress.name) private progressModel: Model<LevelProgressDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
    @InjectModel(MultipleChoice.name) private mcModel: Model<MultipleChoiceDocument>,
    @InjectModel(Reading.name) private readingModel: Model<ReadingDocument>,
    @InjectModel(Listening.name) private listeningModel: Model<ListeningDocument>,
    private progressService: ProgressService,
  ) {}

  async getQuestions(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new ForbiddenException('User not found');

    const progress = await this.progressModel.findOne({ userId, level: user.currentLevel }).lean();
    if (!progress?.isReadyForTest) {
      throw new ForbiddenException('Complete all requirements first');
    }

    // Check 24h cooldown after failed attempt
    const lastAttempt = user.levelTests?.filter(t => t.level === user.currentLevel && !t.passed).slice(-1)[0];
    if (lastAttempt) {
      const hoursSince = (Date.now() - new Date(lastAttempt.takenAt).getTime()) / 3600000;
      if (hoursSince < 24) {
        const hoursLeft = Math.ceil(24 - hoursSince);
        throw new ForbiddenException(`Wait ${hoursLeft} more hour(s) before retrying`);
      }
    }

    const level = user.currentLevel;
    const [exercises, mcQuestions, readings, listeningItems] = await Promise.all([
      this.exerciseModel.aggregate([{ $match: { level } }, { $sample: { size: 20 } }]),
      this.mcModel.aggregate([{ $match: { level } }, { $sample: { size: 15 } }]),
      this.readingModel.aggregate([{ $match: { level } }, { $sample: { size: 2 } }]),
      this.listeningModel.aggregate([{ $match: { level } }, { $sample: { size: 5 } }]),
    ]);

    // Build reading questions (pick 10 total from 2 readings)
    const readingQs: any[] = [];
    for (const r of readings) {
      if (readingQs.length >= 10) break;
      for (const q of (r.questions || []).slice(0, 5)) {
        readingQs.push({ ...q, readingId: r._id, readingTitle: r.title, readingContent: r.content, type: 'reading' });
      }
    }

    return {
      questions: {
        grammar: exercises.map(e => ({ ...e, questionType: 'grammar' })),
        vocabulary: mcQuestions.map(q => ({ ...q, questionType: 'vocabulary' })),
        reading: readingQs.slice(0, 10),
        listening: listeningItems.map(l => ({ ...l, questionType: 'listening' })),
      },
      timeLimit: 45 * 60, // seconds
      startedAt: new Date().toISOString(),
    };
  }

  async submitTest(userId: string, body: {
    answers: Array<{ sectionType: string; itemId: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }>;
    startedAt: string;
  }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new ForbiddenException('User not found');

    // Check time limit
    const elapsed = (Date.now() - new Date(body.startedAt).getTime()) / 1000;
    if (elapsed > 45 * 60 + 30) throw new BadRequestException('Time limit exceeded');

    const bySection = { grammar: [] as any[], vocabulary: [] as any[], reading: [] as any[], listening: [] as any[] };
    for (const a of body.answers) {
      const sec = a.sectionType as keyof typeof bySection;
      if (bySection[sec]) bySection[sec].push(a);
    }

    const calcScore = (arr: any[]) => arr.length ? Math.round(arr.filter(a => a.isCorrect).length / arr.length * 100) : 0;

    const breakdown = {
      grammar: calcScore(bySection.grammar),
      vocabulary: calcScore(bySection.vocabulary),
      reading: calcScore(bySection.reading),
      listening: calcScore(bySection.listening),
    };

    const totalCorrect = body.answers.filter(a => a.isCorrect).length;
    const score = Math.round(totalCorrect / Math.max(body.answers.length, 1) * 100);
    const passed = score >= 85;

    const attemptNumber = (user.levelTests?.filter(t => t.level === user.currentLevel).length || 0) + 1;
    user.levelTests = user.levelTests || [];
    user.levelTests.push({ level: user.currentLevel, attemptNumber, score, passed, takenAt: new Date(), breakdown });

    if (passed) {
      const newLevel = { A1: 'A1+', 'A1+': 'A2', A2: 'A2+', 'A2+': 'B1', B1: 'B1+', 'B1+': 'B2', B2: 'B2+', 'B2+': 'C1', C1: 'C2' }[user.currentLevel];
      if (newLevel) {
        const oldLevel = user.currentLevel;
        user.currentLevel = newLevel;
        await user.save();
        await this.progressService.promoteUser(userId, newLevel);
        user.xp += 500;
        await user.save();
        return { score, passed, breakdown, newLevel, oldLevel, xpEarned: 500 };
      }
    } else {
      // Check 3 failures → reset progress hints
      const failCount = user.levelTests.filter(t => t.level === user.currentLevel && !t.passed).length;
      await user.save();
      return { score, passed, breakdown, failCount, cooldownHours: 24, xpEarned: 0 };
    }

    await user.save();
    return { score, passed, breakdown, xpEarned: 0 };
  }
}
