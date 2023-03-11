import { Router } from "express";

import { ROUTES } from "@constants/index";
import {
  createNotificationTopic,
  deleteNotificationTopic,
  getNotificationTopicConfig,
  getNotificationTopics,
  updateNotificationTopic
} from "./controller";
import { authMiddleware } from "@middleware/index";

const router = Router();
const { NOTIFICATION_TOPIC, NOTIFICATION_TOPIC_CONFIG } = ROUTES;

router.post(NOTIFICATION_TOPIC, authMiddleware, createNotificationTopic);
router.patch(NOTIFICATION_TOPIC, authMiddleware, updateNotificationTopic);
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
