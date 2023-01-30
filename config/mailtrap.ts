import nodeMailer from "nodemailer";
import {
  nodeMailerHost,
  nodeMailerPass,
  nodeMailerPort,
  nodeMailerUser,
} from ".";

export interface IEmail {
  to: string;
  subject: string;
  text: string;
  [key: string]: string;
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
  try {
    const res = await transport.sendMail({
      from: "admin@gmail.com",
      to,
      subject,
      text,
      html,
    });
    console.log(res);
    return res;
  } catch (e) {
    console.log(e);
  }
};
