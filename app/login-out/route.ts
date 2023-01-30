import { Router } from "express";

import { ROUTES } from "@constants/index";
import { login, logout } from "./controller";

const router = Router();
const { LOGIN, LOGOUT } = ROUTES;

// router.post(LOGIN_CANDIDATE, loginCandidate);

router.post(LOGIN, login);

router.post(LOGOUT, logout);

export default router;
