import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  getApplicationStatistics,
  getCandidateStatistics,
  getEducationProgramStatistics,
  getJobStatistics,
  getRequestStatistics,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const {
  JOB_STATISTICS,
  REQUEST_STATISTICS,
  CANDIDATE_STATISTICS,
  APPLICATION_STATISTICS,
  EDUCATION_PROGRAM_STATISTICS,
} = ROUTES;

const router = Router();

router.get(JOB_STATISTICS, authMiddleware, getJobStatistics);
router.get(REQUEST_STATISTICS, authMiddleware, getRequestStatistics);
router.get(CANDIDATE_STATISTICS, authMiddleware, getCandidateStatistics);
router.get(APPLICATION_STATISTICS, authMiddleware, getApplicationStatistics);
router.get(
  EDUCATION_PROGRAM_STATISTICS,
  authMiddleware,
  getEducationProgramStatistics
);

export default router;
