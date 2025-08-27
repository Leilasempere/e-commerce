import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
  
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
  
export default async function sendVerificationEmail ({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.GMAIL_NAME} <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Email envoyé ", info.messageId);
    } catch (error) {
        console.log("Erreur de l'envoie", error);
        throw new Error("Erreur lors de l'envoie de l'email");
    }
}
  