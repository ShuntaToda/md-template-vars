import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { loadVariables } from "./variables-repository.js";
import { VariablesFileNotFoundError, InvalidVariablesError } from "../../shared/errors.js";

const TEST_DIR = ".test-vars";

describe("loadVariables", () => {
  beforeEach(() => {
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it("should load valid YAML variables", () => {
    const filePath = join(TEST_DIR, "variables.yaml");
    writeFileSync(filePath, "name: World\ngreeting: Hello");

    const result = loadVariables(filePath);

    expect(result).toEqual({ name: "World", greeting: "Hello" });
  });

  it("should throw VariablesFileNotFoundError when file does not exist", () => {
    expect(() => loadVariables("nonexistent.yaml")).toThrow(
      VariablesFileNotFoundError
    );
  });

  it("should throw InvalidVariablesError for invalid YAML structure", () => {
    const filePath = join(TEST_DIR, "invalid.yaml");
    writeFileSync(filePath, "name:\n  nested: value");

    expect(() => loadVariables(filePath)).toThrow(InvalidVariablesError);
  });

  it("should handle empty YAML file", () => {
    const filePath = join(TEST_DIR, "empty.yaml");
    writeFileSync(filePath, "");

    expect(() => loadVariables(filePath)).toThrow(InvalidVariablesError);
  });
});
