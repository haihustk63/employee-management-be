import { Request, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewPosition = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const newPosition = await prisma.position.create({ data });
    return res.status(200).send({ newPosition });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

const getAllPositions = async (req: Request, res: Response) => {
  try {
    const allPositions = await prisma.position.findMany();
    return res.status(200).send({ allPositions });
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export { createNewPosition, getAllPositions };
