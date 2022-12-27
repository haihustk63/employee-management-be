import { sendEmail } from "@config/mailtrap";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createTestRandom = async (req: Request, res: Response) => {
  try {
    const { data: infoQuestion } = req.body;

    let transformInfo: any[] = [];
    infoQuestion.map((item: any) => {
      return Object.keys(item).map((key) => {
        if (key !== "topicId") {
          transformInfo = [
            ...transformInfo,
            { topicId: item.topicId, level: key, amount: item[key] },
          ];
        }
      });
    });

    const transformInfoFilter = transformInfo.filter((tr) => tr.amount);
    const reqPromises = transformInfoFilter.map(
      (r) =>
        prisma.$queryRaw`
          SELECT id, \`question-text\` AS questionText, \`question-source\` AS questionSource, options, \`type\`, answer 
          FROM testQuestion tq
          WHERE tq.topicId = ${r.topicId} and tq.level = ${r.level}
          ORDER BY RAND() LIMIT ${r.amount}
          `
    );

    const test = await Promise.all(reqPromises).then((data) => data.flat());

    return res.status(200).send(test);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const createTest = async (req: Request, res: Response) => {
  try {
    const { data: questionIds } = req.body;

    const test = await prisma.testQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    return res.status(200).send(test);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const saveTest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { questionIds, candidateId } = data;
    await prisma.skillTest.create({
      data: {
        candidateId: Number(candidateId),

        testQuestionTests: {
          create: questionIds.map((id: number) => ({
            questionId: id,
          })),
        },
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const updateTest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { questionIds, testId } = data;

    const questions = await prisma.testQuestionTests.findMany({
      where: {
        testId: Number(testId),
      },
    });

    const oldQuestionIds = questions?.map(
      (question: any) => question.questionId
    );

    const newIds = questionIds?.filter(
      (id: number) => !oldQuestionIds.includes(id)
    );
    const removeIds = oldQuestionIds?.filter(
      (id: number) => !questionIds.includes(id)
    );

    const removeRecords = prisma.testQuestionTests.deleteMany({
      where: {
        testId: {
          in: removeIds,
        },
      },
    });

    const addRecords = prisma.testQuestionTests.createMany({
      data: newIds?.map((id: number) => ({
        testId: Number(testId),
        questionId: id,
      })),
    });

    await prisma.$transaction([removeRecords, addRecords]);

    return res.sendStatus(200);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const getTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const test = await prisma.testQuestionTests.findMany({
      where: {
        testId: Number(testId),
      },
      include: {
        question: {
          include: {
            topic: true,
          },
        },
        test: {
          select: {
            isSubmitted: true,
          },
        },
      },
    });

    return res.status(200).send({ test });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const getTestSubmitStatus = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const test = await prisma.skillTest.findUnique({
      where: {
        id: Number(testId),
      },
      select: {
        isSubmitted: true,
        score: true,
        testQuestionTests: {
          select: {
            question: {
              select: {
                type: true,
              },
            },
          },
        },
      },
    });
    const questionCount = test?.testQuestionTests.length;
    const essayCount = test?.testQuestionTests.filter(
      (question: any) => question.question.type === "ESSAYS"
    ).length;
    const isSubmitted = test?.isSubmitted;
    return res.status(200).send({ isSubmitted, questionCount, essayCount });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const getAllTests = async (req: Request, res: Response) => {
  try {
    const tests = await prisma.skillTest.findMany({
      include: {
        candidate: {
          select: {
            name: true,
          },
        },
        testQuestionTests: true,
      },
    });
    const resTests = tests?.map((test: any) => ({
      id: test.id,
      candidateId: test.candidateId,
      score: test.score,
      isSubmitted: test.isSubmitted,
      candidate: test.candidate,
      countQuestion: test.testQuestionTests?.length,
    }));
    return res.status(200).send({ tests: resTests });
  } catch (error) {
    return res.sendStatus(400);
  }
};

const submitTest = async (req: Request, res: Response) => {
  try {
    const { data: answers } = req.body;
    const { testId } = req.params;
    const candidate = res.getHeader("user") as any;

    const updateQueries = answers.map((answer: any) => {
      return prisma.testQuestionTests.update({
        where: {
          questionId_testId: {
            testId: Number(testId),
            questionId: answer.questionId,
          },
        },
        data: {
          answer: answer.answer,
        },
      });
    });

    await prisma.$transaction(updateQueries);

    const score = await prisma.testQuestionTests
      .findMany({
        where: {
          testId: Number(testId),
        },
        select: {
          answer: true,
          question: {
            select: {
              answer: true,
            },
          },
        },
      })
      .then((data: any[]) => {
        let score = 0;
        data.map((item: any) => {
          if (item.question.answer) {
            if (
              JSON.stringify(item.answer) ===
              JSON.stringify(item.question.answer)
            ) {
              score += 1;
            }
          }
        });
        return score;
      });

    await prisma.skillTest.update({
      where: {
        id: Number(testId),
      },
      data: {
        isSubmitted: true,
        score,
      },
    });

    await sendEmail({
      to: candidate.email,
      subject: "You have submitted the test successfully",
      text: "Congratulations! You have successfully submitted the test!",
    });

    return res.status(200).send("OK");
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export {
  createTestRandom,
  createTest,
  saveTest,
  getTest,
  submitTest,
  getAllTests,
  getTestSubmitStatus,
  updateTest
};
