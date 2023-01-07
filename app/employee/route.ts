import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  getAllEmployeeProfile,
  getOneEmployeeProfile,
  createNewEmployeeProfile,
  updateEmployeeProfile,
  deleteEmployeeProfile,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { EMPLOYEE_PROFILE, EMPLOYEE_PROFILE_MODIFY, EMPLOYEE_PROFILE_GROUP } =
  ROUTES;

const router = Router();

// get all profiles
router.get(EMPLOYEE_PROFILE, authMiddleware, getAllEmployeeProfile);

// get a profile by id
router.get(EMPLOYEE_PROFILE_MODIFY, authMiddleware, getOneEmployeeProfile);

// create a new employee profile
router.post(EMPLOYEE_PROFILE, authMiddleware, createNewEmployeeProfile);

// create many profile
router.post(EMPLOYEE_PROFILE_GROUP, authMiddleware, createNewEmployeeProfile);

// update a profile
router.patch(EMPLOYEE_PROFILE_MODIFY, authMiddleware, updateEmployeeProfile);

// delete a profile
router.delete(EMPLOYEE_PROFILE_MODIFY, authMiddleware, deleteEmployeeProfile);

export default router;
