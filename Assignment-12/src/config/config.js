import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV ?? "development";
loadEnv({ path: resolve(`.env.${NODE_ENV}`) });

const getRequiredEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing Critical Environment Variable: [${key}] in .env.${NODE_ENV}`,
    );
  }
  return value;
};

export const envConfig = {
  // App Setup
  NODE_ENV,
  PORT: parseInt(process.env.PORT ?? "9000", 10),

  // Database
  DB_URI: getRequiredEnv("DB_URI"),
  REDIS_URI: getRequiredEnv("REDIS_URI"),

  APP_EMAIL: getRequiredEnv("APP_EMAIL"),
  APP_PASSWORD: getRequiredEnv("APP_PASSWORD"),
  APPLICATION_NAME: getRequiredEnv("APPLICATION_NAME"),

  // Google OAuth
  WEB_CLIENT_IDS: getRequiredEnv("WEB_CLIENT_IDS")
    .split(",")
    .map((id) => id.trim()),

  // Cryptography & Security
  SALT: parseInt(process.env.SALT ?? "12", 10),
  IV_LENGTH: parseInt(process.env.IV_LENGTH ?? "16", 10),
  ENC_KEY: getRequiredEnv("ENC_KEY"),

  // JWT Signatures (Separated for Admin and User)
  jwt: {
    access: {
      adminSignature: getRequiredEnv("ACCESS_ADMIN_TOKEN_SIGNATURE"),
      userSignature: getRequiredEnv("ACCESS_USER_TOKEN_SIGNATURE"),
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? "30m",
    },
    refresh: {
      adminSignature: getRequiredEnv("REFRESH_ADMIN_TOKEN_SIGNATURE"),
      userSignature: getRequiredEnv("REFRESH_USER_TOKEN_SIGNATURE"),
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? "365d",
    },
  },

  // Social Media Links for Email Templates (Optional / Fallback to "#")
  facebookLink: process.env.FACEBOOK_LINK ?? "#",
  twitterLink: process.env.TWITTER_LINK ?? "#",
  instagram: process.env.INSTAGRAM_LINK ?? "#",
};

export const {
  PORT,
  DB_URI,
  SALT,
  IV_LENGTH,
  ENC_KEY,
  WEB_CLIENT_IDS,
  REDIS_URI,
  APP_EMAIL,
  APP_PASSWORD,
  APPLICATION_NAME,
  facebookLink,
  twitterLink,
  instagram,
} = envConfig;
