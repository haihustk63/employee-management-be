import nodeMailer from "nodemailer";
import {
  nodeMailerHost,
  nodeMailerPass,
  nodeMailerPort,
  nodeMailerUser,
} from ".";

export interface IEmail {
  to?: string;
  subject?: string;
  text?: string;
  [key: string]: string | undefined;
}

const transport = nodeMailer.createTransport({
  host: nodeMailerHost,
  port: nodeMailerPort,
  auth: {
    user: nodeMailerUser,
    pass: nodeMailerPass,
  },
});

export const sendEmail = async ({ to, subject, text, html }: IEmail) => {
  if (!to || !subject || (!text && !html)) {
    return;
  }
  try {
    const res = await transport.sendMail({
      from: "myhrm_admin@gmail.com",
      to,
      subject,
      text,
      html,
    });
    return res;
  } catch (e) {
    console.log(e);
  }
};
