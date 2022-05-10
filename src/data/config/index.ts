import { User as UserEntity } from "../../business/entities/user"
import mongoose, { model } from "mongoose"

const { Schema } = mongoose

 const userSchema = new Schema<UserEntity>({
    id: {
       type: String,
       required: true,
    },
    username: {
       type: String,
       required: true,
       min: 3,
       max: 20,
       unique: true
    },
    email: {
       type: String,
       required: true,
       max: 50,
       unique: true
    },
    password: {
       type: String,
       required: true,
       min: 6
    },
    profilePicture: {
       type: String,
       default: ""
    },
    coverPicture: {
       type: String,
       default: ""
    },
    followers: {
       type: [String],
       default: []
    },
    following: {
       type: [String],
       default: []
    },
    isAdmin: {
       type: Boolean,
       default: false
    },
    description: {
       type: String,
       max: 50
    },
    from: {
       type: String,
       max: 50
    },
    relationship: {
       type: Number
    }
 },
    { timestamps: true }
 )

 const tableName: string = "user"

 const UserModel = model<UserEntity>(tableName, userSchema)

 export default UserModel