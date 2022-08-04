import mongoose, { model } from "mongoose"
const { Schema } = mongoose

import { FriendRequest as FriendRequestEntity, FriendRequestCRUDDTO } from "../business/entities/friendRequest"
import BaseDatabase from "./BaseDatabase"
import FriendRequest from "./model/FriendRequest"

export class FriendRequestDatabase extends BaseDatabase {
    protected tableName: string = "friendrequest"

    protected friendRequestSchema = new Schema({
        id: String,
        from: String,
        to: String,
    },
        { timestamps: true }
    )

    private toModel(dbModel?: any): FriendRequest {
        return (
            dbModel &&
            new FriendRequest(
                dbModel.id,
                dbModel.from,
                dbModel.to,
            )
        )
    }

    public async createFriendRequest(input: FriendRequest): Promise<FriendRequest> {
        try {
            const friendRequestDocument = {
                id: input.getId(),
                from: input.getFrom(),
                to: input.getTo(),
            }

            await BaseDatabase.connect

            const FriendRequestModel = model<FriendRequestEntity>(this.tableName, this.friendRequestSchema)
            const NewFriendRequest = new FriendRequestModel(friendRequestDocument)

            NewFriendRequest.save()

            console.log('this.toModel(NewFriendRequest)', this.toModel(NewFriendRequest))
            return this.toModel(NewFriendRequest)
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }

    public async getFriendRequest(userId: string): Promise<any[]> {
        try {
            await BaseDatabase.connect

            const FriendRequestModel = model<FriendRequest>(this.tableName, this.friendRequestSchema)

            const friendRequests: any = await FriendRequestModel.find({ to: userId })

            return friendRequests
        } catch (error: any) {
            throw new Error(error.statusCode)
        }
    }
}

export default new FriendRequestDatabase()