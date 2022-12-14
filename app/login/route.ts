import { Router } from "express";

import { ROUTES } from "@constants/index";
import { loginCandidate, logoutCandidate } from "./controller";

const router = Router();
const { LOGIN_CANDIDATE, LOGOUT_CANDIDATE } = ROUTES;

router.post(LOGIN_CANDIDATE, loginCandidate);

router.post(LOGOUT_CANDIDATE, logoutCandidate);

export default router;
