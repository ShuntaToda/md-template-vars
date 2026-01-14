import { z } from "zod";

const VariableValueSchema = z.union([z.string(), z.number(), z.boolean()]).transform(String);

export const VariablesSchema = z.record(z.string(), VariableValueSchema);

export type Variables = Record<string, string>;
