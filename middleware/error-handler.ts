import { NextFunction, Request, Response, ErrorRequestHandler } from "express";

export class CustomError extends Error {
  code = 500;
  message = "";
  constructor(code: number, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);

  return res.status(error.code || 500).send(error.message);
};
