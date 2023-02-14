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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const _1 = require(".");
const transport = nodemailer_1.default.createTransport({
    host: _1.nodeMailerHost,
    port: _1.nodeMailerPort,
    auth: {
        user: _1.nodeMailerUser,
        pass: _1.nodeMailerPass,
    },
});
const sendEmail = ({ to, subject, text, html }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield transport.sendMail({
            from: "admin@gmail.com",
            to,
            subject,
            text,
            html,
        });
        console.log(res);
        return res;
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendEmail = sendEmail;
