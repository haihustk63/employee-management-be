import { ROLES, STATUS_CODE } from "@constants/common";
import { NOT_NEED_AUTH_PATH, PERMISSION } from "@constants/index";
import { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";

const { CANDIDATE, ADMIN, SUPER_ADMIN } = ROLES;

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const { route: currentRoute, method } = req;
    if (
      NOT_NEED_AUTH_PATH.find(
        (path) => path.route === currentRoute.path && path.method === method
      )
    ) {
      return next();
    }

    const { token } = req.cookies;
    let role = CANDIDATE.value;

    if (!token) {
      return res.sendStatus(STATUS_CODE.UNAUTHORIZED);
    }

    const data = jwt.verify(token, process.env.SECRET_TOKEN as string) as any;
    if (data.employee) {
      role = data.employee.role;
    }

    // const data = {
    //   employee: {
    //     id: 1,
    //     firstName: "Dat",
    //     middleName: "",
    //     lastName: "Thai",
    //     phoneNumber: "0963825779",
    //     dateOfBirth: "2023-01-17T11:42:21.759Z",
    //     positionId: 2,
    //     joinDate: "2023-01-11T14:52:05.373Z",
    //     role: 4,
    //     paidLeaveCount: 0,
    //     workingStatus: 1,
    //     avatar:
    //       "https://res.cloudinary.com/druoyiv0j/image/upload/v1677694331/avatars/image%2520%2869%29.jpg1677694329544.jpg",
    //     createdAt: "2023-01-11T14:52:05.373Z",
    //     updatedAt: "2023-03-01T18:12:11.412Z",
    //     employeeAccount: { email: "super_admin@example.com" },
    //     position: {
    //       id: 2,
    //       name: "Nodejs dev",
    //       description: "nodejs dev",
    //       createdAt: "2023-01-11T15:34:08.161Z",
    //       updatedAt: "2023-01-11T15:34:08.161Z",
    //     },
    //     deliveryEmployee: { delivery: [Object] },
    //   },
    //   candidate: null,
    //   accountFirebase: {
    //     uid: "kcF8wqcZR2WNLMh975iRuPobmUN2",
    //     googleEmail: "haiphambkk63@gmail.com",
    //   },
    //   employeeId: 1,
    //   email: "super_admin@example.com",
    //   candidateId: null,
    //   iat: 1677915622,
    //   exp: 1678002022,
    // } as any;
    // if (data.employee) {
    //   role = data.employee.role;
    // }

    if (role === CANDIDATE.value) {
      res.setHeader("user", data);
    } else {
      res.setHeader("user", data.employee);
    }
    res.setHeader("email", data.email);
    res.setHeader("role", role);

    if (role === ADMIN.value) {
      // check role admin: prevent set admin role
      return next();
    }

    if (role === SUPER_ADMIN.value) {
      return next();
    }

    const roleLabel = getRoleLabel(role);
    const hasPermission = getPermission(roleLabel, currentRoute.path, method);
    if (!hasPermission) {
      return res.status(STATUS_CODE.FORBIDDEN).send("Forbidden");
    }

    next();
  } catch (error) {
    next(error);
  }
};

const getRoleLabel = (role: number) => {
  return Object.values(ROLES).find((item) => item.value === role)?.label;
};

const getPermission = (role: string = "", path: string, method: string) => {
  return !!PERMISSION[role][path]?.includes(method);
};

// const configResponseHeader = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   res.header("Access-Control-Allow-Origin", "http://127.0.0.1");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "PUT,PATCH,POST,GET,DELETE,OPTIONS"
//   );

//   next();
// };

export { authMiddleware };
