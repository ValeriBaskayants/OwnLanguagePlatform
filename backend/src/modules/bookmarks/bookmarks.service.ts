import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './schemas/bookmark.schema';

@Injectable()
export class BookmarksService {
  constructor(@InjectModel(Bookmark.name) private model: Model<BookmarkDocument>) {}

  async findAll(userId: string) {
    return this.model.find({ userId }).lean();
  }

  async toggle(userId: string, itemId: string, itemType: string) {
    const existing = await this.model.findOne({ userId, itemId, itemType });
    if (existing) {
      await this.model.deleteOne({ _id: existing._id });
      return { bookmarked: false };
    }
    await this.model.create({ userId, itemId, itemType });
    return { bookmarked: true };
  }

  async remove(userId: string, id: string) {
    await this.model.deleteOne({ _id: id, userId });
    return { deleted: true };
  }
}
