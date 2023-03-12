import { generateNewAccountEmail } from "@config/mail-template/new-account";
import { sendEmail } from "@config/mailtrap";
import { PASSWORD_SALT_ROUNDS } from "@constants/index";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request, RequestHandler, Response } from "express";

const prisma = new PrismaClient();

const getAllAccounts: RequestHandler = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
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
          assessment: true,
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
          subject: "A new account has been created for you",
          html: generateNewAccountEmail({
            name: candidate.name,
            email,
            password,
          }),
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
    next(error);
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

const updateAccount: RequestHandler = async (req, res, next) => {
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
    next(error);
  }
};

const deleteAccount: RequestHandler = async (req, res, next) => {
  try {
    const { email = "" } = req.body.data;
    if (!email) return res.sendStatus(400);
    await prisma.employeeAccount.delete({ where: { email } });
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const user = res.getHeader("user") as any;
    const email = user.email ?? user.employeeAccount?.email;

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
    next(error);
  }
};

export {
  getAllAccounts,
  createNewAccount,
  deleteAccount,
  updateAccount,
  changePassword,
};
