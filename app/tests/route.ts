import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createTest,
  createTestRandom,
  saveTest,
  getTest,
  submitTest,
  getAllTests,
  getTestSubmitStatus,
  updateTest,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const {
  CREATE_TEST_MANUAL,
  CREATE_TEST_RANDOM,
  SAVE_TEST,
  TEST_MODIFY,
  TEST_STATUS,
  TESTS,
} = ROUTES;

const router = Router();

//get test
router.get(TESTS, getAllTests);
router.get(TEST_MODIFY, getTest);
router.get(TEST_STATUS, getTestSubmitStatus);
// submit answers
router.post(TEST_MODIFY, authMiddleware, submitTest);
//
router.post(CREATE_TEST_RANDOM, createTestRandom);
router.post(CREATE_TEST_MANUAL, createTest);
router.post(SAVE_TEST, saveTest);
router.patch(TEST_MODIFY, updateTest);

export default router;
