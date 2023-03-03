import {
  createSerialized,
  createToken,
  getAccountWithEmail,
} from "@app/login-out/controller";
import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";

const prisma = new PrismaClient();

const createNewFirebaseAccount: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { uid, email: googleEmail } = data || {};
    const employee = res.getHeader("user") as any;
    const email = employee.employeeAccount.email;

    if (!uid) {
      return res.sendStatus(400);
    }

    await prisma.accountFirebase.create({
      data: {
        uid,
        email,
        googleEmail,
      },
    });

    const newEmployeeInfo = await getAccountWithEmail(email);

    return res.status(201).send(newEmployeeInfo);
  } catch (error) {
    next(error);
  }
};

const loginFirebase: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { uid } = data || {};

    if (!uid) {
      return res.sendStatus(400);
    }

    const account = await prisma.accountFirebase.findUnique({
      where: {
        uid,
      },
      select: {
        email: true,
      },
    });

    if (!account) {
      return res.status(400).send("Account not found");
    }

    const userInfo: any = await getAccountWithEmail(account?.email);
    delete userInfo?.password;
    const token = createToken(userInfo);
    const serialized = createSerialized(token);
    res.setHeader("Set-Cookie", serialized);
    return res
      .status(200)
      .send({ status: "success", message: "Logged in", userInfo });
  } catch (error) {
    next(error);
  }
};

const unlinkFirebaseAccount: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { uid } = data || {};
    const employee = res.getHeader("user") as any;
    const email = employee.employeeAccount.email;

    if (!uid) {
      return res.sendStatus(400);
    }

    const accountFirebase = await prisma.accountFirebase.findUnique({
      where: {
        uid,
      },
      select: {
        email: true,
      },
    });

    if (email !== accountFirebase?.email) {
      return res.sendStatus(400);
    }

    await prisma.accountFirebase.delete({
      where: {
        uid,
      },
    });

    const newEmployeeInfo = await getAccountWithEmail(email);

    return res.status(201).send(newEmployeeInfo);
  } catch (error) {
    next(error);
  }
};

export { createNewFirebaseAccount, loginFirebase, unlinkFirebaseAccount };
