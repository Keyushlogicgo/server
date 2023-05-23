import dotenv from "dotenv";
dotenv.config();

export const {
  PORT,
  DATABASE_URL,
  SERVER_BASE_URL,
  JWT_SECRET_KEY,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env;
