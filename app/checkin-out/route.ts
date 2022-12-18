import { Router } from "express";
import { ROUTES } from "@constants/index";
import { checkInOut, getCheckInOutInfo } from "./controller";
import { authMiddleware } from "@middleware/index";

const { CHECK_IN_OUT } = ROUTES;

const router = Router();

router.post(CHECK_IN_OUT, authMiddleware, checkInOut);

router.get(CHECK_IN_OUT, authMiddleware, getCheckInOutInfo);

export default router;
