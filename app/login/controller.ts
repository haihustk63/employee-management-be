import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

import { STATUS_CODE } from "@constants/common";

const prisma = new PrismaClient();

// const loginCandidate = async (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body.data;
//     if (!username || !password) {
//       return res
//         .status(STATUS_CODE.BAD_REQUEST)
//         .send("Missing email or password");
//     }
//     const candidateAccount = await prisma.candidateAccount.findUnique({
//       where: {
//         username,
//       },
//       include: {
//         candidate: {
//           include: {
//             skillTest: {
//               select: {
//                 id: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!candidateAccount) {
//       return res.status(STATUS_CODE.NOT_FOUND).send("Account doen not existed");
//     } else {
//       const isRightPassword = bcrypt.compareSync(
//         password,
//         candidateAccount.password
//       );
//       if (!isRightPassword) {
//         return res
//           .status(STATUS_CODE.UNAUTHORIZED)
//           .send("Wrong username or password");
//       }
//     }

//     const userInfo: any = { ...candidateAccount };
//     delete userInfo.password;
//     const token = createToken(candidateAccount);
//     const serialized = createSerialized(token);
//     res.setHeader("Set-Cookie", serialized);
//     return res
//       .status(STATUS_CODE.SUCCESS)
//       .send({ status: "success", message: "Logged in", userInfo });
//   } catch (err: any) {
//     return res.status(STATUS_CODE.SERVER_ERROR).send(err.message);
//   }
// };

const loginEmployee = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.data;
    if (!email || !password) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .send("Missing email or password");
    }
    const employeeAccount = await prisma.employeeAccount.findUnique({
      where: {
        email,
      },
      include: {
        employee: true,
      },
    });

    if (!employeeAccount) {
      return res.status(STATUS_CODE.NOT_FOUND).send("Account doen not existed");
    } else {
      const isRightPassword = bcrypt.compareSync(
        password,
        employeeAccount.password
      );
      if (!isRightPassword) {
        return res
          .status(STATUS_CODE.UNAUTHORIZED)
          .send("Wrong username or password");
      }
    }

    const userInfo: any = { ...employeeAccount };
    delete userInfo.password;
    const token = createToken(employeeAccount);
    const serialized = createSerialized(token);
    res.setHeader("Set-Cookie", serialized);
    return res
      .status(STATUS_CODE.SUCCESS)
      .send({ status: "success", message: "Logged in", userInfo });
  } catch (err: any) {
    return res.status(STATUS_CODE.SERVER_ERROR).send(err.message);
  }
};

const createToken = (data: any) => {
  return jwt.sign(data, process.env.SECRET_TOKEN as string, {
    expiresIn: 60 * 60 * 24,
  });
};

const createSerialized = (token: string) => {
  return serialize("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    domain: "127.0.0.1",
    path: "/",
    sameSite: "strict",
  });
};

const createDeactiveToken = () => {
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

export { loginEmployee, logout };
