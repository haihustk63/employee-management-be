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
exports.deletePosition = exports.updatePosition = exports.getAllPositions = exports.createNewPosition = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = req.body;
        const newPosition = yield prisma.position.create({ data });
        return res.status(200).send({ newPosition });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.createNewPosition = createNewPosition;
const getAllPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPositions = yield prisma.position.findMany();
        return res.status(200).send({ allPositions });
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getAllPositions = getAllPositions;
const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { positionId } = req.params;
        const { data } = req.body;
        const updatedPosition = yield prisma.position.update({
            where: {
                id: Number(positionId),
            },
            data,
        });
        return res.status(200).send({ updatedPosition });
    }
    catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});
exports.updatePosition = updatePosition;
const deletePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { positionId } = req.params;
        yield prisma.position.delete({
            where: {
                id: Number(positionId),
            },
        });
        return res.status(200).send("OK");
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.deletePosition = deletePosition;
