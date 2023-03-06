import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";

import {
  accountRouter,
  candidateApplyRouter,
  checkInOutRouter,
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
  statisticsRouter,
  firebaseAccountRouter,
  notificationTopicRouter,
} from "@app/index";
import { errorHandler } from "@middleware/error-handler";
import { appPort, webHost } from "@config/index";

const app: Express = express();

const corsOption = {
  optionsSuccessStatus: 200,
  origin: webHost,
  credentials: true,
};

// app.use(configResponseHeader);
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res, next) => {
  return res.send("Welcome to MyHRM");
});

app.use(
  candidateApplyRouter,
  accountRouter,
  employeeProfileRouter,
  deliveryRouter,
  positionRouter,
  testTopicRouter,
  testQuestionRouter,
  loginRouter,
  testsRouter,
  checkInOutRouter,
  jobRouter,
  requestRouter,
  educationRouter,
  statisticsRouter,
  firebaseAccountRouter,
  notificationTopicRouter,
  errorHandler
);

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});

export default app;
