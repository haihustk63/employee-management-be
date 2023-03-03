import { Request, RequestHandler, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewTestTopic: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const newTestTopic = await prisma.testTopic.create({
      data,
    });

    return res.status(200).send({ newTestTopic });
  } catch (error: any) {
    next(error);
  }
};

const updateTestTopic: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { topicId } = req.params;
    const updatedTestTopic = await prisma.testTopic.update({
      where: {
        id: Number(topicId),
      },
      data,
    });
    return res.status(200).send({ updatedTestTopic });
  } catch (error: any) {
    next(error);
  }
};

const deleteTestTopic: RequestHandler = async (req, res, next) => {
  try {
    const { topicId } = req.params;
    await prisma.testTopic.delete({
      where: {
        id: Number(topicId),
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    next(error);
  }
};

const getAllTestTopics: RequestHandler = async (req, res, next) => {
  try {
    const allTestTopics = await prisma.testTopic.findMany();

    return res.status(200).send({ allTestTopics });
  } catch (error: any) {
    next(error);
  }
};

export {
  createNewTestTopic,
  getAllTestTopics,
  updateTestTopic,
  deleteTestTopic,
};
