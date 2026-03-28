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
    const errorMessages: string[] = [];

    if (!exercises || exercises.length === 0) {
      return { inserted: 0, skipped: 0, errors: 0, message: 'Array "exercises" is empty or missing in JSON' };
    }

    for (const ex of exercises) {
      try {
        if (!ex.sentence || !ex.level || !ex.blanks) {
          errors++;
          errorMessages.push(`Missing fields: sentence="${ex.sentence?.slice(0,30)}", level="${ex.level}", hasBlanks=${!!ex.blanks}`);
          continue;
        }
        const exists = await this.model.findOne({ sentence: ex.sentence });
        if (exists) { skipped++; continue; }
        await this.model.create(ex);
        inserted++;
      } catch (err: any) {
        errors++;
        const msg = err?.message?.slice(0, 120) || 'Unknown error';
        errorMessages.push(`"${ex?.sentence?.slice(0, 40) || '?'}": ${msg}`);
        console.error('[ExerciseImport]', msg);
      }
    }
    return { inserted, skipped, errors, errorMessages };
  }
}