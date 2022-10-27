import { Router } from "express";

import { ROUTES } from "@constants/index";
import { getAllAccounts, createNewAccount, deleteAccount } from "./controller";

const router = Router();
const { CANDIDATE_ACCOUNT, CANDIDATE_ACCOUNT_MODIFY } = ROUTES;

// get all account
router.get(CANDIDATE_ACCOUNT, getAllAccounts);

// create an account
router.post(CANDIDATE_ACCOUNT, createNewAccount);

//delete an account
router.delete(CANDIDATE_ACCOUNT_MODIFY, deleteAccount);

export default router;
