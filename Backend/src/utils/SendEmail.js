import nodemailer from "nodemailer";
import logger from "./logger.js";
import apiErrors from './apiErrors.js';

export const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER, // Gmail address
                pass: process.env.SMTP_PASS, // App password
            },
        });

        const mailOptions = {
            from: `"${process.env.APP_NAME || "My App"}" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`📧 Email sent to ${options.email} | MessageId: ${info.messageId}`);
        return info;

    } catch (error) {
        logger.error(`❌ Email send failed: ${error.message}`);
        throw apiErrors(500, "Failed to send email", { details: error.message });
    }
};