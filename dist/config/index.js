"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinarySecret = exports.cloudinaryKey = exports.cloudinaryName = exports.nodeMailerPass = exports.nodeMailerUser = exports.nodeMailerPort = exports.nodeMailerHost = exports.webUrl = exports.appPort = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.appPort = process.env.APP_PORT || 7200;
exports.webUrl = process.env.WEB_URL || "";
//
exports.nodeMailerHost = process.env.NODE_MAILER_HOST || "";
exports.nodeMailerPort = Number(process.env.NODE_MAILER_PORT) || 0;
exports.nodeMailerUser = process.env.NODE_MAILER_USER || "";
exports.nodeMailerPass = process.env.NODE_MAILER_PASS || "";
//
exports.cloudinaryName = process.env.CLOUDINARY_NAME || "";
exports.cloudinaryKey = process.env.CLOUDINARY_KEY || "";
exports.cloudinarySecret = process.env.CLOUDINARY_SECRET || "";
