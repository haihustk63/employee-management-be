import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  getAllTestQuestions,
  updateTestQuestion,
  deleteTestQuestion,
  createNewTestQuestion,
} from "./controller";

const { TEST_QUESTION, TEST_QUESTION_MODIFY } = ROUTES;

const router = Router();

router.get(TEST_QUESTION, getAllTestQuestions);

router.post(TEST_QUESTION, createNewTestQuestion);

router.patch(TEST_QUESTION_MODIFY, updateTestQuestion);

router.delete(TEST_QUESTION_MODIFY, deleteTestQuestion);

export default router;
