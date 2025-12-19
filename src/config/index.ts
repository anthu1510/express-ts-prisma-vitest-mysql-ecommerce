import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET || "access-secret",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || "refresh-secret",
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
} as const;
