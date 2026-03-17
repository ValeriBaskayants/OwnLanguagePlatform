import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vocabulary, VocabularyDocument } from './schemas/vocabulary.schema';
import { UserVocabularyProgress, UserVocabularyProgressDocument } from './schemas/user-vocabulary-progress.schema';

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function updateSM2(card: any, quality: 0 | 1 | 2 | 3) {
  if (quality < 1) {
    card.repetitions = 0;
    card.interval = 1;
  } else {
    if (card.repetitions === 0) card.interval = 1;
    else if (card.repetitions === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.easinessFactor);
    card.repetitions++;
  }
  card.easinessFactor = Math.max(
    1.3,
    card.easinessFactor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02),
  );
  card.nextReviewDate = addDays(new Date(), card.interval);
  card.status = card.repetitions >= 3 ? 'mastered' : 'learning';
  card.lastReviewedAt = new Date();
  return card;
}

@Injectable()
export class VocabularyService {
  constructor(
    @InjectModel(Vocabulary.name) private vocabModel: Model<VocabularyDocument>,
    @InjectModel(UserVocabularyProgress.name) private progressModel: Model<UserVocabularyProgressDocument>,
  ) {}

  async findAll(query: { level?: string; type?: string; search?: string; limit?: number }) {
    const filter: any = {};
    if (query.level) filter.level = query.level;
    if (query.type) filter.type = query.type;
    if (query.search) filter.word = { $regex: query.search, $options: 'i' };
    return this.vocabModel.find(filter).limit(query.limit || 200).lean();
  }

  async getFlashcards(userId: string, level?: string, limit = 20) {
    const now = new Date();
    // Get due cards
    const dueProgress = await this.progressModel
      .find({ userId, nextReviewDate: { $lte: now } })
      .populate('wordId')
      .limit(limit)
      .lean();

    if (dueProgress.length >= limit) {
      return dueProgress.map((p: any) => ({ progress: p, word: p.wordId }));
    }

    // Fill with new words
    const learnedWordIds = await this.progressModel.distinct('wordId', { userId });
    const vocabFilter: any = { _id: { $nin: learnedWordIds } };
    if (level) vocabFilter.level = level;

    const newWords = await this.vocabModel
      .find(vocabFilter)
      .limit(limit - dueProgress.length)
      .lean();

    // Create progress entries for new words
    for (const word of newWords) {
      await this.progressModel.findOneAndUpdate(
        { userId, wordId: word._id },
        {
          userId, wordId: word._id,
          easinessFactor: 2.5, interval: 1, repetitions: 0,
          nextReviewDate: now, status: 'new', lastReviewedAt: null,
        },
        { upsert: true, new: true },
      );
    }

    return [
      ...dueProgress.map((p: any) => ({ progress: p, word: p.wordId })),
      ...newWords.map(w => ({ progress: null, word: w })),
    ];
  }

  async reviewWord(userId: string, wordId: string, quality: 0 | 1 | 2 | 3) {
    let progress = await this.progressModel.findOne({ userId, wordId });
    if (!progress) {
      progress = new this.progressModel({
        userId, wordId, easinessFactor: 2.5, interval: 1, repetitions: 0,
        nextReviewDate: new Date(), status: 'new',
      });
    }
    const updated = updateSM2(progress, quality);
    await this.progressModel.findOneAndUpdate({ userId, wordId }, updated, { upsert: true });
    return { status: updated.status, nextReviewDate: updated.nextReviewDate };
  }

  async getUserProgress(userId: string) {
    const total = await this.vocabModel.countDocuments();
    const learned = await this.progressModel.countDocuments({ userId, status: { $in: ['learning', 'review', 'mastered'] } });
    const mastered = await this.progressModel.countDocuments({ userId, status: 'mastered' });
    const dueToday = await this.progressModel.countDocuments({ userId, nextReviewDate: { $lte: new Date() } });
    return { total, learned, mastered, dueToday };
  }

  async bulkCreate(words: any[]) {
    let inserted = 0, skipped = 0, errors = 0;
    for (const word of words) {
      try {
        const exists = await this.vocabModel.findOne({ word: word.word });
        if (exists) { skipped++; continue; }
        await this.vocabModel.create(word);
        inserted++;
      } catch { errors++; }
    }
    return { inserted, skipped, errors };
  }
}
