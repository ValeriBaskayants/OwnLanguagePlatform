import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { LevelProgress, LevelProgressDocument } from '../progress/schemas/level-progress.schema';

// Must match LEVEL_THRESHOLDS in progress.service.ts
const LEVEL_REQUIREMENTS: Record<string, any> = {
  A1:   { grammar: 60,  vocabulary: 200,  reading: 6,   writing: 0,  listening: 4,   quiz: 20,  grammarAcc: 65, readingAcc: 65, quizAcc: 68, writingAvg: 0,  listeningAcc: 60 },
  'A1+':{ grammar: 100, vocabulary: 350,  reading: 10,  writing: 3,  listening: 8,   quiz: 35,  grammarAcc: 68, readingAcc: 68, quizAcc: 70, writingAvg: 60, listeningAcc: 63 },
  A2:   { grammar: 160, vocabulary: 550,  reading: 15,  writing: 5,  listening: 14,  quiz: 55,  grammarAcc: 70, readingAcc: 70, quizAcc: 73, writingAvg: 63, listeningAcc: 66 },
  'A2+':{ grammar: 240, vocabulary: 800,  reading: 22,  writing: 8,  listening: 22,  quiz: 80,  grammarAcc: 72, readingAcc: 72, quizAcc: 75, writingAvg: 65, listeningAcc: 68 },
  B1:   { grammar: 340, vocabulary: 1100, reading: 30,  writing: 12, listening: 35,  quiz: 115, grammarAcc: 75, readingAcc: 75, quizAcc: 78, writingAvg: 68, listeningAcc: 70 },
  'B1+':{ grammar: 460, vocabulary: 1500, reading: 42,  writing: 18, listening: 55,  quiz: 155, grammarAcc: 78, readingAcc: 78, quizAcc: 81, writingAvg: 72, listeningAcc: 74 },
  B2:   { grammar: 600, vocabulary: 2000, reading: 56,  writing: 26, listening: 80,  quiz: 205, grammarAcc: 80, readingAcc: 80, quizAcc: 83, writingAvg: 75, listeningAcc: 77 },
  'B2+':{ grammar: 760, vocabulary: 2700, reading: 74,  writing: 36, listening: 110, quiz: 265, grammarAcc: 82, readingAcc: 82, quizAcc: 85, writingAvg: 78, listeningAcc: 80 },
  C1:   { grammar: 950, vocabulary: 3600, reading: 100, writing: 50, listening: 150, quiz: 340, grammarAcc: 85, readingAcc: 85, quizAcc: 87, writingAvg: 82, listeningAcc: 83 },
};

const NEXT_LEVELS: Record<string, string> = {
  A1: 'A1+', 'A1+': 'A2', A2: 'A2+', 'A2+': 'B1',
  B1: 'B1+', 'B1+': 'B2', B2: 'B2+', 'B2+': 'C1', C1: 'C2',
};

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(LevelProgress.name) private progressModel: Model<LevelProgressDocument>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userModel.findOne({ email: email.toLowerCase() });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({
      email: email.toLowerCase(),
      password: hashed,
      stats: {
        grammarCompleted: 0, grammarAccuracy: 0, vocabularyLearned: 0,
        readingCompleted: 0, writingSubmitted: 0, listeningCompleted: 0,
        quizCompleted: 0, totalSessionTime: 0,
      },
    });

    await this.createInitialProgress(user._id.toString(), 'A1');

    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role });
    return { token, user: this.sanitizeUser(user) };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user._id, email: user.email, role: user.role });
    return { token, user: this.sanitizeUser(user) };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserDocument) {
    const obj = user.toObject();
    delete obj.password;
    return obj;
  }

  private async createInitialProgress(userId: string, level: string) {
    const req = LEVEL_REQUIREMENTS[level];
    const nextLevel = NEXT_LEVELS[level];
    if (!req || !nextLevel) return;

    await this.progressModel.findOneAndUpdate(
      { userId, level },
      {
        userId, level, targetLevel: nextLevel,
        requirements: {
          grammar: { required: req.grammar, completed: 0, accuracy: 0 },
          vocabulary: { required: req.vocabulary, learned: 0 },
          reading: { required: req.reading, completed: 0, accuracy: 0 },
          writing: { required: req.writing, completed: 0, avgScore: 0 },
          listening: { required: req.listening, completed: 0, accuracy: 0 },
          quiz: { required: req.quiz, completed: 0, accuracy: 0 },
        },
        isReadyForTest: false,
        testUnlockedAt: null,
      },
      { upsert: true, new: true },
    );
  }
}

export { LEVEL_REQUIREMENTS, NEXT_LEVELS };