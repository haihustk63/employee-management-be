import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { SORT_ORDER } from "@constants/common";
import { isGetAllRecords } from "utils";

const prisma = new PrismaClient();

const createNewTestQuestion = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { topicId, ...restData } = data;

    const newTestQuestion = await prisma.testQuestion.create({
      data: {
        ...restData,
        topicId: Number(topicId),
      },
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
  const { page = 1, limit = 10 } = req.query;
  try {
    const testQuestions: any = await getQuestionsWithParams(req.query, true);

    const testQuestionsWithoutLimit: any = await getQuestionsWithParams(
      req.query,
      false
    );

    const responseData: { [key: string]: any } = {
      data: testQuestions,
      page: +page,
      limit: +limit,
      total: testQuestionsWithoutLimit?.length,
    };

    return res.status(200).send(responseData);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getQuestionsWithParams = async (query: any, withLimit: boolean) => {
  const {
    keyword = "",
    topic,
    level,
    type,
    page = 1,
    limit = 10,
    questionTextSort,
  } = query as any;

  return prisma.$queryRaw`
    SELECT tq.id, tq.question_text as questionText, tq.question_source as questionSource, 
    tq.type, tq.level, tq.options, tq.answer, tt.name as topicName, tt.description as topicDescription
    FROM test_question as tq INNER JOIN test_topic as tt
    ON tq.topic_id = tt.id
    WHERE 1
    ${
      keyword
        ? Prisma.sql`AND question_text LIKE ${`%${keyword}%`}`
        : Prisma.empty
    }
    ${topic ? Prisma.sql`AND topic_id=${topic}` : Prisma.empty}
    ${level ? Prisma.sql`AND level=${level}` : Prisma.empty}
    ${type ? Prisma.sql`AND type=${type}` : Prisma.empty}
    ${
      questionTextSort
        ? +questionTextSort === SORT_ORDER.ascend.value
          ? Prisma.sql`ORDER BY tq.question_text ASC`
          : Prisma.sql`ORDER BY tq.question_text DESC`
        : Prisma.empty
    }
    ${withLimit && limit ? Prisma.sql`LIMIT ${limit}` : Prisma.empty}
    ${
      withLimit && page && limit
        ? Prisma.sql`OFFSET ${(+page - 1) * +limit}`
        : Prisma.empty
    }
  `;
};

const getOneTestQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    const testQuestion = await prisma.testQuestion.findUnique({
      where: {
        id: Number(questionId),
      },
      include: {
        topic: true,
      },
    });

    return res.status(200).send(testQuestion);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const classifiedQuestion = async (req: Request, res: Response) => {
  try {
    const allTestQuestions = await prisma.testQuestion.groupBy({
      by: ["topicId", "level"],
      _count: {
        _all: true,
      },
    });
    console.log(allTestQuestions);
    return res.status(200).send(allTestQuestions);
  } catch (error: any) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export {
  createNewTestQuestion,
  getAllTestQuestions,
  getOneTestQuestion,
  updateTestQuestion,
  deleteTestQuestion,
  classifiedQuestion,
};
