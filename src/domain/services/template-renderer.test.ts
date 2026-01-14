import { describe, it, expect } from "vitest";
import { renderTemplate } from "./template-renderer.js";

describe("renderTemplate", () => {
  it("should replace variables with their values", () => {
    const content = "Hello {{name}}!";
    const variables = { name: "World" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("Hello World!");
    expect(result.undefinedVariables).toEqual([]);
  });

  it("should replace multiple variables", () => {
    const content = "{{greeting}} {{name}}! Welcome to {{place}}.";
    const variables = { greeting: "Hello", name: "Alice", place: "Tokyo" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("Hello Alice! Welcome to Tokyo.");
    expect(result.undefinedVariables).toEqual([]);
  });

  it("should keep undefined variables and report them", () => {
    const content = "Hello {{name}}! Your ID is {{id}}.";
    const variables = { name: "Bob" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("Hello Bob! Your ID is {{id}}.");
    expect(result.undefinedVariables).toEqual(["id"]);
  });

  it("should report multiple undefined variables", () => {
    const content = "{{a}} {{b}} {{c}}";
    const variables = { b: "B" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("{{a}} B {{c}}");
    expect(result.undefinedVariables).toEqual(["a", "c"]);
  });

  it("should handle content with no variables", () => {
    const content = "Hello World!";
    const variables = { name: "Test" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("Hello World!");
    expect(result.undefinedVariables).toEqual([]);
  });

  it("should handle empty content", () => {
    const content = "";
    const variables = { name: "Test" };

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("");
    expect(result.undefinedVariables).toEqual([]);
  });

  it("should handle empty variables", () => {
    const content = "Hello {{name}}!";
    const variables = {};

    const result = renderTemplate(content, variables);

    expect(result.content).toBe("Hello {{name}}!");
    expect(result.undefinedVariables).toEqual(["name"]);
  });
});
