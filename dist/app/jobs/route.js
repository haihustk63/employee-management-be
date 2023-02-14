"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../../constants/index");
const controller_1 = require("./controller");
const index_2 = require("../../middleware/index");
const { JOBS, JOBS_MODIFY } = index_1.ROUTES;
const router = (0, express_1.Router)();
//get test
router.get(JOBS, controller_1.getAllJobs);
router.post(JOBS, index_2.authMiddleware, controller_1.createJob);
router.get(JOBS_MODIFY, index_2.authMiddleware, controller_1.getJobById);
router.patch(JOBS_MODIFY, index_2.authMiddleware, controller_1.updateJob);
router.delete(JOBS_MODIFY, index_2.authMiddleware, controller_1.deleteJob);
exports.default = router;
