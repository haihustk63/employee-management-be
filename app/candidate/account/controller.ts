import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const allAccounts = await prisma.candidateAccount.findMany({
      select: {
        candidateId: true,
        candidate: true,
        username: true,
        createdAt: true,
        updatedAt: true,
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
    const { username, password, candidateId } = data;

    const hashPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);
    await prisma.candidateAccount.create({
      data: {
        username,
        password: hashPassword,
        candidateId,
      },
    });
    return res.status(200).send({ newAccount: { username } });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    await prisma.candidateAccount.delete({ where: { username } });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export { getAllAccounts, createNewAccount, deleteAccount };
