import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { readTemplate, writeTemplate } from "./template-repository.js";

const TEST_DIR = ".test-templates";

describe("readTemplate", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("should read template file", () => {
    const filePath = join(TEST_DIR, "test.md");
    writeFileSync(filePath, "Hello {{name}}!");

    const template = readTemplate(filePath);

    expect(template.path).toBe(filePath);
    expect(template.content).toBe("Hello {{name}}!");
  });
});

describe("writeTemplate", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("should write content to file", () => {
    const filePath = join(TEST_DIR, "output.md");

    writeTemplate(filePath, "Hello World!");

    expect(readFileSync(filePath, "utf-8")).toBe("Hello World!");
  });

  it("should create nested directories", () => {
    const filePath = join(TEST_DIR, "nested", "deep", "output.md");

    writeTemplate(filePath, "Content");

    expect(existsSync(filePath)).toBe(true);
    expect(readFileSync(filePath, "utf-8")).toBe("Content");
  });
});
