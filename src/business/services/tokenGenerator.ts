import dotenv from "dotenv"
import * as jwt from "jsonwebtoken"

dotenv.config()

export class TokenGenerator {
  private static expiresIn: number = Number(process.env.ACCESS_TOKEN_EXPIRES_IN)

  public generate = (input: AuthenticationData): string => {
    const newToken = jwt.sign(
      {
        id: input.id,
        username: input.username,
        isAdmin: input.isAdmin
      },
      process.env.JWT_KEY as string,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    )

    return newToken
  }

  public verify(token: string) {
    const payload = jwt.verify(token, process.env.JWT_KEY as string) as any
    const result = { id: payload.id, username: payload.username, isAdmin: payload.isAdmin }

    return result
  }
}

export type AuthenticationData = {
  id: string,
  username: string,
  isAdmin: boolean
}

export default new TokenGenerator()