"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
class BaseDatabase {
}
exports.default = BaseDatabase;
BaseDatabase.uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}.mongodb.net/${process.env.DB_NAME}`;
BaseDatabase.connect = (0, mongoose_1.connect)(BaseDatabase.uri);
