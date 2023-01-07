import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

import {
  accountRouter,
  candidateApplyRouter,
  checkInOutRouter,
  constantRouter,
  deliveryRouter,
  educationRouter,
  employeeProfileRouter,
  jobRouter,
  loginRouter,
  positionRouter,
  requestRouter,
  testQuestionRouter,
  testsRouter,
  testTopicRouter,
} from "@app/index";
import { errorHandler } from "@middleware/error-handler";
import { appPort } from "./config";
import { ROUTES } from "./constants";

const app: Express = express();

const corsOption = {
  optionsSuccessStatus: 200,
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
  ],
  credentials: true,
};

// app.use(configResponseHeader);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.use(
  candidateApplyRouter,
  accountRouter,
  employeeProfileRouter,
  deliveryRouter,
  positionRouter,
  testTopicRouter,
  testQuestionRouter,
  constantRouter,
  loginRouter,
  testsRouter,
  checkInOutRouter,
  jobRouter,
  requestRouter,
  educationRouter,
  errorHandler
);

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
