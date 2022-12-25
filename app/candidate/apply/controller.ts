import { sendEmail } from "@config/mailtrap";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

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
  try {
    const allApplications = await prisma.candidate.findMany({
      include: {
        job: true,
        interviewer: true,
      },
    });
    return res.status(200).send({ allApplications });
  } catch (error: any) {
    return res.status(400).send({ error });
  }
};

const updateApplication = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { candidateId } = req.params;

    const updatedApplication = await prisma.candidate.update({
      where: {
        id: Number(candidateId),
      },
      data,
    });

    if (data.assessment === 0 || data.assessment === 4) {
      const candidate = await prisma.candidate.findUnique({
        where: {
          id: Number(candidateId),
        },
      });

      if (candidate) {
        const email = candidate.email;
        if (data.assessment === 0) {
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
    console.log(error);
    return res.status(400).send({ error });
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
