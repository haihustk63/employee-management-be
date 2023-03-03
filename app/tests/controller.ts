import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";
import { sendEmail } from "@config/mailtrap";
import { ROLES, TEST_STATUS, QUESTION_TYPES } from "@constants/common";
import { generateSubmitTestEmail } from "@config/mail-template/submit-test";

const { CANDIDATE, EMPLOYEE, DIVISION_MANAGER, ADMIN, SUPER_ADMIN } = ROLES;
const { created, attempting, done } = TEST_STATUS;
const { essays, multipleChoice, oneChoice } = QUESTION_TYPES;

const prisma = new PrismaClient();

const createTestRandom: RequestHandler = async (req, res, next) => {
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
          SELECT id, question_text AS questionText, question_source AS questionSource, options, \`type\`, answer 
          FROM test_question tq
          WHERE tq.topic_id = ${r.topicId} and tq.level = ${r.level}
          ORDER BY RAND() LIMIT ${r.amount}
          `
    );

    const test = await Promise.all(reqPromises).then((data) => data.flat());

    return res.status(200).send(test);
  } catch (error: any) {
    next(error);
  }
};

const createTest: RequestHandler = async (req, res, next) => {
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
    next(error);
  }
};

const saveTest: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { questionIds, title, duration } = data;
    if (!title || !duration) {
      return res
        .status(400)
        .send({ message: "Title and duration must be provided" });
    }

    const newTest = await prisma.skillTest.create({
      data: {
        title,
        duration,
        testQuestionSkillTest: {
          create: questionIds.map((id: number) => ({
            questionId: id,
          })),
        },
      },
    });

    return res.status(201).send(newTest);
  } catch (error: any) {
    next(error);
  }
};

const updateTest: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { testId: id } = req.params;
    const { questionIds, title, duration } = data;

    const testId = Number(id);

    const questions = await prisma.testQuestionSkillTest.findMany({
      where: {
        testId: testId,
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

    const removeRecords = prisma.testQuestionSkillTest.deleteMany({
      where: {
        questionId: {
          in: removeIds,
        },
      },
    });

    const addRecords = prisma.testQuestionSkillTest.createMany({
      data: newIds?.map((id: number) => ({
        testId,
        questionId: id,
      })),
    });

    const updateTestInfo = prisma.skillTest.update({
      where: {
        id: testId,
      },
      data: {
        title,
        duration,
      },
    });

    await prisma.$transaction([updateTestInfo, removeRecords, addRecords]);

    return res.sendStatus(200);
  } catch (error: any) {
    next(error);
  }
};

const deleteTest: RequestHandler = async (req, res, next) => {
  try {
    const { testId } = req.params;

    await prisma.skillTest.delete({
      where: {
        id: parseInt(testId),
      },
    });

    return res.sendStatus(200);
  } catch (error: any) {
    next(error);
  }
};

const getTest: RequestHandler = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const test = await prisma.skillTest.findUnique({
      where: {
        id: Number(testId),
      },
      include: {
        testQuestionSkillTest: {
          select: {
            question: {
              include: {
                topic: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            questionId: true,
          },
        },
        skillTestAccount: {
          select: {
            status: true,
          },
        },
      },
    });

    return res.status(200).send({ test });
  } catch (error: any) {
    next(error);
  }
};

const getAllTests: RequestHandler = async (req, res, next) => {
  try {
    const tests = await prisma.skillTest.findMany({
      include: {
        testQuestionSkillTest: {
          include: {
            question: true,
          },
        },
        skillTestAccount: true,
      },
    });
    return res.status(200).send({ tests });
  } catch (error) {
    next(error);
  }
};

const getContestantTests: RequestHandler = async (req, res, next) => {
  try {
    const email = res.getHeader("email") as any;
    const tests = await prisma.skillTestAccount.findMany({
      where: {
        email,
      },
      include: {
        test: true,
        skillTestSessionAnswer: true,
      },
    });
    return res.status(200).send({ tests });
  } catch (error) {
    next(error);
  }
};

const getContestantTest: RequestHandler = async (req, res, next) => {
  try {
    const { testId: id } = req.params;
    const email = res.getHeader("email") as any;
    const role = res.getHeader("role") as any;
    const testId = Number(id);

    const includeAnswer = role === CANDIDATE.value ? false : true;

    const test = await getContestantTestQuery({ testId, includeAnswer });

    if (role === CANDIDATE.value) {
      if (test?.email !== email) {
        return res.sendStatus(403);
      } else {
        if (test?.status === created.value) {
          const responseData: any = {
            id: test.id,
            email: test.email,
            status: test.status,
          };
          return res.status(200).send(responseData);
        }

        if (test?.status === done.value) {
          const questionCount = test.test.testQuestionSkillTest.length;
          const essayCount = test.test.testQuestionSkillTest.filter(
            (item) => item.question.type === essays.value
          )?.length;
          const responseData: any = {
            status: test.status,
            score: test.score,
            email: test.account.candidate?.email,
            questionCount,
            essayCount,
          };
          return res.status(200).send(responseData);
        }
      }
    }

    if (role === EMPLOYEE.value || role === DIVISION_MANAGER.value) {
      if (test?.email !== email) {
        return res.sendStatus(403);
      }
    }

    return res.status(200).send(test);
  } catch (error) {
    next(error);
  }
};

const getContestantTestQuery = ({ testId, includeAnswer }: any) => {
  return prisma.skillTestAccount.findUnique({
    where: {
      id: testId,
    },
    include: {
      test: {
        include: {
          testQuestionSkillTest: {
            include: {
              question: {
                select: {
                  options: true,
                  questionSource: true,
                  questionText: true,
                  type: true,
                  answer: includeAnswer,
                },
              },
            },
          },
        },
      },
      skillTestSessionAnswer: {
        include: {
          question: true,
        },
      },
      account: {
        select: {
          candidate: {
            select: {
              email: true,
              name: true,
              job: {
                select: {
                  title: true,
                },
              },
            },
          },
          employee: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              position: {
                select: {
                  name: true,
                },
              },
              deliveryEmployee: {
                select: {
                  delivery: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

const assignContestantTest: RequestHandler = async (req, res, next) => {
  try {
    const { email, testId } = req.body.data || {};

    if (!email || !testId) {
      return res.sendStatus(400);
    }

    const currentTest = await prisma.skillTestAccount.findUnique({
      where: {
        email_testId: {
          testId,
          email,
        },
      },
    });

    if (!currentTest || currentTest?.status === created.value) {
      await prisma.skillTestAccount.deleteMany({
        where: {
          email,
          status: created.value,
        },
      });

      await prisma.skillTestAccount.create({
        data: {
          testId,
          email,
        },
      });

      return res.sendStatus(201);
    }

    if (currentTest?.status === attempting.value) {
      return res
        .status(400)
        .send({ message: "The candidate is currently attempting" });
    }

    if (currentTest?.status === done.value) {
      return res
        .status(400)
        .send({ message: "The candidate has done this test" });
    }
  } catch (error) {
    next(error);
  }
};

const updateContestantTest: RequestHandler = async (req, res, next) => {
  try {
    const { confirmAttempt } = req.body.data || {};
    const { testId: id } = req.params;
    const email = res.getHeader("email") as any;

    const testId = Number(id);

    const testAccount = await prisma.skillTestAccount.findUnique({
      where: {
        id: testId,
      },
    });

    if (testAccount?.email !== email) {
      throw new Error("Not have the right");
    }

    if (confirmAttempt && testAccount?.status === created.value) {
      const updatedTest = await prisma.skillTestAccount.update({
        where: {
          id: testId,
        },
        data: {
          status: attempting.value,
        },
        include: {
          test: {
            select: {
              duration: true,
            },
          },
        },
      });

      const countdownTime = updatedTest.test.duration * 60 + 30;
      const timeout = setTimeout(() => {
        updateTestStatusJob(testId);
        clearTimeout(timeout);
      }, countdownTime * 1000);
      // const job = createJob(countdownTime, updateTestStatusJob(testId));
    }
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const updateTestStatusJob = async (testId: number) => {
  const testAccount = await prisma.skillTestAccount.findUnique({
    where: {
      id: testId,
    },
  });

  const currentStatus = testAccount?.status;
  if (currentStatus !== done.value) {
    await prisma.skillTestAccount.update({
      where: {
        id: testId,
      },
      data: {
        status: done.value,
      },
    });
  }
};

const submitTest: RequestHandler = async (req, res, next) => {
  try {
    const { testId, answers } = req.body.data;
    let score = 0;
    let email = res.getHeader("email") as any;
    const role = res.getHeader("role");

    const currentTest = await prisma.skillTestAccount.findUnique({
      where: {
        id: testId,
      },
    });

    if (currentTest?.email !== email) {
      return res.sendStatus(403);
    }

    const validAnswer = answers?.every(
      (answer: any) => answer.sessionId === testId
    );

    if (!validAnswer) {
      return res.sendStatus(400);
    }

    if (currentTest?.status === done.value) {
      return res.sendStatus(400);
    }

    await prisma.skillTestSessionAnswer.createMany({
      data: answers,
    });

    const submittedAnswers = await prisma.skillTestSessionAnswer.findMany({
      where: {
        sessionId: testId,
      },
      include: {
        question: true,
      },
    });

    submittedAnswers.forEach((item) => {
      if (item.question.type !== essays.value) {
        const rightAnswer = item.question.answer;
        const userAnswer = item.answer;
        if (JSON.stringify(rightAnswer) === JSON.stringify(userAnswer)) {
          score += 1;
        }
      }
    });

    const testResult = await prisma.skillTestAccount.update({
      where: {
        id: testId,
      },
      data: {
        score,
        status: done.value,
      },
      select: {
        test: {
          include: {
            testQuestionSkillTest: {
              include: {
                question: {
                  select: {
                    type: true,
                  },
                },
              },
            },
          },
        },
        score: true,
      },
    });

    if (role === CANDIDATE.value) {
      const account = await prisma.employeeAccount.findUnique({
        where: {
          email,
        },
        include: {
          candidate: true,
        },
      });
      email = account?.candidate?.email;
    }

    const essayQuestions = testResult.test.testQuestionSkillTest.filter(
      (question) => question.question.type === QUESTION_TYPES.essays.value
    );

    await sendEmail({
      to: email,
      subject: "You have submitted the test successfully",
      html: generateSubmitTestEmail({
        title: testResult.test.title,
        duration: testResult.test.duration,
        questionCount: testResult.test.testQuestionSkillTest.length,
        essayQuestionCount: essayQuestions.length,
        score: testResult.score,
      }),
    });
    return res.status(200).send("OK");
  } catch (error: any) {
    next(error);
  }
};

export {
  createTestRandom,
  createTest,
  saveTest,
  getTest,
  submitTest,
  getAllTests,
  updateTest,
  deleteTest,
  getContestantTests,
  updateContestantTest,
  getContestantTest,
  assignContestantTest,
};
