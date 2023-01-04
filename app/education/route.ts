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

const {
  EDUCATION_PROGRAMS,
  EDUCATION_PROGRAMS_MODIFY,
  EDUCATION_PROGRAMS_JOIN,
} = ROUTES;

const router = Router();

//get test
router.get(EDUCATION_PROGRAMS, getAllEducationPrograms);
router.post(EDUCATION_PROGRAMS, createEducationProgram);
router.get(EDUCATION_PROGRAMS_MODIFY, getEducationProgramById);
router.patch(EDUCATION_PROGRAMS_MODIFY, updateEducationProgram);
router.delete(EDUCATION_PROGRAMS_MODIFY, deleteEducationProgram);
router.post(EDUCATION_PROGRAMS_JOIN, joinEducationProgram);
router.delete(EDUCATION_PROGRAMS_JOIN, unJoinEducationProgram);

export default router;
