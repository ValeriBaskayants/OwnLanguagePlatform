import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { ExercisesService } from '../exercises/exercises.service';
import { GrammarRulesService } from '../grammar-rules/grammar-rules.service';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { ReadingsService } from '../readings/readings.service';
import { MultipleChoiceService } from '../multiple-choice/multiple-choice.service';
import { WritingService } from '../writing/writing.service';
import { ListeningService } from '../listening/listening.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private exercisesService: ExercisesService,
    private grammarRulesService: GrammarRulesService,
    private vocabularyService: VocabularyService,
    private readingsService: ReadingsService,
    private mcService: MultipleChoiceService,
    private writingService: WritingService,
    private listeningService: ListeningService,
  ) {}

  async importExercises(data: any) {
    return this.exercisesService.bulkCreate(data.exercises || []);
  }

  async importGrammarRules(data: any) {
    return this.grammarRulesService.bulkCreate(data.grammarRules || []);
  }

  async importVocabulary(data: any) {
    return this.vocabularyService.bulkCreate(data.vocabulary || []);
  }

  async importReadings(data: any) {
    return this.readingsService.bulkCreate(data.readings || []);
  }

  async importMultipleChoice(data: any) {
    return this.mcService.bulkCreate(data.multipleChoice || []);
  }

  async importWritingPrompts(data: any) {
    return this.writingService.bulkCreatePrompts(data.writingPrompts || []);
  }

  async importListening(data: any) {
    return this.listeningService.bulkCreate(data.listening || []);
  }

  async getStats() {
    const users = await this.userModel.find().select('-password').lean();
    return {
      totalUsers: users.length,
      users: users.map(u => ({
        email: u.email,
        role: u.role,
        currentLevel: u.currentLevel,
        xp: u.xp,
        streak: u.streak,
        stats: u.stats,
      })),
    };
  }
}
