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
exports.logout = exports.login = exports.createDeactiveToken = exports.createSerialized = exports.createToken = exports.getAccountWithEmail = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = require("cookie");
const common_1 = require("../../constants/common");
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body.data;
    if (!email || !password) {
        return res
            .status(common_1.STATUS_CODE.BAD_REQUEST)
            .send("Missing email or password");
    }
    const account = yield (0, exports.getAccountWithEmail)(email);
    if (!account) {
        return res.status(common_1.STATUS_CODE.BAD_REQUEST).send("Account does not existed");
    }
    else {
        const isRightPassword = yield bcrypt_1.default.compare(password, account.password);
        if (!isRightPassword) {
            return res
                .status(common_1.STATUS_CODE.UNAUTHORIZED)
                .send("Wrong username or password");
        }
    }
    const userInfo = Object.assign({}, account);
    delete userInfo.password;
    const token = (0, exports.createToken)(userInfo);
    const serialized = (0, exports.createSerialized)(token);
    res.setHeader("Set-Cookie", serialized);
    return res
        .status(common_1.STATUS_CODE.SUCCESS)
        .send({ status: "success", message: "Logged in", userInfo });
});
exports.login = login;
const getAccountWithEmail = (email = "") => {
    return prisma.employeeAccount.findUnique({
        where: {
            email,
        },
        include: {
            employee: {
                include: {
                    employeeAccount: {
                        select: {
                            email: true,
                        },
                    },
                },
            },
            accountFirebase: {
                select: {
                    uid: true,
                    googleEmail: true,
                },
            },
        },
    });
};
exports.getAccountWithEmail = getAccountWithEmail;
const createToken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.SECRET_TOKEN, {
        expiresIn: 60 * 60 * 24,
    });
};
exports.createToken = createToken;
const createSerialized = (token) => {
    return (0, cookie_1.serialize)("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        domain: "127.0.0.1",
        path: "/",
        sameSite: "strict",
    });
};
exports.createSerialized = createSerialized;
const createDeactiveToken = () => {
    return (0, cookie_1.serialize)("token", "", {
        httpOnly: true,
        maxAge: -1,
        domain: "127.0.0.1",
        path: "/",
        sameSite: "strict",
    });
};
exports.createDeactiveToken = createDeactiveToken;
const logout = (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(common_1.STATUS_CODE.UNAUTHORIZED).send("Unthorized");
        }
        const serialized = (0, exports.createDeactiveToken)();
        res.setHeader("Set-Cookie", serialized);
        return res.status(common_1.STATUS_CODE.SUCCESS).send({
            status: "success",
            message: "Logged out",
        });
    }
    catch (err) {
        return res.status(common_1.STATUS_CODE.SERVER_ERROR).send(err.message);
    }
};
exports.logout = logout;
