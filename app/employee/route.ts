import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  getAllEmployeeProfile,
  getOneEmployeeProfile,
  createNewEmployeeProfile,
  updateEmployeeProfile,
  deleteEmployeeProfile,
} from "./controller";

const { EMPLOYEE_PROFILE, EMPLOYEE_PROFILE_MODIFY, EMPLOYEE_PROFILE_GROUP } = ROUTES;

const router = Router();

// get all profiles
router.get(EMPLOYEE_PROFILE, getAllEmployeeProfile);

// get a profile by id
router.get(EMPLOYEE_PROFILE_MODIFY, getOneEmployeeProfile);

// create a new employee profile
router.post(EMPLOYEE_PROFILE, createNewEmployeeProfile);

// create many profile
router.post(EMPLOYEE_PROFILE_GROUP, createNewEmployeeProfile);

// update a profile
router.patch(EMPLOYEE_PROFILE_MODIFY, updateEmployeeProfile);

// delete a profile
router.delete(EMPLOYEE_PROFILE_MODIFY, deleteEmployeeProfile);

export default router;
