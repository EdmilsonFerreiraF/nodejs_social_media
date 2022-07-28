import mongoose, { model } from "mongoose"
const { Schema } = mongoose

import { Bookmark as BookmarkEntity, BookmarkCRUDDTO } from "../business/entities/bookmark"
import BaseDatabase from "./BaseDatabase"
import Bookmark from "./model/Bookmark"

export class BookmarkDatabase extends BaseDatabase {
    protected tableName: string = "bookmark"

    protected bookmarkSchema = new Schema({
        id: String,
        postId: String,
        userId: String,
    },
        { timestamps: true }
    )

    private toModel(dbModel?: any): Bookmark {
        return (
            dbModel &&
            new Bookmark(
                dbModel.id,
                dbModel.postId,
                dbModel.userId,
            )
        )
    }

    public async createBookmark(input: Bookmark): Promise<void> {
        try {
            const bookmarkDocument = {
                id: input.getId(),
                postId: input.getPostId(),
                userId: input.getUserId(),
            }

            await BaseDatabase.connect

            const BookmarkModel = model<BookmarkEntity>(this.tableName, this.bookmarkSchema)
            const NewBookmark = new BookmarkModel(bookmarkDocument)

            NewBookmark.save()
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }

    public async getBookmarksByUserId(userId: string): Promise<any> {
        try {
            await BaseDatabase.connect

            const BookmarksModel = model<BookmarkEntity>(this.tableName, this.bookmarkSchema)

            const userBookmarks = await BookmarksModel.find()
            console.log('userBookmarks', userBookmarks)

            return userBookmarks.map(bookmarks => this.toModel(bookmarks))
        } catch (error: any) {
            console.log('error - database', error)
            throw new Error(error.statusCode)
        }
    }

    public async deleteBookmarkByPostId(input: BookmarkCRUDDTO, userId: string): Promise<void> {
        try {
            await BaseDatabase.connect

            const BookmarkModel = model<BookmarkEntity>(this.tableName, this.bookmarkSchema)

            await BookmarkModel.deleteOne({ postId: input.postId, userId })
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }
}

export default new BookmarkDatabase()