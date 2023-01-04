import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  getAllAccounts,
  createNewAccount,
  deleteAccount,
  updateAccount,
} from "./controller";

const router = Router();
const { ACCOUNT } = ROUTES;

// get all account
router.get(ACCOUNT, getAllAccounts);

// create an account
router.post(ACCOUNT, createNewAccount);

//delete an account
router.delete(ACCOUNT, deleteAccount);

router.patch(ACCOUNT, updateAccount);

export default router;
