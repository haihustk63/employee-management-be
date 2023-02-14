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
exports.unlinkFirebaseAccount = exports.loginFirebase = exports.createNewFirebaseAccount = void 0;
const controller_1 = require("../login-out/controller");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewFirebaseAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const { uid, email: googleEmail } = data || {};
    const employee = res.getHeader("user");
    const email = employee.employeeAccount.email;
    if (!uid) {
        return res.sendStatus(400);
    }
    yield prisma.accountFirebase.create({
        data: {
            uid,
            email,
            googleEmail,
        },
    });
    const newEmployeeInfo = yield (0, controller_1.getAccountWithEmail)(email);
    return res.status(201).send(newEmployeeInfo);
});
exports.createNewFirebaseAccount = createNewFirebaseAccount;
const loginFirebase = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const { uid } = data || {};
    if (!uid) {
        return res.sendStatus(400);
    }
    const account = yield prisma.accountFirebase.findUnique({
        where: {
            uid,
        },
        select: {
            email: true,
        },
    });
    if (!account) {
        return res.status(400).send("Account not found");
    }
    const userInfo = yield (0, controller_1.getAccountWithEmail)(account === null || account === void 0 ? void 0 : account.email);
    userInfo === null || userInfo === void 0 ? true : delete userInfo.password;
    const token = (0, controller_1.createToken)(userInfo);
    const serialized = (0, controller_1.createSerialized)(token);
    res.setHeader("Set-Cookie", serialized);
    return res
        .status(200)
        .send({ status: "success", message: "Logged in", userInfo });
});
exports.loginFirebase = loginFirebase;
const unlinkFirebaseAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = req.body;
    const { uid } = data || {};
    const employee = res.getHeader("user");
    const email = employee.employeeAccount.email;
    if (!uid) {
        return res.sendStatus(400);
    }
    const accountFirebase = yield prisma.accountFirebase.findUnique({
        where: {
            uid,
        },
        select: {
            email: true,
        },
    });
    if (email !== (accountFirebase === null || accountFirebase === void 0 ? void 0 : accountFirebase.email)) {
        return res.sendStatus(400);
    }
    yield prisma.accountFirebase.delete({
        where: {
            uid,
        },
    });
    const newEmployeeInfo = yield (0, controller_1.getAccountWithEmail)(email);
    return res.status(201).send(newEmployeeInfo);
});
exports.unlinkFirebaseAccount = unlinkFirebaseAccount;
