import bcrypt from "bcrypt";
import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import { Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const allAccounts = await prisma.employeeAccount.findMany({
      select: {
        email: true,
        createdAt: true,
        updatedAt: true,
        employeeId: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            middleName: true,
          },
        },
      },
    });
    return res.status(200).send({ allAccounts });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const createNewAccount: RequestHandler = async (req, res, next) => {
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

const updateAccount = async (req: Request, res: Response) => {
  try {
    const { email = "", employeeId = "" } = req.body.data;
    if (!employeeId) {
      throw new Error("Need employeeId");
    }
    await prisma.employeeAccount.update({
      where: {
        email,
      },
      data: {
        employeeId: Number(employeeId),
      },
    });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { email = "" } = req.body.data;
    await prisma.employeeAccount.delete({ where: { email } });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export { getAllAccounts, createNewAccount, deleteAccount, updateAccount };
