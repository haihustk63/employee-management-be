import { ROUTES } from "@constants/index";
import { authMiddleware } from "@middleware/index";
import { Router } from "express";
import {
    checkInOut,
    getCheckInOutInfo,
    getCheckInOutList,
    getCheckInOutTimesheet
} from "./controller";

const { CHECK_IN_OUT, CHECK_IN_OUT_LIST, CHECK_IN_OUT_TIMESHEET } = ROUTES;

const router = Router();

router.post(CHECK_IN_OUT, authMiddleware, checkInOut);

router.get(CHECK_IN_OUT, authMiddleware, getCheckInOutInfo);

router.get(CHECK_IN_OUT_LIST, getCheckInOutList);

router.get(CHECK_IN_OUT_TIMESHEET, getCheckInOutTimesheet);

export default router;
