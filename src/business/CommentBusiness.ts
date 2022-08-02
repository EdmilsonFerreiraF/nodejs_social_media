import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { CommentDatabase } from "../data/CommentDatabase"

import { Comment } from "../data/model/Comment"
import { CreateCommentDTO, GetCommentDTO } from "./entities/comment"

import { CustomError } from "../errors/CustomError"

export class CommentBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private commentDatabase: CommentDatabase,
        private tokenGenerator: TokenGenerator
    ) { }

    public async createComment(
        input: CreateCommentDTO,
        token: string
    ): Promise<Comment> {
        try {
            if (
                !input.postId ||
                !input.content
            ) {
                throw new CustomError(422, "Missing input")
            }

            const id: string = this.idGenerator.generate()

            if (!token) {
                throw new CustomError(422, "Missing token")
            }

            const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

            if (!isTokenValid) {
                throw new CustomError(409, "Invalid token")
            }

            if (isTokenValid.isAdmin !== true) {
                throw new CustomError(422, "Only admins can access this feature")
            }

            const result = await this.commentDatabase.createComment(
                new Comment(
                    id,
                    input.postId,
                    isTokenValid.username,
                    input.content
                )
            )

            return result
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    public async getCommentsByPostId(input: GetCommentDTO, token: string): Promise<Comment> {
        try {
            if (!input.postId) {
                throw new CustomError(422, "Missing input")
            }

            if (!token) {
                throw new CustomError(422, "Missing input")
            }

            const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

            if (!isTokenValid) {
                throw new CustomError(422, "Invalid token")
            }

            const result: Comment = await this.commentDatabase.getCommentsByPostId(input, token)

            return result
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new CommentBusiness(new IdGenerator(), new CommentDatabase(), new TokenGenerator())