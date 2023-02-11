"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("constants/index");
const controller_1 = require("./controller");
const index_2 = require("@middleware/index");
const { CREATE_TEST_MANUAL, CREATE_TEST_RANDOM, SAVE_TEST, TEST_MODIFY, TESTS, CONTESTANT_TEST, CONTESTANT_TEST_MODIFY, SUBMIT_TEST, } = index_1.ROUTES;
const router = (0, express_1.Router)();
//get test
router.get(TESTS, index_2.authMiddleware, controller_1.getAllTests);
router.get(TEST_MODIFY, index_2.authMiddleware, controller_1.getTest);
//
router.get(CONTESTANT_TEST, index_2.authMiddleware, controller_1.getContestantTests);
router.get(CONTESTANT_TEST_MODIFY, index_2.authMiddleware, controller_1.getContestantTest);
router.patch(CONTESTANT_TEST_MODIFY, index_2.authMiddleware, controller_1.updateContestantTest);
router.post(CONTESTANT_TEST, index_2.authMiddleware, controller_1.assignContestantTest);
//
router.post(CREATE_TEST_RANDOM, index_2.authMiddleware, controller_1.createTestRandom);
router.post(CREATE_TEST_MANUAL, index_2.authMiddleware, controller_1.createTest);
router.post(SAVE_TEST, index_2.authMiddleware, controller_1.saveTest);
router.patch(TEST_MODIFY, index_2.authMiddleware, controller_1.updateTest);
router.delete(TEST_MODIFY, index_2.authMiddleware, controller_1.deleteTest);
//
//
router.post(SUBMIT_TEST, index_2.authMiddleware, controller_1.submitTest);
exports.default = router;
