import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ROLES, STATUS_CODE } from "@constants/common";
import { NOT_NEED_AUTH_PATH, PERMISSION } from "@constants/index";

const { CANDIDATE, ADMIN, SUPER_ADMIN } = ROLES;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
    return res.status(STATUS_CODE.UNAUTHORIZED).send("Unauthorized");
  }

  const data = jwt.verify(token, process.env.SECRET_TOKEN as string) as any;

  if (data.employee) {
    role = data.employee.role;
  }

  res.setHeader("user", data.employee);

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
