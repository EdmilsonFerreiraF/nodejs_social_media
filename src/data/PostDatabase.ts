import mongoose, { model } from "mongoose"
import { GetPostsByUserIDDTO, PostCRUDDTO, UpdatePostDDTO } from "../business/entities/post"
const { Schema } = mongoose

import { Post as PostEntity } from "../business/entities/post"
import BaseDatabase from "./BaseDatabase"
import UserModel from "./config"
import Post from "./model/Post"
import UserDatabase from "./UserDatabase"

export class PostDatabase extends BaseDatabase {
   protected tableName: string = "post"

   protected postSchema = new Schema({
      id: String,
      userId: String,
      description: String,
      audience: String,
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
            dbModel.userId,
            dbModel.description,
            dbModel.audience,
            dbModel.image,
            dbModel.likes,
            dbModel.createdAt,
            dbModel.updatedAt
         )
      )
   }

   public async createPost(input: Post): Promise<void> {
      try {
         const postDocument = {
            id: input.getId(),
            userId: input.getUserId(),
            description: input.getDescription(),
            audience: input.getAudience(),
            image: input.getImage(),
            likes: input.getLikes()
         }

         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)
         const NewPost = new PostModel(postDocument)

         NewPost.save()
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getPostById(input: PostCRUDDTO): Promise<Post> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const post = await PostModel.findOne({ id: input.id })

         return this.toModel(post)
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async updatePost(input: UpdatePostDDTO, id: string): Promise<void> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const post = await PostModel.findOne({ id: input.id })

         if (post?.userId !== id) {
            throw new Error("You can only update your own posts")
         }

         await post?.updateOne({ $set: input })
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async deletePost(input: PostCRUDDTO): Promise<void> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         await PostModel.deleteOne({ id: input.id })
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async likePost(input: PostCRUDDTO, userId: string): Promise<Post> {
      try {
         await BaseDatabase.connect

         const postModel = model<PostEntity>(this.tableName, this.postSchema)

         const post: any = await postModel.findOne({ id: input.id })

         if (post.likes.includes(userId)) {
            await post?.updateOne({ $pull: { likes: userId } })
         } else {
            await post?.updateOne({ $push: { likes: userId } })
         }

         return this.toModel(post)
      } catch (error: any) {
         throw new Error(error.statusCode)
      }
   }

   public async getTimelinePosts(input: PostCRUDDTO): Promise<any> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         const currentUser: any = await UserModel.findOne({ id: input?.id })

         const userPosts = await PostModel.find({ userId: currentUser?.id })

         const followingPosts = await Promise.all(
            currentUser?.following.map((followingId: any) => {
               return PostModel.find({ userId: followingId })
            })
         )

         return userPosts.concat(...followingPosts).map(post => this.toModel(post))
      } catch (error: any) {
         console.log('error - database', error)
         throw new Error(error.statusCode)
      }
   }

   public async getPostsByUserId(input: GetPostsByUserIDDTO, userId: string): Promise<any> {
      try {
         await BaseDatabase.connect

         const PostModel = model<PostEntity>(this.tableName, this.postSchema)

         let isFriendOfFriends: any = []

         const publicPosts = await PostModel.find({ userId: input.userId, audience: "PUBLIC" })
         const friendPosts = await PostModel.find({ userId: input.userId, audience: "FRIENDS" })
         const friendOfFriendsPosts = await PostModel.find({ userId: input.userId, audience: "FRIEND_OF_FRIENDS" })

         if (isFriendOfFriends)
            isFriendOfFriends = await UserModel.findOne({ followers: { $all: [input.userId, userId] } })

         return publicPosts.concat(...friendPosts, ...friendOfFriendsPosts)
      } catch (error: any) {
         throw new Error(error.posts)
      }
   }
}

export default new PostDatabase()