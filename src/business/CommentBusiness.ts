import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { CommentDatabase } from "../data/CommentDatabase"

import { Comment } from "../data/model/Comment"
import { CreateCommentDTO } from "./entities/comment"

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
    ): Promise<void> {
        try {
            if (
                !input.postId ||
                !input.content
            ) {
                console.log('CommentBusiness - 422')
                throw new CustomError(422, "Missing input")
            }

            const id: string = this.idGenerator.generate()

            if (!token) {
                console.log('CommentBusiness - 422')
                throw new CustomError(422, "Missing token")
            }

            const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

            if (!isTokenValid) {
                console.log('CommentBusiness - 409')
                throw new CustomError(409, "Invalid token")
            }

            if (isTokenValid.isAdmin !== true) {
                console.log('CommentBusiness - 422')
                throw new CustomError(422, "Only admins can access this feature")
            }

            await this.commentDatabase.createComment(
                new Comment(
                    id,
                    isTokenValid.id,
                    input.postId,
                    input.content
                )
            )
        } catch (error: any) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}

export default new CommentBusiness(new IdGenerator(), new CommentDatabase(), new TokenGenerator())