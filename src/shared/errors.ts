export class VariablesFileNotFoundError extends Error {
  constructor(filePath: string) {
    super(`Variables file not found: ${filePath}`);
    this.name = "VariablesFileNotFoundError";
  }
}

export class SameInputOutputError extends Error {
  constructor() {
    super("Input and output directories cannot be the same");
    this.name = "SameInputOutputError";
  }
}

export class InvalidVariablesError extends Error {
  constructor(message: string) {
    super(`Invalid variables file: ${message}`);
    this.name = "InvalidVariablesError";
  }
}
