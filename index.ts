import express, { Express } from "express";

import { appPort } from "./config";
import {
  candidateApplyRouter,
  candidateAccountRouter,
  employeeProfileRouter,
  deliveryRouter,
  positionRouter,
} from "@app/index";

const app: Express = express();

app.use(express.json());

app.use([
  candidateApplyRouter,
  candidateAccountRouter,
  employeeProfileRouter,
  deliveryRouter,
  positionRouter,
]);

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
