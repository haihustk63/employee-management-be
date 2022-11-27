import { Response, Request } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

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
        position: true,
        interViewer: true,
      },
    });
    return res.status(200).send({ allApplications });
  } catch (error: any) {
    return res.status(400).send({ error });
  }
};

export { createNewApplication, getAllApplications };
