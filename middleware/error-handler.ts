import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log("error", error);

  return res.status(error.code || 500).send({ message: error.message });
};
