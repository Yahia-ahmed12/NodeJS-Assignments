import nodemailer from "nodemailer";
import { envConfig } from "../../../config/config.js";
import { BadException } from "../../exceptions/global-error.exception.js";

export const UserEmailKey = ({ email, subject }) => {
  return `User::${email}::${subject}::OTP`;
};
export const UserEmailTrailsKey = ({ email, subject }) => {
  return `${UserEmailKey({ email, subject })}::Trails`;
};
export const UserLoginTrailsKey = ({ email }) => {
  return `User::${email}::Login::Trails`;
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: envConfig.APP_EMAIL,
    pass: envConfig.APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  cc,
  bcc, // list of recipients
  subject, // subject line
  text, // plain text body
  html, // HTML body
  attachments = [],
}) => {
  try {
    if (!to?.length && !bcc?.length && !cc?.length) {
      throw BadException({ message: "Missing email recipients" });
    }
    if (!text?.length && !html?.length && !attachments?.length) {
      throw BadException({ message: "Missing email content" });
    }
    const info = await transporter.sendMail({
      from: `"${envConfig.APPLICATION_NAME}" <${envConfig.APP_EMAIL}>`, // sender address
      to,
      cc,
      bcc, // list of recipients
      subject, // subject line
      text, // plain text body
      html, // HTML body
      attachments,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};
