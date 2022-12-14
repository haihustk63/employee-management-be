import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const createTest = async (req: Request, res: Response) => {
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
        prisma.$queryRaw`SELECT id, \`question-text\` AS questionText, \`question-source\` AS questionSource, options, \`type\`  
          FROM testQuestion tq
          WHERE tq.topicId = ${r.topicId} and tq.level = ${r.level}
          ORDER BY RAND() LIMIT ${r.amount}
          `
    );

    const tests = await Promise.all(reqPromises).then((data) => data.flat());

    return res.status(200).send(tests);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export { createTest };
