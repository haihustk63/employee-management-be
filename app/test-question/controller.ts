import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { TEST_QUESTION_LEVEL, TEST_QUESTION_TYPE } from "@constants/type";

const prisma = new PrismaClient();

const createNewTestQuestion = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const transformData = {
      ...data,
      type: TEST_QUESTION_TYPE[data.type],
      level: TEST_QUESTION_LEVEL[data.level],
    };

    const newTestQuestion = await prisma.testQuestion.create({
      data: transformData,
    });

    return res.status(200).send({ newTestQuestion });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateTestQuestion = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { questionId } = req.params;

    const transformData = {
      ...data,
      type: TEST_QUESTION_TYPE[data.type],
      level: TEST_QUESTION_LEVEL[data.level],
    };

    console.log(transformData)

    const updatedTestQuestion = await prisma.testQuestion.update({
      where: {
        id: Number(questionId),
      },
      data: transformData,
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
      include: {
        topic: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.status(200).send({ allTestQuestions });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export {
  createNewTestQuestion,
  getAllTestQuestions,
  updateTestQuestion,
  deleteTestQuestion,
};
