import dotenv from "dotenv"
import mongoose, { connect } from "mongoose"

dotenv.config()

export default class BaseDatabase {
  protected static uri: string =
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/${process.env.DB_NAME}`

  protected static connect: Promise<typeof mongoose> =
    connect(BaseDatabase.uri)
}