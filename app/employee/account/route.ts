import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  createEmployeeAccount,
  getAllEmployeeAccounts,
  deleteEmployeeAccount,
  updateEmployeeAccount,
} from "./controller";

const { EMPLOYEE_ACCOUNT, EMPLOYEE_ACCOUNT_MODIFY } = ROUTES;

const router = Router();

// create an account
router.post(EMPLOYEE_ACCOUNT, createEmployeeAccount);

// get all accounts
router.get(EMPLOYEE_ACCOUNT, getAllEmployeeAccounts);

// update an account
router.patch(EMPLOYEE_ACCOUNT_MODIFY, updateEmployeeAccount);

// delete an account
router.delete(EMPLOYEE_ACCOUNT_MODIFY, deleteEmployeeAccount);

export default router;