import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../src/utils/jwt.utils";

// Mock the config
vi.mock("../../src/config", () => ({
  config: {
    jwt: {
      accessSecret: "test-access-secret",
      refreshSecret: "test-refresh-secret",
      accessExpiry: "15m",
      refreshExpiry: "7d",
    },
  },
}));

describe("jwt.utils", () => {
  const mockPayload = {
    userId: "user-123",
    email: "test@example.com",
    role: "USER" as const,
  };

  describe("generateAccessToken", () => {
    it("should generate a valid access token", () => {
      const token = generateAccessToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe("generateRefreshToken", () => {
    it("should generate a valid refresh token", () => {
      const token = generateRefreshToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should generate different token than access token", () => {
      const accessToken = generateAccessToken(mockPayload);
      const refreshToken = generateRefreshToken(mockPayload);

      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe("generateTokens", () => {
    it("should return both access and refresh tokens", () => {
      const tokens = generateTokens(mockPayload);

      expect(tokens).toHaveProperty("accessToken");
      expect(tokens).toHaveProperty("refreshToken");
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });
  });

  describe("verifyAccessToken", () => {
    it("should verify valid access token and return payload", () => {
      const token = generateAccessToken(mockPayload);
      const decoded = verifyAccessToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
    });

    it("should return null for invalid token", () => {
      const decoded = verifyAccessToken("invalid-token");

      expect(decoded).toBeNull();
    });

    it("should return null for refresh token verified as access token", () => {
      const refreshToken = generateRefreshToken(mockPayload);
      const decoded = verifyAccessToken(refreshToken);

      expect(decoded).toBeNull();
    });
  });

  describe("verifyRefreshToken", () => {
    it("should verify valid refresh token and return payload", () => {
      const token = generateRefreshToken(mockPayload);
      const decoded = verifyRefreshToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe(mockPayload.userId);
      expect(decoded?.email).toBe(mockPayload.email);
      expect(decoded?.role).toBe(mockPayload.role);
    });

    it("should return null for invalid token", () => {
      const decoded = verifyRefreshToken("invalid-token");

      expect(decoded).toBeNull();
    });

    it("should return null for access token verified as refresh token", () => {
      const accessToken = generateAccessToken(mockPayload);
      const decoded = verifyRefreshToken(accessToken);

      expect(decoded).toBeNull();
    });
  });
});
