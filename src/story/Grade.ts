import { z } from "zod"

const GradeLetterSchema = z.literal(["A", "B", "C", "D", "F"]).describe(`
How well the user understands the story.
A: Excellent understanding
C: Satisfactory understanding
F: Poor or no understanding`)
export type GradeLetter = z.infer<typeof GradeLetterSchema>

export const GradeSchema = z.object({
  letter: GradeLetterSchema,
  reason: z.string().describe(`
The reasoning behind the given grade, 
without giving away details that would spoil the story for the user.`)
})

export type Grade = z.infer<typeof GradeSchema>

