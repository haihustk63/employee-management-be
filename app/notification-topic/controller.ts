import { novuHelpers } from "@config/novu";
import { prisma } from "@config/prisma";
import { NOTIFICATION_TOPIC_ITEMS } from "@constants/index";
import { RequestHandler } from "express";

const createNotificationTopic: RequestHandler = async (req, res) => {
  try {
    const { topicKey, role } = req.body.data || {};

    const topicKeyIndex = findTopicKeyIndex(topicKey);
    if (topicKeyIndex < 0) return res.sendStatus(400);

    const newNotificationTopic = await prisma.notificationTopic.create({
      data: {
        topicName: topicKey,
        topicKey,
        role,
      },
    });

    const subscribers: string[] = await prisma.employee
      .findMany({
        where: {
          role,
        },
      })
      ?.then((employees) =>
        employees.map((employee) => employee.id.toString())
      );

    const isTopicExisted = await novuHelpers.checkTopicExisted(topicKey);
    if (!isTopicExisted) {
      await novuHelpers.createTopic({
        key: newNotificationTopic.topicKey,
        name: newNotificationTopic.topicName,
      });
    }

    await novuHelpers.addSubscribersToTopic(
      newNotificationTopic.topicKey,
      subscribers
    );

    return res.status(201).send(newNotificationTopic);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

const findTopicKeyIndex = (topicKey: string) => {
  return NOTIFICATION_TOPIC_ITEMS.findIndex(
    (item) => item.topicKey === topicKey
  );
};

const deleteNotificationTopic: RequestHandler = async (req, res) => {
  try {
    const { topicKey } = req.body.data || {};

    const topicKeyIndex = findTopicKeyIndex(topicKey);
    if (topicKeyIndex < 0) return res.sendStatus(400);

    const deletedTopic = await prisma.notificationTopic.delete({
      where: {
        topicKey,
      },
      select: {
        role: true,
      },
    });

    const subscribers: string[] = await prisma.employee
      .findMany({
        where: {
          role: deletedTopic.role,
        },
      })
      ?.then((employees) =>
        employees.map((employee) => employee.id.toString())
      );

    await novuHelpers.removeSubscribersFromTopic(topicKey, subscribers);
    return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(400);
  }
};

const getNotificationTopicConfig: RequestHandler = (req, res) => {
  return res.status(200).send(NOTIFICATION_TOPIC_ITEMS);
};

const getNotificationTopics: RequestHandler = async (req, res) => {
  const notificationTopics = await prisma.notificationTopic.findMany();
  return res.status(200).send(notificationTopics);
};

export {
  createNotificationTopic,
  getNotificationTopicConfig,
  getNotificationTopics,
  deleteNotificationTopic,
};