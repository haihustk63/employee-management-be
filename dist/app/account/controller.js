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
exports.changePassword = exports.updateAccount = exports.deleteAccount = exports.createNewAccount = exports.getAllAccounts = void 0;
const mailtrap_1 = require("../../config/mailtrap");
const index_1 = require("../../constants/index");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getAllAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, page = 1 } = req.query;
    const accounts = yield getAccountsParams(req.query);
    const accountsWithoutLimit = yield getAccountsParams(req.query, false);
    const response = {
        data: accounts,
        total: accountsWithoutLimit === null || accountsWithoutLimit === void 0 ? void 0 : accountsWithoutLimit.length,
        limit: +limit,
        page: +page,
    };
    return res.status(200).send(response);
});
exports.getAllAccounts = getAllAccounts;
const getAccountsParams = (query, withLimit = true) => {
    const { limit = 10, page = 1, keyword } = query;
    const whereExtraQuery = {};
    const containKeyword = {
        contains: keyword,
    };
    if (keyword) {
        whereExtraQuery.OR = [
            {
                email: containKeyword,
            },
            {
                employee: {
                    OR: [
                        {
                            firstName: containKeyword,
                        },
                        {
                            middleName: containKeyword,
                        },
                        {
                            lastName: containKeyword,
                        },
                    ],
                },
            },
            {
                candidate: {
                    name: containKeyword,
                },
            },
        ];
    }
    const pageParams = withLimit
        ? {
            take: +limit,
            skip: (+page - 1) * +limit,
        }
        : {};
    return prisma.employeeAccount.findMany(Object.assign({ where: whereExtraQuery, select: {
            email: true,
            createdAt: true,
            updatedAt: true,
            employeeId: true,
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    role: true,
                },
            },
            candidate: {
                select: {
                    name: true,
                },
            },
            candidateId: true,
        } }, pageParams));
};
const createNewAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { email, password, employeeId, candidateId } = data || {};
        if (!email || !password) {
            return res.sendStatus(400);
        }
        const isAccountExisted = yield checkAccountExist(email);
        if (isAccountExisted) {
            return res.sendStatus(400);
        }
        if (candidateId) {
            const candidate = yield prisma.candidate.findUnique({
                where: {
                    id: candidateId,
                },
            });
            if (candidate) {
                (0, mailtrap_1.sendEmail)({
                    to: candidate === null || candidate === void 0 ? void 0 : candidate.email,
                    subject: "New account",
                    text: `Your account is ${email} and password is ${password}`,
                });
            }
        }
        const hashPassword = yield bcrypt_1.default.hash(password, index_1.PASSWORD_SALT_ROUNDS);
        yield prisma.employeeAccount.create({
            data: {
                email,
                password: hashPassword,
                employeeId,
                candidateId,
            },
        });
        return res.status(200).send({ email });
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ error });
    }
});
exports.createNewAccount = createNewAccount;
const checkAccountExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const account = yield prisma.employeeAccount.findUnique({
        where: {
            email,
        },
    });
    return !!account;
});
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { email, employeeId, candidateId } = data || {};
        if (!employeeId && !candidateId) {
            throw new Error("Need employeeId or candidateId");
        }
        const account = yield prisma.employeeAccount.findUnique({
            where: {
                email,
            },
        });
        if (candidateId) {
            if (account === null || account === void 0 ? void 0 : account.candidateId) {
                return res.sendStatus(400);
            }
            yield prisma.employeeAccount.update({
                where: {
                    email,
                },
                data: {
                    candidateId,
                },
            });
        }
        if (employeeId) {
            if (account === null || account === void 0 ? void 0 : account.employeeId) {
                return res.sendStatus(400);
            }
            yield prisma.employeeAccount.update({
                where: {
                    email,
                },
                data: {
                    employeeId,
                },
            });
        }
        return res.sendStatus(200);
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.updateAccount = updateAccount;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email = "" } = req.body.data;
        yield prisma.employeeAccount.delete({ where: { email } });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send({ error });
    }
});
exports.deleteAccount = deleteAccount;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeAccount: { email }, } = res.getHeader("user");
        const { oldPassword, newPassword } = req.body.data || {};
        if (!oldPassword || !newPassword) {
            return res.sendStatus(400);
        }
        const account = yield prisma.employeeAccount.findUnique({
            where: {
                email,
            },
        });
        const rightPassword = yield bcrypt_1.default.compare(oldPassword, account === null || account === void 0 ? void 0 : account.password);
        if (!rightPassword) {
            return res.status(400).send({ message: "Password is incorrect" });
        }
        const newPasswordHash = yield bcrypt_1.default.hash(newPassword, index_1.PASSWORD_SALT_ROUNDS);
        yield prisma.employeeAccount.update({
            where: {
                email,
            },
            data: {
                password: newPasswordHash,
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.changePassword = changePassword;
