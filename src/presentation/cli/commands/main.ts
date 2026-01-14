import { defineCommand } from "citty";
import { processTemplates } from "../../../application/use-cases/process-templates.js";
import {
  VariablesFileNotFoundError,
  SameInputOutputError,
  InvalidVariablesError,
} from "../../../shared/errors.js";

export const mainCommand = defineCommand({
  meta: {
    name: "md-template-vars",
    description: "Replace {{variables}} in markdown templates with YAML values",
  },
  args: {
    input: {
      type: "positional",
      description: "Input directory containing templates",
      required: true,
    },
    output: {
      type: "positional",
      description: "Output directory for processed files",
      required: true,
    },
    vars: {
      type: "string",
      description: "Path to variables YAML file",
      default: "variables.yaml",
    },
    include: {
      type: "string",
      description: "Glob pattern to include files",
    },
    exclude: {
      type: "string",
      description: "Glob pattern to exclude files",
    },
  },
  async run({ args }) {
    try {
      const result = await processTemplates({
        input: args.input,
        output: args.output,
        vars: args.vars,
        include: args.include,
        exclude: args.exclude,
      });

      for (const warning of result.warnings) {
        console.warn(warning);
      }

      console.log(`Processed ${result.processedFiles.length} file(s)`);
      for (const file of result.processedFiles) {
        console.log(`  - ${file}`);
      }
    } catch (error) {
      if (
        error instanceof VariablesFileNotFoundError ||
        error instanceof SameInputOutputError ||
        error instanceof InvalidVariablesError
      ) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  },
});
