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
exports.getRoleConstant = exports.getTestQuestionConstant = void 0;
const type_1 = require("../../constants/type");
const getTestQuestionConstant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        switch (name) {
            case "levels": {
                return res.status(200).send({ levels: type_1.TEST_QUESTION_LEVEL_OBJECT });
            }
            case "types": {
                return res.status(200).send({ types: type_1.TEST_QUESTION_TYPE_OBJECT });
            }
            default: {
                res.sendStatus(404);
            }
        }
    }
    catch (error) {
        return res.sendStatus(400);
    }
});
exports.getTestQuestionConstant = getTestQuestionConstant;
const getRoleConstant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   return 
    // } catch (error: any) {
    //   return res.sendStatus(400);
    // }
});
exports.getRoleConstant = getRoleConstant;
