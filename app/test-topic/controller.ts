import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewTestTopic = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const newTestTopic = await prisma.testTopic.create({
      data,
    });

    return res.status(200).send({ newTestTopic });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const updateTestTopic = async (req: Request, res: Response) => {
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
    console.log(error);
    return res.sendStatus(400);
  }
};

const deleteTestTopic = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    await prisma.testTopic.delete({
      where: {
        id: Number(topicId),
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getAllTestTopics = async (req: Request, res: Response) => {
  try {
    const allTestTopics = await prisma.testTopic.findMany();

    return res.status(200).send({ allTestTopics });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export {
  createNewTestTopic,
  getAllTestTopics,
  updateTestTopic,
  deleteTestTopic,
};
