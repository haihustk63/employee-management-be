import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  getAllAccounts,
  createNewAccount,
  deleteAccount,
  updateAccount,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const router = Router();
const { ACCOUNT } = ROUTES;

// get all account
router.get(ACCOUNT, authMiddleware, getAllAccounts);

// create an account
router.post(ACCOUNT, authMiddleware, createNewAccount);

//delete an account
router.delete(ACCOUNT, authMiddleware, deleteAccount);

router.patch(ACCOUNT, authMiddleware, updateAccount);

export default router;
