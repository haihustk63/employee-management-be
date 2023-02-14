"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../constants/index");
const controller_1 = require("./controller");
const index_2 = require("../../middleware/index");
const { REQUESTS, REQUESTS_MODIFY } = index_1.ROUTES;
const router = (0, express_1.Router)();
router.get(REQUESTS, index_2.authMiddleware, controller_1.getRequests);
router.post(REQUESTS, index_2.authMiddleware, controller_1.createNewRequest);
router.get(REQUESTS_MODIFY, index_2.authMiddleware, controller_1.getOneRequest);
router.patch(REQUESTS_MODIFY, index_2.authMiddleware, controller_1.updateRequest);
router.delete(REQUESTS_MODIFY, index_2.authMiddleware, controller_1.deleteRequest);
exports.default = router;
