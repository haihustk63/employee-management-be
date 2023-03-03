import { Request, RequestHandler, Response } from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewPosition: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const newPosition = await prisma.position.create({ data });
    return res.status(200).send({ newPosition });
  } catch (error: any) {
    next(error);
  }
};

const getAllPositions: RequestHandler = async (req, res, next) => {
  try {
    const allPositions = await prisma.position.findMany();
    return res.status(200).send({ allPositions });
  } catch (error: any) {
    next(error);
  }
};

const updatePosition: RequestHandler = async (req, res, next) => {
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
    next(error);
  }
};

const deletePosition: RequestHandler = async (req, res, next) => {
  try {
    const { positionId } = req.params;

    await prisma.position.delete({
      where: {
        id: Number(positionId),
      },
    });
    return res.status(200).send("OK");
  } catch (error: any) {
    next(error);
  }
};

export { createNewPosition, getAllPositions, updatePosition, deletePosition };
