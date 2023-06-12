import dotenv from "dotenv";
import { serverModeType } from "../helper/enum.js";

const serverMode = serverModeType.DEVELOPMENT;

if (serverMode === serverModeType.DEVELOPMENT) {
  dotenv.config({ path: ".envdev" });
} else if (serverMode === serverModeType.PRODUCTION) {
  dotenv.config({ path: ".env" });
}

export const {
  PORT,
  DATABASE_URL,
  SERVER_BASE_URL,
  CLIENT_BASE_URL,
  JWT_SECRET_KEY,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM,
} = process.env;

console.log({ DATABASE_URL });
