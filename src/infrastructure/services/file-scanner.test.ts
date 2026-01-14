import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { scanTemplates } from "./file-scanner.js";

const TEST_DIR = ".test-scan";

describe("scanTemplates", () => {
  beforeEach(() => {
    mkdirSync(join(TEST_DIR, "nested"), { recursive: true });
    writeFileSync(join(TEST_DIR, "file1.md"), "content1");
    writeFileSync(join(TEST_DIR, "file2.md"), "content2");
    writeFileSync(join(TEST_DIR, "draft-file.md"), "draft");
    writeFileSync(join(TEST_DIR, "nested", "file3.md"), "content3");
    writeFileSync(join(TEST_DIR, "readme.txt"), "text");
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("should find all markdown files by default", async () => {
    const files = await scanTemplates(TEST_DIR);

    expect(files).toHaveLength(4);
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/file1.md`
    );
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/nested/file3.md`
    );
  });

  it("should filter by include pattern", async () => {
    const files = await scanTemplates(TEST_DIR, { include: "file*.md" });

    expect(files).toHaveLength(2);
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/file1.md`
    );
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/file2.md`
    );
  });

  it("should exclude by pattern", async () => {
    const files = await scanTemplates(TEST_DIR, { exclude: "draft-*.md" });

    expect(files).toHaveLength(3);
    expect(files.map((f) => f.replace(/\\/g, "/"))).not.toContain(
      `${TEST_DIR}/draft-file.md`
    );
  });

  it("should combine include and exclude", async () => {
    const files = await scanTemplates(TEST_DIR, {
      include: "*.md",
      exclude: "draft-*.md",
    });

    expect(files).toHaveLength(2);
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/file1.md`
    );
    expect(files.map((f) => f.replace(/\\/g, "/"))).toContain(
      `${TEST_DIR}/file2.md`
    );
  });
});
