import dotenv from "dotenv";

dotenv.config();

export const appPort = process.env.APP_PORT || 7200;
export const nodeMailerHost = process.env.NODE_MAILER_HOST || "";
export const nodeMailerPort = Number(process.env.NODE_MAILER_PORT) || 0;
export const nodeMailerUser = process.env.NODE_MAILER_USER || "";
export const nodeMailerPass = process.env.NODE_MAILER_PASS || "";
