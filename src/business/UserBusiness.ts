import { HashGenerator } from "./services/hashGenerator"
import { IdGenerator } from "./services/idGenerator"
import { AuthenticationData, TokenGenerator } from "./services/tokenGenerator"

import { UserDatabase } from "../data/UserDatabase"

import { CustomError } from "../errors/CustomError"
import { User } from "../data/model/User"
import { FollowUserDTO, Friend, GetUserDataByUsernameDTO, GetUserDataDTO, LoginInputDTO, SignupInputDTO, UpdateUserDTO } from "./entities/user"

export class UserBusiness {
   constructor(
      private idGenerator: IdGenerator,
      private hashGenerator: HashGenerator,
      private userDatabase: UserDatabase,
      private tokenGenerator: TokenGenerator
   ) { }

   public async createUser(
      input: SignupInputDTO
   ): Promise<string> {
      try {
         if (
            !input.username ||
            !input.email ||
            !input.password ||
            !input.isAdmin
         ) {
            throw new CustomError(422, "Missing input")
         }

         if (!input.email.includes("@")) {
            throw new CustomError(422, "Invalid email address")
         }

         if (input.password.length < 6) {
            throw new CustomError(422, "Password must be more or equal than 6 characters length")
         }

         const id = this.idGenerator.generate()

         const cypherPassword = await this.hashGenerator.hash(input.password)

         await this.userDatabase.createUser(
            new User(
               id,
               input.username,
               input.email,
               cypherPassword,
               input.isAdmin
            )
         )

         const token: string = this.tokenGenerator.generate({
            id,
            username: input.username,
            isAdmin: input.isAdmin
         });

         return token
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getUserByEmail(input: LoginInputDTO): Promise<string> {
      try {
         if (!input.email || !input.password) {
            throw new CustomError(422, "Missing input")
         }

         const user = await this.userDatabase.getUserByEmail(input)

         if (!user) {
            throw new CustomError(401, "Invalid credentials")
         }

         const isPasswordCorrect = await this.hashGenerator.compareHash(
            input.password,
            user.getPassword()
         )

         if (!isPasswordCorrect) {
            throw new CustomError(401, "Invalid credentials")
         }

         const token: string = this.tokenGenerator.generate({
            id: user.getId(),
            username: user.getUsername(),
            isAdmin: user.getIsAdmin()
         })

         return token
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async updateUser(input: UpdateUserDTO, token: string): Promise<void> {
      try {
         if (!input.password) {
            throw new CustomError(422, "Missing password")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         if (isTokenValid.isAdmin !== true) {
            throw new CustomError(422, "Only admins can access this feature")
         }

         let cypherPassword: string

         if (input.password) {
            if (input.password.length < 6) {
               throw new CustomError(422, "Password must be more or equal than 6 characters length")
            } else {
               cypherPassword = await this.hashGenerator.hash(input.password)
            }
         }

         input.password = cypherPassword

         await this.userDatabase.updateUser(input, isTokenValid.id)
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async deleteUser(token: string): Promise<void> {
      try {
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

         await this.userDatabase.deleteUser({ id: isTokenValid.id })
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getUserById(input: any, token: string): Promise<User> {
      try {
         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result: User = await this.userDatabase.getUserById(input.id
            ? { id: input.id }
            : { id: isTokenValid.id }
         )

         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getUserByUsername(input: GetUserDataByUsernameDTO, token: string): Promise<User> {
      try {
         if (!input.username) {
            throw new CustomError(417, "Missing input")
         }

         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result: User = await this.userDatabase.getUserByUsername({ username: input.username })

         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async getFriends(input: GetUserDataDTO, token: string): Promise<Friend[]> {
      try {
         if (!token) {
            throw new CustomError(422, "Missing token")
         }

         const isTokenValid: AuthenticationData = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token)

         if (!isTokenValid) {
            throw new CustomError(409, "Invalid token")
         }

         const result: Friend[] = await this.userDatabase.getFriends(input.id
            ? { id: input.id }
            : { id: isTokenValid.id }
         )

         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }

   public async followUser(input: FollowUserDTO, token: string): Promise<void> {
      try {
         if (!input.id) {
            throw new CustomError(417, "Missing input")
         }

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

         await this.userDatabase.followUser(input, isTokenValid.id)
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
   public async unfollowUser(input: FollowUserDTO, token: string): Promise<void> {
      try {
         if (!input.id) {
            throw new CustomError(417, "Missing input")
         }

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

         const result = await this.userDatabase.unfollowUser(input, isTokenValid.id)

         return result
      } catch (error) {
         throw new CustomError(error.statusCode, error.message)
      }
   }
}

export default new UserBusiness(new IdGenerator(), new HashGenerator(), new UserDatabase(), new TokenGenerator())