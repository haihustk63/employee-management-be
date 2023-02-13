import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  createNewFirebaseAccount,
  loginFirebase,
  unlinkFirebaseAccount,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const router = Router();
const { FIREBASE_ACCOUNT, FIREBASE_ACCOUNT_LOGIN } = ROUTES;

// create an account
router.post(FIREBASE_ACCOUNT_LOGIN, loginFirebase);

router.post(FIREBASE_ACCOUNT, authMiddleware, createNewFirebaseAccount);

router.delete(FIREBASE_ACCOUNT, authMiddleware, unlinkFirebaseAccount);

export default router;
