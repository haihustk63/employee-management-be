import uploadCloud from "@config/cloudinary";
import upload from "@config/multer";
import { UPCLOUD_FOLDERS } from "@constants/common";
import { authMiddleware } from "@middleware/index";
import { ROUTES } from "constants/index";
import { Router } from "express";
import {
  createEducationProgram,
  deleteEducationProgram,
  getAllEducationPrograms,
  getEducationProgramById,
  getMyEducationPrograms,
  joinEducationProgram,
  rateEducationProgram,
  unJoinEducationProgram,
  updateEducationProgram,
} from "./controller";

const {
  EDUCATION_PROGRAMS,
  EDUCATION_PROGRAMS_MODIFY,
  EDUCATION_PROGRAMS_JOIN,
  MY_EDUCATION_PROGRAMS,
  RATE_EDUCATION_PROGRAMS,
} = ROUTES;

const router = Router();

//get test
router.get(EDUCATION_PROGRAMS, authMiddleware, getAllEducationPrograms);
router.get(MY_EDUCATION_PROGRAMS, authMiddleware, getMyEducationPrograms);
router.post(
  EDUCATION_PROGRAMS,
  authMiddleware,
  upload.array("materials[]"),
  createEducationProgram
);
router.get(EDUCATION_PROGRAMS_MODIFY, authMiddleware, getEducationProgramById);
router.patch(
  EDUCATION_PROGRAMS_MODIFY,
  authMiddleware,
  upload.array("materials[]"),
  updateEducationProgram
);
router.delete(
  EDUCATION_PROGRAMS_MODIFY,
  authMiddleware,
  deleteEducationProgram
);
router.post(EDUCATION_PROGRAMS_JOIN, authMiddleware, joinEducationProgram);
router.delete(EDUCATION_PROGRAMS_JOIN, authMiddleware, unJoinEducationProgram);
//
router.patch(RATE_EDUCATION_PROGRAMS, authMiddleware, rateEducationProgram);

export default router;
