import { Router } from "express";

import { ROUTES } from "@constants/index";
import { getAllAccounts, createNewAccount, deleteAccount } from "./controller";

const router = Router();
const { ACCOUNT, ACCOUNT_MODIFY } = ROUTES;

// get all account
router.get(ACCOUNT, getAllAccounts);

// create an account
router.post(ACCOUNT, createNewAccount);

//delete an account
router.delete(ACCOUNT_MODIFY, deleteAccount);

export default router;
