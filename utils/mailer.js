// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // mot de passe d'application, pas le mdp Gmail normal
  },
});

export default async function sendVerificationEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"${process.env.GMAIL_NAME || "E-commerce"}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
