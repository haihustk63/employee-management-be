import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  getAllTestQuestions,
  getOneTestQuestion,
  updateTestQuestion,
  deleteTestQuestion,
  createNewTestQuestion,
  classifiedQuestion,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { TEST_QUESTION, TEST_QUESTION_MODIFY, TEST_QUESTION_CLASSIFIED } =
  ROUTES;

const router = Router();

router.get(TEST_QUESTION, authMiddleware, getAllTestQuestions);

router.get(TEST_QUESTION_MODIFY, authMiddleware, getOneTestQuestion);

router.get(TEST_QUESTION_CLASSIFIED, authMiddleware, classifiedQuestion);

router.post(TEST_QUESTION, authMiddleware, createNewTestQuestion);

router.patch(TEST_QUESTION_MODIFY, authMiddleware, updateTestQuestion);

router.delete(TEST_QUESTION_MODIFY, authMiddleware, deleteTestQuestion);

export default router;
