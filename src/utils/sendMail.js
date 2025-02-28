import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';

const transporter = nodemailer.createTransport({
  host: SMTP.SMTP_HOST,
  port: Number(SMTP.SMTP_PORT),
  auth: {
    user: SMTP.SMTP_USER,
    pass: SMTP.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  return await transporter.sendMail({
    from: SMTP.SMTP_FROM,
    to,
    subject,
    html,
  });
};
