import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../utils/password.utils";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.utils";
import { AppError } from "../middleware/error.middleware";
import type { RegisterInput, LoginInput } from "../validators/auth.validator";
import type { TokenPayload } from "../types";

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return { user, ...tokens };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(payload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    const { password: _, refreshToken: __, ...userWithoutSensitive } = user;

    return { user: userWithoutSensitive, ...tokens };
  }

  async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);

    if (!payload) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    const newPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = generateTokens(newPayload);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async logout(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isValidPassword = await comparePassword(currentPassword, user.password);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, refreshToken: null },
    });
  }
}

export const authService = new AuthService();

