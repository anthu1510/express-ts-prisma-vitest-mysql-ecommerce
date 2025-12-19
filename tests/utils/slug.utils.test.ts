import { describe, it, expect } from "vitest";
import { generateSlug, generateUniqueSlug } from "../../src/utils/slug.utils";

describe("slug.utils", () => {
  describe("generateSlug", () => {
    it("should convert text to lowercase", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
    });

    it("should replace spaces with hyphens", () => {
      expect(generateSlug("hello world test")).toBe("hello-world-test");
    });

    it("should remove special characters", () => {
      expect(generateSlug("Hello! @World#")).toBe("hello-world");
    });

    it("should trim whitespace", () => {
      expect(generateSlug("  hello world  ")).toBe("hello-world");
    });

    it("should handle multiple consecutive spaces", () => {
      expect(generateSlug("hello    world")).toBe("hello-world");
    });

    it("should handle underscores", () => {
      expect(generateSlug("hello_world_test")).toBe("hello-world-test");
    });

    it("should remove leading and trailing hyphens", () => {
      expect(generateSlug("-hello-world-")).toBe("hello-world");
    });

    it("should handle empty string", () => {
      expect(generateSlug("")).toBe("");
    });

    it("should handle string with only special characters", () => {
      expect(generateSlug("!@#$%^&*()")).toBe("");
    });

    it("should handle mixed case with numbers", () => {
      expect(generateSlug("Product 123 Test")).toBe("product-123-test");
    });
  });

  describe("generateUniqueSlug", () => {
    it("should return original slug if not in existing slugs", () => {
      const existingSlugs = ["other-slug", "another-slug"];
      expect(generateUniqueSlug("Hello World", existingSlugs)).toBe(
        "hello-world"
      );
    });

    it("should append number if slug exists", () => {
      const existingSlugs = ["hello-world"];
      expect(generateUniqueSlug("Hello World", existingSlugs)).toBe(
        "hello-world-1"
      );
    });

    it("should increment number until unique", () => {
      const existingSlugs = ["hello-world", "hello-world-1", "hello-world-2"];
      expect(generateUniqueSlug("Hello World", existingSlugs)).toBe(
        "hello-world-3"
      );
    });

    it("should handle empty existing slugs array", () => {
      expect(generateUniqueSlug("Hello World", [])).toBe("hello-world");
    });
  });
});
