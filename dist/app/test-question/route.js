"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../constants/index");
const controller_1 = require("./controller");
const index_2 = require("../../middleware/index");
const { TEST_QUESTION, TEST_QUESTION_MODIFY, TEST_QUESTION_CLASSIFIED } = index_1.ROUTES;
const router = (0, express_1.Router)();
router.get(TEST_QUESTION, index_2.authMiddleware, controller_1.getAllTestQuestions);
router.get(TEST_QUESTION_MODIFY, index_2.authMiddleware, controller_1.getOneTestQuestion);
router.get(TEST_QUESTION_CLASSIFIED, index_2.authMiddleware, controller_1.classifiedQuestion);
router.post(TEST_QUESTION, index_2.authMiddleware, controller_1.createNewTestQuestion);
router.patch(TEST_QUESTION_MODIFY, index_2.authMiddleware, controller_1.updateTestQuestion);
router.delete(TEST_QUESTION_MODIFY, index_2.authMiddleware, controller_1.deleteTestQuestion);
exports.default = router;
