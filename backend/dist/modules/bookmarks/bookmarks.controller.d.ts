import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private service;
    constructor(service: BookmarksService);
    findAll(req: any): unknown;
    toggle(req: any, body: {
        itemId: string;
        itemType: string;
    }): unknown;
    remove(req: any, id: string): unknown;
}
