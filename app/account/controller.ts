import bcrypt from "bcrypt";
import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const allAccounts = await prisma.employeeAccount.findMany({
      select: {
        email: true,
        createdAt: true,
        updatedAt: true,
        employeeId: true,
      },
    });
    return res.status(200).send({ allAccounts });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const createNewAccount = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { email, password, employeeId } = data;

    const hashPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    await prisma.employeeAccount.create({
      data: {
        email,
        password: hashPassword,
        employeeId,
      },
    });
    return res.status(200).send({ newAccount: { email } });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    await prisma.employeeAccount.delete({ where: { email } });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export { getAllAccounts, createNewAccount, deleteAccount };
