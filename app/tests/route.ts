import { Router } from "express";
import { ROUTES } from "@constants/index";
import {
  createTest,
  createTestRandom,
  saveTest,
  getTest,
  submitTest,
  getAllTests,
  updateTest,
  getContestantTests,
  getContestantTest,
  updateContestantTest,
  assignContestantTest,
  deleteTest,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const {
  CREATE_TEST_MANUAL,
  CREATE_TEST_RANDOM,
  SAVE_TEST,
  TEST_MODIFY,
  TESTS,
  CONTESTANT_TEST,
  CONTESTANT_TEST_MODIFY,
  SUBMIT_TEST,
} = ROUTES;

const router = Router();

//get test
router.get(TESTS, authMiddleware, getAllTests);
router.get(TEST_MODIFY, authMiddleware, getTest);
//
router.get(CONTESTANT_TEST, authMiddleware, getContestantTests);
router.get(CONTESTANT_TEST_MODIFY, authMiddleware, getContestantTest);
router.patch(CONTESTANT_TEST_MODIFY, authMiddleware, updateContestantTest);
router.post(CONTESTANT_TEST, authMiddleware, assignContestantTest);
//
router.post(CREATE_TEST_RANDOM, authMiddleware, createTestRandom);
router.post(CREATE_TEST_MANUAL, authMiddleware, createTest);
router.post(SAVE_TEST, authMiddleware, saveTest);
router.patch(TEST_MODIFY, authMiddleware, updateTest);
router.delete(TEST_MODIFY, authMiddleware, deleteTest);
//
//
router.post(SUBMIT_TEST, authMiddleware, submitTest);

export default router;
