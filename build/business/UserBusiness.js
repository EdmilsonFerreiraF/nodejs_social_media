"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBusiness = void 0;
const hashGenerator_1 = require("./services/hashGenerator");
const idGenerator_1 = require("./services/idGenerator");
const tokenGenerator_1 = require("./services/tokenGenerator");
const UserDatabase_1 = require("../data/UserDatabase");
const CustomError_1 = require("../errors/CustomError");
const User_1 = require("../data/model/User");
class UserBusiness {
    constructor(idGenerator, hashGenerator, userDatabase, tokenGenerator) {
        this.idGenerator = idGenerator;
        this.hashGenerator = hashGenerator;
        this.userDatabase = userDatabase;
        this.tokenGenerator = tokenGenerator;
    }
    createUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.username ||
                    !input.email ||
                    !input.password ||
                    !input.isAdmin && input.isAdmin !== false) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                if (!input.email.includes("@")) {
                    throw new CustomError_1.CustomError(422, "Invalid email address");
                }
                if (input.password.length < 6) {
                    throw new CustomError_1.CustomError(422, "Password must be more or equal than 6 characters length");
                }
                const id = this.idGenerator.generate();
                const cypherPassword = yield this.hashGenerator.hash(input.password);
                yield this.userDatabase.createUser(new User_1.User(id, input.username, input.email, cypherPassword, input.isAdmin));
                const token = this.tokenGenerator.generate({
                    id,
                    username: input.username,
                    isAdmin: input.isAdmin
                });
                return token;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getUserByEmail(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.email || !input.password) {
                    throw new CustomError_1.CustomError(422, "Missing input");
                }
                const user = yield this.userDatabase.getUserByEmail(input);
                if (!user) {
                    throw new CustomError_1.CustomError(401, "Invalid credentials");
                }
                const isPasswordCorrect = yield this.hashGenerator.compareHash(input.password, user.getPassword());
                if (!isPasswordCorrect) {
                    throw new CustomError_1.CustomError(401, "Invalid credentials");
                }
                const token = this.tokenGenerator.generate({
                    id: user.getId(),
                    username: user.getUsername(),
                    isAdmin: user.getIsAdmin()
                });
                return token;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    updateUser(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.password) {
                    throw new CustomError_1.CustomError(422, "Missing password");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                let cypherPassword;
                if (input.password) {
                    if (input.password.length < 6) {
                        throw new CustomError_1.CustomError(422, "Password must be more or equal than 6 characters length");
                    }
                    else {
                        cypherPassword = yield this.hashGenerator.hash(input.password);
                    }
                    input.password = cypherPassword;
                }
                yield this.userDatabase.updateUser(input, isTokenValid.id);
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    deleteUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                yield this.userDatabase.deleteUser({ id: isTokenValid.id });
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getUserByIdOrUsername(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.userDatabase.getUserByIdOrUsername(input.username
                    ? { username: input.username }
                    : { id: isTokenValid.id });
                return result;
            }
            catch (error) {
                console.log('error', error);
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getUserById(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(422, "Missing id");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.userDatabase.getUserById({ id: input.id });
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    getFriends(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                const result = yield this.userDatabase.getFriends({ id: input.id });
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    followUser(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                yield this.userDatabase.followUser(input, isTokenValid.id);
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
    unfollowUser(input, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!input.id) {
                    throw new CustomError_1.CustomError(417, "Missing input");
                }
                if (!token) {
                    throw new CustomError_1.CustomError(422, "Missing token");
                }
                const isTokenValid = this.tokenGenerator.verify(token.includes("Bearer ") ? token.replace("Bearer ", "") : token);
                if (!isTokenValid) {
                    throw new CustomError_1.CustomError(409, "Invalid token");
                }
                if (isTokenValid.isAdmin !== true) {
                    throw new CustomError_1.CustomError(422, "Only admins can access this feature");
                }
                const result = yield this.userDatabase.unfollowUser(input, isTokenValid.id);
                return result;
            }
            catch (error) {
                throw new CustomError_1.CustomError(error.statusCode, error.message);
            }
        });
    }
}
exports.UserBusiness = UserBusiness;
exports.default = new UserBusiness(new idGenerator_1.IdGenerator(), new hashGenerator_1.HashGenerator(), new UserDatabase_1.UserDatabase(), new tokenGenerator_1.TokenGenerator());
