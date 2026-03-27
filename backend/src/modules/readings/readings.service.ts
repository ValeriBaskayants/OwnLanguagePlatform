import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reading, ReadingDocument } from './schemas/reading.schema';

@Injectable()
export class ReadingsService {
  constructor(@InjectModel(Reading.name) private model: Model<ReadingDocument>) {}

  async findAll(level?: string, topic?: string) {
    const filter: any = {};
    if (level) filter.level = level;
    if (topic) filter.topic = { $regex: topic, $options: 'i' };
    return this.model.find(filter).select('-questions').lean();
  }

  async findById(id: string) {
    const r = await this.model.findById(id).lean();
    if (!r) throw new NotFoundException('Reading not found');
    return r;
  }

  async bulkCreate(readings: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    const errorMessages: string[] = [];

    for (const r of readings) {
      try {
        if (!r.title || !r.level || !r.topic || !r.content) {
          errors++;
          errorMessages.push(`Missing required fields: title="${r.title}", level="${r.level}", topic="${r.topic}", hasContent=${!!r.content}`);
          continue;
        }
        r.wordCount = r.content.trim().split(/\s+/).length || 0;
        r.estimatedMinutes = Math.max(1, Math.ceil(r.wordCount / 200));
        const exists = await this.model.findOne({ title: r.title });
        if (exists) { skipped++; continue; }
        await this.model.create(r);
        inserted++;
      } catch (err: any) {
        errors++;
        errorMessages.push(`"${r.title || 'unknown'}": ${err?.message || 'Unknown error'}`);
        console.error('Reading import error:', err?.message, r.title);
      }
    }
    return { inserted, skipped, errors, errorMessages };
  }
}