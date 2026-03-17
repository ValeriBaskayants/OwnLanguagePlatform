import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise, ExerciseDocument } from './schemas/exercise.schema';

@Injectable()
export class ExercisesService {
  constructor(@InjectModel(Exercise.name) private model: Model<ExerciseDocument>) {}

  async findAll(query: { level?: string; difficulty?: string; topic?: string; limit?: number }) {
    const filter: any = {};
    if (query.level) filter.level = query.level;
    if (query.difficulty) filter.difficulty = query.difficulty;
    if (query.topic) filter.topic = { $regex: query.topic, $options: 'i' };
    return this.model.find(filter).limit(query.limit || 100).lean();
  }

  async getTopics(level?: string) {
    const filter: any = {};
    if (level) filter.level = level;
    const topics = await this.model.distinct('topic', filter);
    return topics.sort();
  }

  async bulkCreate(exercises: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const ex of exercises) {
      try {
        const exists = await this.model.findOne({ sentence: ex.sentence });
        if (exists) { skipped++; continue; }
        await this.model.create(ex);
        inserted++;
      } catch { errors++; }
    }
    return { inserted, skipped, errors };
  }
}
