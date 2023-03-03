import { sendEmail } from "@config/mailtrap";
import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

import { ASSESSMENT, TEST_STATUS } from "@constants/common";
import { generateFailInterviewEmail } from "@config/mail-template/fail-interview";
import { generatePassInterviewEmail } from "@config/mail-template/pass-interview";

const { considering, failed, good, notGood, passed } = ASSESSMENT;
const { attempting, created, done } = TEST_STATUS;

const prisma = new PrismaClient();

const createNewApplication: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const newApplication = await prisma.candidate.create({ data });
    return res.status(200).send({ newApplication });
  } catch (error: any) {
    next(error);
  }
};

const getAllApplications: RequestHandler = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
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

const updateApplication: RequestHandler = async (req, res, next) => {
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
        include: {
          job: {
            select: {
              title: true,
            },
          },
        },
      });

      if (candidate) {
        const email = candidate.email;
        if (assessment === failed.value) {
          sendEmail({
            to: email,
            subject: "Thank you for your time",
            html: generateFailInterviewEmail({
              name: candidate.name,
              jobTitle: candidate.job?.title,
            }),
          });
        } else {
          sendEmail({
            to: email,
            subject: "Thank you for your time",
            html: generatePassInterviewEmail({
              name: candidate.name,
              jobTitle: candidate.job?.title,
            }),
          });
        }
      }
    }

    return res.status(200).send({ updatedApplication });
  } catch (error: any) {
    next(error);
  }
};

const deleteApplication: RequestHandler = async (req, res, next) => {
  try {
    const { candidateId } = req.params;

    await prisma.candidate.delete({
      where: {
        id: Number(candidateId),
      },
    });
    return res.status(200).send("OK");
  } catch (error: any) {
    next(error);
  }
};

export {
  createNewApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
