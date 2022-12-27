import { Router } from "express";

import { ROUTES } from "@constants/index";
import { loginEmployee, logout } from "./controller";

const router = Router();
const { LOGIN_CANDIDATE, LOGOUT, LOGIN_EMPLOYEE } = ROUTES;

// router.post(LOGIN_CANDIDATE, loginCandidate);

router.post(LOGIN_EMPLOYEE, loginEmployee);

router.post(LOGOUT, logout);

export default router;
