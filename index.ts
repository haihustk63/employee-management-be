import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { appPort } from "./config";
import {
  candidateApplyRouter,
  candidateAccountRouter,
  employeeProfileRouter,
  employeeAccountRouter,
  deliveryRouter,
  positionRouter,
  testTopicRouter,
  testQuestionRouter,
  constantRouter,
  loginRouter,
  testsRouter,
} from "@app/index";
import { authMiddleware } from "./middleware";

const app: Express = express();

const corsOption = {
  optionsSuccessStatus: 200,
  origin: "http://127.0.0.1:5173",
  credentials: true,
};

// app.use(configResponseHeader);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
// app.use(authMiddleware);
app.use((req, res, next) => {
  console.log(req.path);
  next();
});

app.use([
  candidateApplyRouter,
  candidateAccountRouter,
  employeeProfileRouter,
  employeeAccountRouter,
  deliveryRouter,
  positionRouter,
  testTopicRouter,
  testQuestionRouter,
  constantRouter,
  loginRouter,
  testsRouter,
]);

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
