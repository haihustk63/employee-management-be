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
exports.classifiedQuestion = exports.deleteTestQuestion = exports.updateTestQuestion = exports.getOneTestQuestion = exports.getAllTestQuestions = exports.createNewTestQuestion = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewTestQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { topicId } = data, restData = __rest(data, ["topicId"]);
        const newTestQuestion = yield prisma.testQuestion.create({
            data: Object.assign(Object.assign({}, restData), { topicId: Number(topicId) }),
        });
        return res.status(200).send({ newTestQuestion });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.createNewTestQuestion = createNewTestQuestion;
const updateTestQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { questionId } = req.params;
        const updatedTestQuestion = yield prisma.testQuestion.update({
            where: {
                id: Number(questionId),
            },
            data,
        });
        return res.status(200).send({ updatedTestQuestion });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateTestQuestion = updateTestQuestion;
const deleteTestQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        yield prisma.testQuestion.delete({
            where: {
                id: Number(questionId),
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.deleteTestQuestion = deleteTestQuestion;
const getAllTestQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword = "", topic, level, type } = req.query;
        const allTestQuestions = yield prisma.$queryRaw `
    SELECT tq.id, tq.question_text as questionText, tq.question_source as questionSource, 
    tq.type, tq.level, tq.options, tq.answer, tt.name as topicName, tt.description as topicDescription
    FROM test_question as tq INNER JOIN test_topic as tt
    ON tq.topic_id = tt.id
    WHERE 1
    ${keyword
            ? client_1.Prisma.sql `AND question_text LIKE ${`%${keyword}%`}`
            : client_1.Prisma.empty}
    ${topic ? client_1.Prisma.sql `AND topic_id=${topic}` : client_1.Prisma.empty}
    ${level ? client_1.Prisma.sql `AND level=${level}` : client_1.Prisma.empty}
    ${type ? client_1.Prisma.sql `AND type=${type}` : client_1.Prisma.empty}
  `;
        return res.status(200).send({ allTestQuestions });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getAllTestQuestions = getAllTestQuestions;
const getOneTestQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        const testQuestion = yield prisma.testQuestion.findUnique({
            where: {
                id: Number(questionId),
            },
            include: {
                topic: true,
            },
        });
        return res.status(200).send(testQuestion);
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getOneTestQuestion = getOneTestQuestion;
const classifiedQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTestQuestions = yield prisma.testQuestion.groupBy({
            by: ["topicId", "level"],
            _count: {
                _all: true,
            },
        });
        console.log(allTestQuestions);
        return res.status(200).send(allTestQuestions);
    }
    catch (error) {
        console.log(error.message);
        return res.sendStatus(400);
    }
});
exports.classifiedQuestion = classifiedQuestion;
