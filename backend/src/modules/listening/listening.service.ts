import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Listening, ListeningDocument } from './schemas/listening.schema';

@Injectable()
export class ListeningService {
  constructor(@InjectModel(Listening.name) private model: Model<ListeningDocument>) {}

  async findAll(query: { level?: string; type?: string; limit?: number }) {
    const filter: any = {};
    if (query.level) filter.level = query.level;
    if (query.type) filter.type = query.type;
    return this.model.find(filter).limit(query.limit || 100).lean();
  }

  async findRandom(level: string, count: number) {
    return this.model.aggregate([{ $match: { level } }, { $sample: { size: count } }]);
  }

  async bulkCreate(items: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const item of items) {
      try {
        await this.model.create(item);
        inserted++;
      } catch { errors++; }
    }
    return { inserted, skipped, errors };
  }
}
