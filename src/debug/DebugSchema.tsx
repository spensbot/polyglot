import z from "zod"

export const DebugSchema = z.object({
  debugMode: z.boolean().default(false),
})
