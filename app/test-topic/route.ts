import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createNewTestTopic,
  getAllTestTopics,
  updateTestTopic,
  deleteTestTopic,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const { TEST_TOPICS, TEST_TOPICS_MODIFY } = ROUTES;

const router = Router();

router.get(TEST_TOPICS, authMiddleware, getAllTestTopics);

router.post(TEST_TOPICS, authMiddleware, createNewTestTopic);

router.patch(TEST_TOPICS_MODIFY, authMiddleware, updateTestTopic);

router.delete(TEST_TOPICS_MODIFY, authMiddleware, deleteTestTopic);

export default router;
