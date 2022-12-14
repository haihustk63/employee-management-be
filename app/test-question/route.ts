import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  getAllTestQuestions,
  getOneTestQuestion,
  updateTestQuestion,
  deleteTestQuestion,
  createNewTestQuestion,
  classifiedQuestion,
} from "./controller";

const { TEST_QUESTION, TEST_QUESTION_MODIFY, TEST_QUESTION_CLASSIFIED } =
  ROUTES;

const router = Router();

router.get(TEST_QUESTION, getAllTestQuestions);

router.get(TEST_QUESTION_MODIFY, getOneTestQuestion);

router.get(TEST_QUESTION_CLASSIFIED, classifiedQuestion);

router.post(TEST_QUESTION, createNewTestQuestion);

router.patch(TEST_QUESTION_MODIFY, updateTestQuestion);

router.delete(TEST_QUESTION_MODIFY, deleteTestQuestion);

export default router;
