import mongoose, { model } from "mongoose"
const { Schema } = mongoose

import { Bookmark as BookmarkEntity, CreateBookmarkDTO } from "../business/entities/bookmark"
import BaseDatabase from "./BaseDatabase"
import UserModel from "./config"
import Bookmark from "./model/Bookmark"
import UserDatabase from "./UserDatabase"

export class BookmarkDatabase extends BaseDatabase {
    protected tableName: string = "bookmark"

    protected bookmarkSchema = new Schema({
        id: String,
        userId: String,
        postId: String,
    },
        { timestamps: true }
    )

    private toModel(dbModel?: any): Bookmark {
        return (
            dbModel &&
            new Bookmark(
                dbModel.id,
                dbModel.userId,
                dbModel.postId,
            )
        )
    }

    public async createBookmark(input: Bookmark, userId: string): Promise<void> {
        try {
            const bookmarkDocument = {
                id: input.getId(),
                postId: input.getPostId(),
                userId,
            }

            await BaseDatabase.connect

            const BookmarkModel = model<BookmarkEntity>(this.tableName, this.bookmarkSchema)
            const NewBookmark = new BookmarkModel(bookmarkDocument)

            NewBookmark.save()
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }
}

export default new BookmarkDatabase()