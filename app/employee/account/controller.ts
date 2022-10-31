import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { IEmployeeAccountInfo } from "./interface";

const prisma = new PrismaClient();

const getAllEmployeeAccounts = async (req: Request, res: Response) => {
  try {
    const allEmployeeAccounts = await prisma.employeeAccount.findMany({
      select: {
        email: true,
        employeeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).send({ allEmployeeAccounts });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const createEmployeeAccount = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { email, password, employeeId } = data;

    const hashPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);

    const newEmployeeAccount = await prisma.employeeAccount.create({
      data: {
        email,
        password: hashPassword,
        employeeId,
      },
    });
    const resInfo: Partial<IEmployeeAccountInfo> = { ...newEmployeeAccount };
    delete resInfo.password;
    return res.status(200).send({ newEmployeeAccount: { ...resInfo } });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const updateEmployeeAccount = async (req: Request, res: Response) => {
  try {
    const {
      data: { password },
    } = req.body;
    const { employeeId } = req.params;

    const hashPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);

    const updatedEmployeeAccount = await prisma.employeeAccount.update({
      where: {
        employeeId: Number(employeeId),
      },
      data: {
        password: hashPassword,
      },
    });
    return res.status(200).send({ updatedEmployeeAccount });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const deleteEmployeeAccount = async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;

    await prisma.employeeAccount.delete({
      where: {
        employeeId: Number(employeeId),
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export {
  getAllEmployeeAccounts,
  createEmployeeAccount,
  updateEmployeeAccount,
  deleteEmployeeAccount,
};
