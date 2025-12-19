import { Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.utils";
import { sendError } from "../utils/response.utils";
import type { AuthRequest } from "../types";
import { Role } from "@prisma/client";

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, "Access token is required", 401);
    return;
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyAccessToken(token);

  if (!payload) {
    sendError(res, "Invalid or expired access token", 401);
    return;
  }

  req.user = payload;
  next();
};

export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, "Forbidden: Insufficient permissions", 403);
      return;
    }

    next();
  };
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
};
