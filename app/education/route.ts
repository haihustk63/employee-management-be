import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createEducationProgram,
  getAllEducationPrograms,
  getEducationProgramById,
  updateEducationProgram,
  deleteEducationProgram,
  joinEducationProgram,
  unJoinEducationProgram,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const {
  EDUCATION_PROGRAMS,
  EDUCATION_PROGRAMS_MODIFY,
  EDUCATION_PROGRAMS_JOIN,
} = ROUTES;

const router = Router();

//get test
router.get(EDUCATION_PROGRAMS, authMiddleware, getAllEducationPrograms);
router.post(EDUCATION_PROGRAMS, authMiddleware, createEducationProgram);
router.get(EDUCATION_PROGRAMS_MODIFY, authMiddleware, getEducationProgramById);
router.patch(EDUCATION_PROGRAMS_MODIFY, authMiddleware, updateEducationProgram);
router.delete(
  EDUCATION_PROGRAMS_MODIFY,
  authMiddleware,
  deleteEducationProgram
);
router.post(EDUCATION_PROGRAMS_JOIN, authMiddleware, joinEducationProgram);
router.delete(EDUCATION_PROGRAMS_JOIN, authMiddleware, unJoinEducationProgram);

export default router;
