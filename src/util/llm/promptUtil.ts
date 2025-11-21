import z from "zod";

export function serializeSchema(schema: z.ZodType, name: string): string {
  const jsonSchema = z.toJSONSchema(schema);
  return serializeForLlm(jsonSchema);
}

export function infoSection(title: string, info: string): string {
  return `
${title}:
---

${info}

---
`
}

// Ensures data passed to the LLM is serialized consistently
export function serializeForLlm(obj: object): string {
  return JSON.stringify(obj, null, 2)
}