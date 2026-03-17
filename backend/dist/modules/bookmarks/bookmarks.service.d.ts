import { Model } from 'mongoose';
import { BookmarkDocument } from './schemas/bookmark.schema';
export declare class BookmarksService {
    private model;
    constructor(model: Model<BookmarkDocument>);
    findAll(userId: string): unknown;
    toggle(userId: string, itemId: string, itemType: string): unknown;
    remove(userId: string, id: string): unknown;
}
