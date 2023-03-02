import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  createNotificationTopic,
  deleteNotificationTopic,
  getNotificationTopicConfig,
  getNotificationTopics,
} from "./controller";
import { authMiddleware } from "@middleware/index";

const router = Router();
const { NOTIFICATION_TOPIC, NOTIFICATION_TOPIC_CONFIG } = ROUTES;

router.post(NOTIFICATION_TOPIC, authMiddleware, createNotificationTopic);
router.get(NOTIFICATION_TOPIC, authMiddleware, getNotificationTopics);
router.get(
  NOTIFICATION_TOPIC_CONFIG,
  authMiddleware,
  getNotificationTopicConfig
);
router.delete(
  NOTIFICATION_TOPIC,
  authMiddleware,
  deleteNotificationTopic
);

export default router;
