import { Router } from "express";

import {
  createNewApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
} from "./controller";
import { ROUTES } from "@constants/index";
import { authMiddleware } from "@middleware/index";

const { CANDIDATE_APPLY, CANDIDATE_APPLY_ID } = ROUTES;

const router = Router();

router.post(CANDIDATE_APPLY, createNewApplication);

router.get(CANDIDATE_APPLY, authMiddleware, getAllApplications);

router.patch(CANDIDATE_APPLY_ID, authMiddleware, updateApplication);

router.delete(CANDIDATE_APPLY_ID, authMiddleware, deleteApplication);

export default router;
