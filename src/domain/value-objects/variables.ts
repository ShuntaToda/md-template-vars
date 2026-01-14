import { z } from "zod";

const PrimitiveValueSchema = z.union([z.string(), z.number(), z.boolean()]);

type NestedValue = z.infer<typeof PrimitiveValueSchema> | { [key: string]: NestedValue };

const NestedValueSchema: z.ZodType<NestedValue> = z.lazy(() =>
  z.union([PrimitiveValueSchema, z.record(z.string(), NestedValueSchema)])
);

export const VariablesSchema = z.record(z.string(), NestedValueSchema);

export type Variables = Record<string, string>;

export function flattenVariables(obj: Record<string, NestedValue>, prefix = ""): Variables {
  const result: Variables = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      Object.assign(result, flattenVariables(value as Record<string, NestedValue>, fullKey));
    } else {
      result[fullKey] = String(value);
    }
  }

  return result;
}
