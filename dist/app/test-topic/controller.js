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
exports.deleteTestTopic = exports.updateTestTopic = exports.getAllTestTopics = exports.createNewTestTopic = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewTestTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const newTestTopic = yield prisma.testTopic.create({
            data,
        });
        return res.status(200).send({ newTestTopic });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.createNewTestTopic = createNewTestTopic;
const updateTestTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const { topicId } = req.params;
        const updatedTestTopic = yield prisma.testTopic.update({
            where: {
                id: Number(topicId),
            },
            data,
        });
        return res.status(200).send({ updatedTestTopic });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updateTestTopic = updateTestTopic;
const deleteTestTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topicId } = req.params;
        yield prisma.testTopic.delete({
            where: {
                id: Number(topicId),
            },
        });
        return res.sendStatus(200);
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.deleteTestTopic = deleteTestTopic;
const getAllTestTopics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTestTopics = yield prisma.testTopic.findMany();
        return res.status(200).send({ allTestTopics });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getAllTestTopics = getAllTestTopics;
