import { resolve, relative, join } from "node:path";
import type { CliOptions, ProcessResult } from "../../shared/types.js";
import { SameInputOutputError } from "../../shared/errors.js";
import { loadVariables } from "../../infrastructure/repositories/variables-repository.js";
import { readTemplate, writeTemplate } from "../../infrastructure/repositories/template-repository.js";
import { scanTemplates } from "../../infrastructure/services/file-scanner.js";
import { renderTemplate } from "../../domain/services/template-renderer.js";

export async function processTemplates(
  options: CliOptions
): Promise<ProcessResult> {
  const inputDir = resolve(options.input);
  const outputDir = resolve(options.output);

  if (inputDir === outputDir) {
    throw new SameInputOutputError();
  }

  const variables = loadVariables(options.vars);

  const files = await scanTemplates(inputDir, {
    include: options.include,
    exclude: options.exclude,
  });

  const processedFiles: string[] = [];
  const warnings: string[] = [];

  for (const filePath of files) {
    const template = readTemplate(filePath);
    const result = renderTemplate(template.content, variables);

    const relativePath = relative(inputDir, filePath);
    const outputPath = join(outputDir, relativePath);

    writeTemplate(outputPath, result.content);
    processedFiles.push(relativePath);

    for (const varName of result.undefinedVariables) {
      warnings.push(`Warning: undefined variable "{{${varName}}}" in ${relativePath}`);
    }
  }

  return { processedFiles, warnings };
}
