import express, { Express } from "express";
import dotenv from "dotenv";

const app: Express = express();

dotenv.config();

const appPort = process.env.APP_PORT || 7200;

app.listen(appPort, () => {
  console.log(`Congratulation! App is listening on port ${appPort}`);
});
