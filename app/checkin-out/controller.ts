import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checkInOut = async (req: Request, res: Response) => {
  try {
    const { type } = req.body.data;
    const { id: employeeId } = res.getHeader("user") as any;

    const isChecked = await getChecked(type as string, employeeId);

    if (isChecked.isChecked) {
      throw new Error("You have checked in/out today");
    }

    const checkInReq = await prisma.checkInOut.create({
      data: {
        employeeId: Number(employeeId),
        type: Number(type),
      },
    });

    return res.status(200).send(checkInReq);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

const getCheckInOutInfo = async (req: Request, res: Response) => {
  try {
    const { id: employeeId } = res.getHeader("user") as any;
    const { type } = req.query;

    if (!type) {
      throw new Error("Type is required");
    }

    const isChecked = await getChecked(type as string, employeeId);

    return res.status(200).send(isChecked);
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
};

const getChecked = async (type: string, employeeId: string) => {
  const today = new Date().toDateString();

  const checkInOutInfo = await prisma.checkInOut.findMany({
    where: {
      employeeId: Number(employeeId),
      type: Number(type),
    },
  });

  const info = checkInOutInfo.find(
    (record) => new Date(record.time).toDateString() === today
  );

  return {
    isChecked: info ? true : false,
    time: info?.time,
  };
};

export { checkInOut, getCheckInOutInfo };
