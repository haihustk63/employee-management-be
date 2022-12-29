import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createNewRequest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;

    const newRequest = await prisma.request.create({
      data,
    });

    return res.status(200).send({ newRequest });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getRequests = async (req: Request, res: Response) => {
  try {
    const allRequests = await prisma.request.findMany({
      include: {
        employee: {
          select: {
            lastName: true,
            firstName: true,
            middleName: true,
          },
        },
      },
    });

    return res.status(200).send({ allRequests });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const updateRequest = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { requestId } = req.params;

    const updatedRequestQuestion = await prisma.request.update({
      where: {
        id: Number(requestId),
      },
      data,
    });
    return res.status(200).send({ updatedRequestQuestion });
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    await prisma.request.delete({
      where: {
        id: Number(requestId),
      },
    });
    return res.sendStatus(200);
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(400);
  }
};

const getOneTestQuestion = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const request = await prisma.request.findUnique({
      where: {
        id: Number(requestId),
      },
    });

    return res.status(200).send(request);
  } catch (error: any) {
    return res.sendStatus(400);
  }
};

export {
  createNewRequest,
  updateRequest,
  deleteRequest,
  getOneTestQuestion,
  getRequests,
};
