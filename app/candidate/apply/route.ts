import { Router } from "express";

import {
  createNewApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
} from "./controller";
import { ROUTES } from "@constants/index";

const { CANDIDATE_APPLY, CANDIDATE_APPLY_ID } = ROUTES;

const router = Router();

router.post(CANDIDATE_APPLY, createNewApplication);

router.get(CANDIDATE_APPLY, getAllApplications);

router.patch(CANDIDATE_APPLY_ID, updateApplication);

router.delete(CANDIDATE_APPLY_ID, deleteApplication);

export default router;
