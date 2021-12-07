import mongoose, { model } from "mongoose"
import { GetPostsByUserDTO, PostCRUDDTO, UpdatePostDDTO } from "../business/entities/post"
const { Schema } = mongoose

import BaseDatabase from "./BaseDatabase"
import Post from "./model/Post"
import { Post as PostEntity } from "../business/entities/post"
import UserDatabase from "./UserDatabase"
import { User } from "../business/entities/user"
import { AuthenticationData } from "../business/services/tokenGenerator"

export class PostDatabase extends BaseDatabase {
   protected tableName: string = "post"

   protected postSchema = new Schema({
      id: String,
      postId: String,
      description: String,
      image: String,
      likes: [String],
   },
      { timestamps: true }
   )

   protected userDatabase = UserDatabase

   private toModel(dbModel?: any): Post {
      return (
         dbModel &&
         new Post(
            dbModel.id,
            dbModel.postId,
            dbModel.description,
            dbModel.image,
            dbModel.likes
         )
      )
   }

   public async createPost(input: Post): Promise<void> {
      try {
         const postDocument = {
            id: input.getId(),
            userId: input.getPostId(),
            description: input.getDescription(),
            image: input.getImage()
         }

         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)
         const NewPost = new PostModel(postDocument)

         NewPost.save()
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getPostById(input: PostCRUDDTO): Promise<Post> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const post = await PostModel.findOne({ id: input.id })

         return this.toModel(post)
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async updatePost(input: UpdatePostDDTO, id: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const post = await PostModel.findOne({ id: input.id })

         if (post.userId !== id) {
            throw new Error("You can only update your own posts")
         }

         await post.updateOne({ $set: input })
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async deletePost(input: PostCRUDDTO): Promise<void> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         await PostModel.deleteOne({ id: input.id })
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async likePost(input: PostCRUDDTO, userId: string): Promise<Post> {
      try {
         await BaseDatabase.connect

         const postModel = model<PostEntity>(this.tableName, this.postSchema)

         const post = await postModel.findOne({ id: input.id })

         const likes: string[] = post.likes = []

         if (!likes.includes(userId)) {
            await post.updateOne({ $push: { likes: userId } })
         } else {
            await post.updateOne({ $pull: { likes: userId } })
         }

         return this.toModel(post)
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getTimelinePosts(input: PostCRUDDTO): Promise<Post> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)
         const UserModel = model<User>(UserDatabase.getTableName(), UserDatabase.getUserSchema())

         const currentUser = await UserModel.findOne({ id: input.id })

         const userPosts = await PostModel.find({ userId: currentUser.id })

         const followingPosts = await Promise.all(
            currentUser.following.map(followingId => {
               return PostModel.find({ userId: followingId })
            })
         )

         return this.toModel(userPosts.concat(...followingPosts))
      } catch (error) {
         throw new Error(error.statusCode)
      }
   }

   public async getPostsByUsername(input: GetPostsByUserDTO): Promise<Post> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const posts = await PostModel.find({ postId: input.username })

         return this.toModel(posts)
      } catch (error) {
         throw new Error(error.posts)
      }
   }
}

export default new PostDatabase()