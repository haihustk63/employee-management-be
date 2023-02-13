import { sendEmail } from "@config/mailtrap";
import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

const getAllAccounts = async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;

  const accounts = await getAccountsParams(req.query);
  const accountsWithoutLimit = await getAccountsParams(req.query, false);
  const response = {
    data: accounts,
    total: accountsWithoutLimit?.length,
    limit: +limit,
    page: +page,
  };

  return res.status(200).send(response);
};

const getAccountsParams = (query: any, withLimit: boolean = true) => {
  const { limit = 10, page = 1, keyword } = query;
  const whereExtraQuery: any = {};

  const containKeyword = {
    contains: keyword,
  };

  if (keyword) {
    whereExtraQuery.OR = [
      {
        email: containKeyword,
      },
      {
        employee: {
          OR: [
            {
              firstName: containKeyword,
            },
            {
              middleName: containKeyword,
            },
            {
              lastName: containKeyword,
            },
          ],
        },
      },
      {
        candidate: {
          name: containKeyword,
        },
      },
    ];
  }

  const pageParams: object = withLimit
    ? {
        take: +limit,
        skip: (+page - 1) * +limit,
      }
    : {};

  return prisma.employeeAccount.findMany({
    where: whereExtraQuery,
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
    ...pageParams,
  });
};

const createNewAccount: RequestHandler = async (req, res, next) => {
  try {
    const { data } = req.body;
    const { email, password, employeeId, candidateId } = data || {};

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const isAccountExisted = await checkAccountExist(email);

    if (isAccountExisted) {
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

const checkAccountExist = async (email: string) => {
  const account = await prisma.employeeAccount.findUnique({
    where: {
      email,
    },
  });

  return !!account;
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

const changePassword = async (req: Request, res: Response) => {
  try {
    const {
      employeeAccount: { email },
    } = res.getHeader("user") as any;

    const { oldPassword, newPassword } = req.body.data || {};

    if (!oldPassword || !newPassword) {
      return res.sendStatus(400);
    }

    const account = await prisma.employeeAccount.findUnique({
      where: {
        email,
      },
    });

    const rightPassword = await bcrypt.compare(oldPassword, account?.password!);
    if (!rightPassword) {
      return res.status(400).send({ message: "Password is incorrect" });
    }

    const newPasswordHash = await bcrypt.hash(
      newPassword,
      PASSWORD_SALT_ROUNDS
    );
    await prisma.employeeAccount.update({
      where: {
        email,
      },
      data: {
        password: newPasswordHash,
      },
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

export {
  getAllAccounts,
  createNewAccount,
  deleteAccount,
  updateAccount,
  changePassword,
};
