import { Request, Response } from "express"

import { IdGenerator } from "../business/services/idGenerator"
import { HashGenerator } from "../business/services/hashGenerator"
import { TokenGenerator } from "../business/services/tokenGenerator"

import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../data/UserDatabase"

import { FollowUserDTO, GetUserDataDTO, GetUserDataByUsernameDTO, LoginInputDTO, SignupInputDTO, UpdateUserDTO } from "../business/entities/user"
import { User } from "../data/model/User"

const userBusiness: UserBusiness =
   new UserBusiness(new IdGenerator(),
      new HashGenerator(),
      new UserDatabase(),
      new TokenGenerator()
   )

export class UserController {
   public async createUser(req: Request, res: Response): Promise<void> {
      try {
         const { username, email, password, isAdmin } = req.body

         const input: SignupInputDTO = {
            username,
            email,
            password,
            isAdmin
         }

         const token: string = await userBusiness.createUser(
            input
         )

         res.status(201).send({ token })
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async getUserByEmail(req: Request, res: Response): Promise<void> {
      try {
         const { email, password } = req.body

         const input: LoginInputDTO = {
            email,
            password
         }

         const token: string = await userBusiness.getUserByEmail(input)

         res.status(200).send({ token })
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async updateUser(req: Request, res: Response): Promise<void> {
      try {
         const token = req.headers.authorization

         const { password } = req.body

         const input: UpdateUserDTO = {
            password
         }

         await userBusiness.updateUser(
            input,
            token
         )

         res.status(201).send("Your account has been updated successfully")
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async deleteUser(req: Request, res: Response): Promise<void> {
      try {
         const token = req.headers.authorization as string

         await userBusiness.deleteUser(
            token
         )

         res.status(201).send("Your account has been updated successfully")
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async getUserById(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.query
         const token = req.headers.authorization as string

         const input: GetUserDataDTO = {
            id: id as string
         }

         const result: User = await userBusiness.getUserById(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async getUserByUsername(req: Request, res: Response): Promise<void> {
      try {
         const { username } = req.query
         const token = req.headers.authorization as string

         const input: GetUserDataByUsernameDTO = {
            username: username as string
         }

         const result: User = await userBusiness.getUserByUsername(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error) {
         const { statusCode, message } = error

         res.status(statusCode || 400).send({ message })
      }
   }

   public async getFriends(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.query
         const token = req.headers.authorization as string

         const input: GetUserDataDTO = {
            id: id as string
         }

         const result = await userBusiness.getFriends(
            input,
            token
         )

         res.status(200).send(result)
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async followUser(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string

         const input: FollowUserDTO = {
            id
         }

         await userBusiness.followUser(
            input,
            token
         )

         res.status(200).send("You have been followed this user")
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }

   public async unfollowUser(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params
         const token = req.headers.authorization as string

         const input: FollowUserDTO = {
            id
         }

         await userBusiness.unfollowUser(
            input,
            token
         )

         res.status(200).send("You have been followed this user")
      } catch (error) {
         const { statusCode, message } = error
         res.status(statusCode || 400).send({ message })
      }
   }
}

export default new UserController()