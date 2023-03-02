import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

import { STATUS_CODE } from "@constants/common";

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body.data;
  if (!email || !password) {
    return res
      .status(STATUS_CODE.BAD_REQUEST)
      .send("Missing email or password");
  }
  const account = await getAccountWithEmail(email, true);

  if (!account) {
    return res.status(STATUS_CODE.BAD_REQUEST).send("Account does not existed");
  } else {
    const isRightPassword = await bcrypt.compare(password, account.password);
    if (!isRightPassword) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .send("Wrong username or password");
    }
  }

  const userInfo: any = { ...account };
  delete userInfo.password;
  const token = createToken(userInfo);
  const serialized = createSerialized(token);
  res.setHeader("Set-Cookie", serialized);
  return res
    .status(STATUS_CODE.SUCCESS)
    .send({ status: "success", message: "Logged in", userInfo });
};

export const getAccountWithEmail = (
  email: string = "",
  isGetPassword: boolean = false
) => {
  return prisma.employeeAccount.findUnique({
    where: {
      email,
    },
    select: {
      employee: {
        include: {
          employeeAccount: {
            select: {
              email: true,
            },
          },
        },
      },
      candidate: {
        select: {
          job: true,
          interviewer: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
          name: true,
          email: true,
          phone: true,
          appointmentTime: true,
          cvLink: true,
        },
      },
      accountFirebase: {
        select: {
          uid: true,
          googleEmail: true,
        },
      },
      employeeId: true,
      email: true,
      candidateId: true,
      password: isGetPassword,
    },
  });
};

export const createToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_TOKEN as string, {
    expiresIn: 60 * 60 * 24,
  });
};

export const createSerialized = (token: string) => {
  return serialize("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    domain: "127.0.0.1",
    path: "/",
    sameSite: "strict",
  });
};

export const createDeactiveToken = () => {
  return serialize("token", "", {
    httpOnly: true,
    maxAge: -1,
    domain: "127.0.0.1",
    path: "/",
    sameSite: "strict",
  });
};

const logout = (req: Request, res: Response) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(STATUS_CODE.UNAUTHORIZED).send("Unthorized");
    }

    const serialized = createDeactiveToken();
    res.setHeader("Set-Cookie", serialized);
    return res.status(STATUS_CODE.SUCCESS).send({
      status: "success",
      message: "Logged out",
    });
  } catch (err: any) {
    return res.status(STATUS_CODE.SERVER_ERROR).send(err.message);
  }
};

export { login, logout };
