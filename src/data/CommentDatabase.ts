import mongoose, { model } from "mongoose"
const { Schema } = mongoose

import { Comment as CommentEntity, GetCommentDTO } from "../business/entities/comment"
import BaseDatabase from "./BaseDatabase"
import Comment from "./model/Comment"

export class CommentDatabase extends BaseDatabase {
    protected tableName: string = "comment"

    protected commentSchema = new Schema({
        id: String,
        postId: String,
        userId: String,
        content: String,
    },
        { timestamps: true }
    )

    private toModel(dbModel?: any): Comment {
        return (
            dbModel &&
            new Comment(
                dbModel.id,
                dbModel.postId,
                dbModel.userId,
                dbModel.content,
            )
        )
    }

    public async createComment(input: Comment): Promise<void> {
        try {
            const commentDocument = {
                id: input.getId(),
                postId: input.getPostId(),
                userId: input.getUserId(),
                content: input.getContent(),
            }

            await BaseDatabase.connect

            const CommentModel = model<CommentEntity>(this.tableName, this.commentSchema)
            const NewComment = new CommentModel(commentDocument)

            NewComment.save()
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }

    public async getCommentsByPostId(input: GetCommentDTO, token: string): Promise<any> {
        try {
            await BaseDatabase.connect

            const CommentsModel = model<Comment>(this.tableName, this.commentSchema)

            const comments = await CommentsModel.find({ postId: input.postId })

            console.log('comments', comments)
            return comments.map(comments => this.toModel(comments))
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }
}

export default new CommentDatabase()