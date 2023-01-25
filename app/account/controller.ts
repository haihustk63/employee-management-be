import bcrypt from "bcrypt";
import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import e, { Request, RequestHandler, Response } from "express";
import { sendEmail } from "@config/mailtrap";

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
            role: true,
          },
        },
        candidate: {
          select: {
            name: true,
          },
        },
        candidateId: true,
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
    const { email, password, employeeId, candidateId } = data || {};

    if (!email || !password) {
      return res.sendStatus(400);
    }

    if (candidateId) {
      const candidate = await prisma.candidate.findUnique({
        where: {
          id: candidateId,
        },
      });
      if (candidate) {
        sendEmail({
          to: candidate?.email,
          subject: "New account",
          text: `Your account is ${email} and password is ${password}`,
        });
      }
    }

    const hashPassword = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
    await prisma.employeeAccount.create({
      data: {
        email,
        password: hashPassword,
        employeeId,
        candidateId,
      },
    });
    return res.status(200).send({ email });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
};

const updateAccount = async (req: Request, res: Response) => {
  try {
    const { data } = req.body;
    const { email, employeeId, candidateId } = data || {};

    if (!employeeId && !candidateId) {
      throw new Error("Need employeeId or candidateId");
    }

    const account = await prisma.employeeAccount.findUnique({
      where: {
        email,
      },
    });

    if (candidateId) {
      if (account?.candidateId) {
        return res.sendStatus(400);
      }
      await prisma.employeeAccount.update({
        where: {
          email,
        },
        data: {
          candidateId,
        },
      });
    }

    if (employeeId) {
      if (account?.employeeId) {
        return res.sendStatus(400);
      }
      await prisma.employeeAccount.update({
        where: {
          email,
        },
        data: {
          employeeId,
        },
      });
    }
    
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
    console.log(error);
    return res.status(400).send({ error });
  }
};

export { getAllAccounts, createNewAccount, deleteAccount, updateAccount };
