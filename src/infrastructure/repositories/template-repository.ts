import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Template } from "../../domain/entities/template.js";

export function readTemplate(filePath: string): Template {
  const content = readFileSync(filePath, "utf-8");
  return new Template(filePath, content);
}

export function writeTemplate(filePath: string, content: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, "utf-8");
}
