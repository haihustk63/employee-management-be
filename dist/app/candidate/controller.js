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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteApplication = exports.updateApplication = exports.getAllApplications = exports.createNewApplication = void 0;
const mailtrap_1 = require("@config/mailtrap");
const client_1 = require("@prisma/client");
const common_1 = require("@constants/common");
const { considering, failed, good, notGood, passed } = common_1.ASSESSMENT;
const { attempting, created, done } = common_1.TEST_STATUS;
const prisma = new client_1.PrismaClient();
const createNewApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const newApplication = yield prisma.candidate.create({ data });
        return res.status(200).send({ newApplication });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.createNewApplication = createNewApplication;
const getAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allApplications = yield prisma.candidate.findMany({
            include: {
                job: true,
                interviewer: true,
                employeeAccount: {
                    select: {
                        email: true,
                        employeeId: true,
                        candidateId: true,
                        skillTestAccount: {
                            include: {
                                test: {
                                    select: {
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return res.status(200).send({ allApplications });
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.getAllApplications = getAllApplications;
const updateApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { data } = req.body;
        const _b = data || {}, { assessment } = _b, rest = __rest(_b, ["assessment"]);
        const { candidateId } = req.params;
        const candidate = yield prisma.candidate.findUnique({
            where: {
                id: Number(candidateId),
            },
            include: {
                employeeAccount: {
                    select: {
                        employeeId: true,
                    },
                },
            },
        });
        if ((_a = candidate === null || candidate === void 0 ? void 0 : candidate.employeeAccount) === null || _a === void 0 ? void 0 : _a.employeeId) {
            throw new Error("This candidate has became official employee");
        }
        if ((candidate === null || candidate === void 0 ? void 0 : candidate.assessment) === failed.value ||
            (candidate === null || candidate === void 0 ? void 0 : candidate.assessment) === passed.value) {
            throw new Error("This candidate has passed or failed");
        }
        const updatedApplication = yield prisma.candidate.update({
            where: {
                id: Number(candidateId),
            },
            data: Object.assign({ assessment }, rest),
            select: {
                employeeAccount: {
                    select: {
                        email: true,
                        employeeId: true,
                        candidateId: true,
                    },
                },
            },
        });
        if (assessment === failed.value || assessment === passed.value) {
            const candidate = yield prisma.candidate.findUnique({
                where: {
                    id: Number(candidateId),
                },
            });
            if (candidate) {
                const email = candidate.email;
                if (assessment === failed.value) {
                    (0, mailtrap_1.sendEmail)({
                        to: email,
                        subject: "Sorry",
                        text: "We are so sorry because your experience does not meet our needs",
                    });
                }
                else {
                    (0, mailtrap_1.sendEmail)({
                        to: email,
                        subject: "Congratulations",
                        text: "We are so pleasure to inform that you have passed our interview process",
                    });
                }
            }
        }
        return res.status(200).send({ updatedApplication });
    }
    catch (error) {
        return res.status(400).send(error.message);
    }
});
exports.updateApplication = updateApplication;
const deleteApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { candidateId } = req.params;
        yield prisma.candidate.delete({
            where: {
                id: Number(candidateId),
            },
        });
        return res.status(200).send("OK");
    }
    catch (error) {
        return res.status(400).send({ error });
    }
});
exports.deleteApplication = deleteApplication;
