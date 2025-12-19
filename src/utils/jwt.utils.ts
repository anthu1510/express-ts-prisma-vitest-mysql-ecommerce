import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config";
import type { TokenPayload } from "../types";

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry as SignOptions["expiresIn"],
  });
};

export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch {
    return null;
  }
};
