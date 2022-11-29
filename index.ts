import express, { Express } from "express";
import cors from "cors";

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
} from "@app/index";

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use([
  candidateApplyRouter,
  candidateAccountRouter,
  employeeProfileRouter,
  employeeAccountRouter,
  deliveryRouter,
  positionRouter,
  testTopicRouter,
  testQuestionRouter,
]);

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
