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

const updatePosition = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;
    const { data } = req.body;

    const updatedPosition = await prisma.position.update({
      where: {
        id: Number(positionId),
      },
      data,
    });
    return res.status(200).send({ updatedPosition });
  } catch (error: any) {
    console.log(error)
    return res.sendStatus(400);
  }
};

const deletePosition = async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;

    await prisma.position.delete({
      where: {
        id: Number(positionId),
      },
    });
    return res.status(200).send("OK");
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export { createNewPosition, getAllPositions, updatePosition, deletePosition };
