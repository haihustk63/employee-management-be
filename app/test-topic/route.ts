import { Router } from "express";
import { ROUTES } from "constants/index";
import {
  createNewTestTopic,
  getAllTestTopics,
  updateTestTopic,
  deleteTestTopic
} from "./controller";

const { TEST_TOPICS, TEST_TOPICS_MODIFY } = ROUTES;

const router = Router();

router.get(TEST_TOPICS, getAllTestTopics);

router.post(TEST_TOPICS, createNewTestTopic);

router.patch(TEST_TOPICS_MODIFY, updateTestTopic);

router.delete(TEST_TOPICS_MODIFY, deleteTestTopic);

export default router;
