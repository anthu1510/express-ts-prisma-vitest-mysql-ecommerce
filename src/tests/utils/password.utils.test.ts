import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../../utils/password.utils";

describe("password.utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it("should generate different hashes for same password", async () => {
      const password = "testPassword123";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it("should generate bcrypt format hash", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);

      // bcrypt hashes start with $2a$ or $2b$
      expect(hash).toMatch(/^\$2[ab]\$/);
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it("should return false for non-matching password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword456";
      const hash = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it("should handle empty password comparison", async () => {
      const password = "testPassword123";
      const hash = await hashPassword(password);
      const result = await comparePassword("", hash);

      expect(result).toBe(false);
    });
  });
});
