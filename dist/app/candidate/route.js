"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const index_1 = require("@constants/index");
const index_2 = require("@middleware/index");
const { CANDIDATE_APPLY, CANDIDATE_APPLY_ID } = index_1.ROUTES;
const router = (0, express_1.Router)();
router.post(CANDIDATE_APPLY, controller_1.createNewApplication);
router.get(CANDIDATE_APPLY, index_2.authMiddleware, controller_1.getAllApplications);
router.patch(CANDIDATE_APPLY_ID, index_2.authMiddleware, controller_1.updateApplication);
router.delete(CANDIDATE_APPLY_ID, index_2.authMiddleware, controller_1.deleteApplication);
exports.default = router;