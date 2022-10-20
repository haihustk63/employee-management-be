import express, { Express } from "express";
import { appPort } from "./config";

const app: Express = express();

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
