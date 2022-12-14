import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { STATUS_CODE } from "@constants/common";
import { NOT_NEED_AUTH_PATH, PERMISSION } from "@constants/index";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { originalUrl } = req;
    if (NOT_NEED_AUTH_PATH.includes(originalUrl)) {
      return next();
    }

    const { token } = req.cookies;
    let role = "GUEST";

    if (!token) {
      return res.status(STATUS_CODE.UNAUTHORIZED).send("Unauthorized");
    }

    const data = jwt.verify(token, process.env.SECRET_TOKEN as string) as any;
    if (data.candidateId) {
      role = "CANDIDATE";
    }
    //admin
    //...
    //

    res.setHeader("user", data.candidate || data.employee || null);

    const hasPermission = getPermission(role, req);
    if (!hasPermission) {
      return res.status(STATUS_CODE.FORBIDDEN).send("Forbidden");
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(STATUS_CODE.SERVER_ERROR);
  }
};

const getPermission = (role: string, req: Request) => {
  const { originalUrl, method } = req;

  return PERMISSION[role][originalUrl]?.includes(method);
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
