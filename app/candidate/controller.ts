import { sendEmail } from "@config/mailtrap";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { ASSESSMENT, TEST_STATUS } from "@constants/common";

const { considering, failed, good, notGood, passed } = ASSESSMENT;
const { attempting, created, done } = TEST_STATUS;

const prisma = new PrismaClient();

const createNewApplication = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const newApplication = await prisma.candidate.create({ data });
    return res.status(200).send({ newApplication });
  } catch (error: any) {
    return res.status(400).send({ error });
  }
};

const getAllApplications = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const applications = await getApplicationsWithParams(req.query);
  const applicationsWithoutLimit = await getApplicationsWithParams(
    req.query,
    false
  );
  const response = {
    page: +page,
    limit: +limit,
    data: applications,
    total: applicationsWithoutLimit?.length,
  };
  return res.status(200).send(response);
};

const getApplicationsWithParams = (query: any, withLimit: boolean = true) => {
  const { page = 1, limit = 10, keyword, assessment } = query;

  const pageParams: object = withLimit
    ? {
        take: +limit,
        skip: (+page - 1) * +limit,
      }
    : {};

  const whereExtraQuery: any = {};

  if (keyword) {
    whereExtraQuery.OR = [
      {
        name: {
          contains: keyword,
        },
      },
      {
        email: {
          contains: keyword,
        },
      },
    ];
  }

  if (Number.isInteger(+assessment)) {
    whereExtraQuery.assessment = {
      equals: +assessment,
    };
  }

  return prisma.candidate.findMany({
    where: whereExtraQuery,
    include: {
      job: true,
      interviewer: true,
      employeeAccount: {
        select: {
          email: true,
          employeeId: true,
          candidateId: true,
          skillTestAccount: {
            include: {
              test: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
    ...pageParams,
  });
};

const updateApplication = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { assessment, ...rest } = data || {};
    const { candidateId } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: Number(candidateId),
      },
      include: {
        employeeAccount: {
          select: {
            employeeId: true,
          },
        },
      },
    });

    if (candidate?.employeeAccount?.employeeId) {
      throw new Error("This candidate has became official employee");
    }

    if (
      candidate?.assessment === failed.value ||
      candidate?.assessment === passed.value
    ) {
      throw new Error("This candidate has passed or failed");
    }

    const updatedApplication = await prisma.candidate.update({
      where: {
        id: Number(candidateId),
      },
      data: { assessment, ...rest },
      select: {
        employeeAccount: {
          select: {
            email: true,
            employeeId: true,
            candidateId: true,
          },
        },
      },
    });

    if (assessment === failed.value || assessment === passed.value) {
      const candidate = await prisma.candidate.findUnique({
        where: {
          id: Number(candidateId),
        },
      });

      if (candidate) {
        const email = candidate.email;
        if (assessment === failed.value) {
          sendEmail({
            to: email,
            subject: "Sorry",
            text: "We are so sorry because your experience does not meet our needs",
          });
        } else {
          sendEmail({
            to: email,
            subject: "Congratulations",
            text: "We are so pleasure to inform that you have passed our interview process",
          });
        }
      }
    }

    return res.status(200).send({ updatedApplication });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;

    await prisma.candidate.delete({
      where: {
        id: Number(candidateId),
      },
    });
    return res.status(200).send("OK");
  } catch (error: any) {
    return res.status(400).send({ error });
  }
};

export {
  createNewApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
