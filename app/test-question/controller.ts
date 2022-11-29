import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

import { TestQuestionLevel, TestQuestionType } from "@constants/type";

const prisma = new PrismaClient();

const createNewTestQuestion = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const transformData = {
      ...data,
      type: TestQuestionType[data.type],
      level: TestQuestionLevel[data.level],
    };

    const newTestQuestion = await prisma.testQuestion.create({
      data: transformData,
    });

    return res.status(200).send({ newTestQuestion });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const updateTestQuestion = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { questionId } = req.params;
    const updatedTestQuestion = await prisma.testQuestion.update({
      where: {
        id: Number(questionId),
      },
      data,
    });
    return res.status(200).send({ updatedTestQuestion });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const deleteTestQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;
    await prisma.testQuestion.delete({
      where: {
        id: Number(questionId),
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getAllTestQuestions = async (req: Request, res: Response) => {
  try {
    const { topicId } = req.query;

    const allTestQuestions = await prisma.testQuestion.findMany({
      where: {
        topicId: topicId ? Number(topicId) : undefined,
      },
    });

    return res.status(200).send({ allTestQuestions });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export {
  createNewTestQuestion,
  getAllTestQuestions,
  updateTestQuestion,
  deleteTestQuestion,
};
