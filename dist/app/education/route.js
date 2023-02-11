"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("@config/multer"));
const index_1 = require("@middleware/index");
const index_2 = require("constants/index");
const express_1 = require("express");
const controller_1 = require("./controller");
const { EDUCATION_PROGRAMS, EDUCATION_PROGRAMS_MODIFY, EDUCATION_PROGRAMS_JOIN, MY_EDUCATION_PROGRAMS, RATE_EDUCATION_PROGRAMS, } = index_2.ROUTES;
const router = (0, express_1.Router)();
//get test
router.get(EDUCATION_PROGRAMS, index_1.authMiddleware, controller_1.getAllEducationPrograms);
router.get(MY_EDUCATION_PROGRAMS, index_1.authMiddleware, controller_1.getMyEducationPrograms);
router.post(EDUCATION_PROGRAMS, index_1.authMiddleware, multer_1.default.array("materials[]"), controller_1.createEducationProgram);
router.get(EDUCATION_PROGRAMS_MODIFY, index_1.authMiddleware, controller_1.getEducationProgramById);
router.patch(EDUCATION_PROGRAMS_MODIFY, index_1.authMiddleware, multer_1.default.array("materials[]"), controller_1.updateEducationProgram);
router.delete(EDUCATION_PROGRAMS_MODIFY, index_1.authMiddleware, controller_1.deleteEducationProgram);
router.post(EDUCATION_PROGRAMS_JOIN, index_1.authMiddleware, controller_1.joinEducationProgram);
router.delete(EDUCATION_PROGRAMS_JOIN, index_1.authMiddleware, controller_1.unJoinEducationProgram);
//
router.patch(RATE_EDUCATION_PROGRAMS, index_1.authMiddleware, controller_1.rateEducationProgram);
exports.default = router;
