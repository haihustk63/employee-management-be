import { Router } from "express";

import { createNewApplication, getAllApplications } from "./controller";
import { ROUTES } from "@constants/index";

const { CANDIDATE_APPLY } = ROUTES;

const router = Router();

router.post(CANDIDATE_APPLY, createNewApplication);

router.get(CANDIDATE_APPLY, getAllApplications);

export default router;
