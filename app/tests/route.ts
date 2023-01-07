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
router.get(TESTS, authMiddleware, getAllTests);
router.get(TEST_MODIFY, authMiddleware, getTest);
router.get(TEST_STATUS, authMiddleware, getTestSubmitStatus);
// submit answers
router.post(TEST_MODIFY, authMiddleware, authMiddleware, submitTest);
//
router.post(CREATE_TEST_RANDOM, authMiddleware, createTestRandom);
router.post(CREATE_TEST_MANUAL, authMiddleware, createTest);
router.post(SAVE_TEST, authMiddleware, saveTest);
router.patch(TEST_MODIFY, authMiddleware, updateTest);

export default router;
