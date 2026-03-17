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

const LEVEL_REQUIREMENTS = {
  A1:  { grammar: 40, vocabulary: 50, reading: 5,  writing: 0, listening: 0,  quiz: 20, grammarAcc: 70, readingAcc: 70, quizAcc: 70, writingAvg: 0,  listeningAcc: 0  },
  'A1+': { grammar: 50, vocabulary: 60, reading: 6,  writing: 3, listening: 5,  quiz: 25, grammarAcc: 72, readingAcc: 72, quizAcc: 72, writingAvg: 65, listeningAcc: 65 },
  A2:  { grammar: 60, vocabulary: 80, reading: 8,  writing: 5, listening: 8,  quiz: 30, grammarAcc: 75, readingAcc: 75, quizAcc: 75, writingAvg: 70, listeningAcc: 70 },
  'A2+': { grammar: 70, vocabulary: 100, reading: 10, writing: 5, listening: 10, quiz: 40, grammarAcc: 78, readingAcc: 78, quizAcc: 78, writingAvg: 75, listeningAcc: 75 },
  B1:  { grammar: 80, vocabulary: 120, reading: 12, writing: 6, listening: 12, quiz: 50, grammarAcc: 80, readingAcc: 80, quizAcc: 80, writingAvg: 78, listeningAcc: 78 },
  'B1+': { grammar: 90, vocabulary: 140, reading: 14, writing: 7, listening: 14, quiz: 60, grammarAcc: 82, readingAcc: 82, quizAcc: 82, writingAvg: 80, listeningAcc: 80 },
  B2:  { grammar: 100, vocabulary: 160, reading: 16, writing: 8, listening: 16, quiz: 70, grammarAcc: 84, readingAcc: 84, quizAcc: 84, writingAvg: 82, listeningAcc: 82 },
  'B2+': { grammar: 110, vocabulary: 180, reading: 18, writing: 9, listening: 18, quiz: 80, grammarAcc: 86, readingAcc: 86, quizAcc: 86, writingAvg: 84, listeningAcc: 84 },
  C1:  { grammar: 120, vocabulary: 200, reading: 20, writing: 10, listening: 20, quiz: 90, grammarAcc: 88, readingAcc: 88, quizAcc: 88, writingAvg: 86, listeningAcc: 86 },
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

    // Create initial level progress
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
