"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("constants/index");
const controller_1 = require("./controller");
const index_2 = require("@middleware/index");
const { TEST_TOPICS, TEST_TOPICS_MODIFY } = index_1.ROUTES;
const router = (0, express_1.Router)();
router.get(TEST_TOPICS, index_2.authMiddleware, controller_1.getAllTestTopics);
router.post(TEST_TOPICS, index_2.authMiddleware, controller_1.createNewTestTopic);
router.patch(TEST_TOPICS_MODIFY, index_2.authMiddleware, controller_1.updateTestTopic);
router.delete(TEST_TOPICS_MODIFY, index_2.authMiddleware, controller_1.deleteTestTopic);
exports.default = router;
