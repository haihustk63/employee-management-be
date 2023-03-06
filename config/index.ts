import dotenv from "dotenv";

dotenv.config();

export const appPort = process.env.APP_PORT || 7200;
export const webUrl = process.env.WEB_URL || "";
//
export const nodeMailerHost = process.env.NODE_MAILER_HOST || "";
export const nodeMailerPort = Number(process.env.NODE_MAILER_PORT) || 0;
export const nodeMailerUser = process.env.NODE_MAILER_USER || "";
export const nodeMailerPass = process.env.NODE_MAILER_PASS || "";
//
export const cloudinaryName = process.env.CLOUDINARY_NAME || "";
export const cloudinaryKey = process.env.CLOUDINARY_KEY || "";
export const cloudinarySecret = process.env.CLOUDINARY_SECRET || "";

//
export const novuApiKey = process.env.NOVU_API_KEY || "";

//
export const webDomain = process.env.WEB_DOMAIN || "";
export const webReactHost = process.env.WEB_REACT_HOST || "";
export const webNextHost = process.env.WEB_NEXT_HOST || "";

//
export const environment = process.env.ENVIRONMENT || "";
