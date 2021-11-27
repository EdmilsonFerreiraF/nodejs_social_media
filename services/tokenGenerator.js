const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config();

class TokenGenerator {
  static expiresIn = Number(process.env.ACCESS_TOKEN_EXPIRES_IN);

  generate = (input) => {
    const newToken = jwt.sign(
      {
        id: input.id,
        nickname: input.nickname
      },
      process.env.JWT_KEY,
      {
        expiresIn: TokenGenerator.expiresIn,
      }
    );
    
    return newToken;
  };

  verify(token) {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    const result = { id: payload.id, nickname: payload.nickname };

    return result;
  };
};

module.exports = TokenGenerator