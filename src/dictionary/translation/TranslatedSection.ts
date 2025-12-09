import z from "zod";

/**
 * One minimal meaningful unit (word, character group, or morpheme)
 * from the source text, paired with its literal meaning.
 */
export const SegmentLiteralSchema = z.object({
  segment: z
    .string()
    .describe("Exact word or minimal meaningful segment from the original text."),
  gloss: z
    .string()
    .describe("Literal meaning of the segment. No explanations or commentary."),
});
export type SegmentLiteral = z.infer<typeof SegmentLiteralSchema>;

export const TranslatedSectionSchema = z.object({
  naturalTranslation: z.string()
    .describe(
      "A natural, fluent translation into the user's language. \
No explanations or commentary."
    ),

  segments: z.array(SegmentLiteralSchema)
    .describe(
      "The original text split into segments with individual, translatable meaning, \
preserving order. Each entry includes the exact segment and its literal gloss."
    ),

  // notes: z.string().optional().describe(
  //   "Only add a note if there is critical context that the user must know to understand the section."
  // )
})
export type TranslatedSection = z.infer<typeof TranslatedSectionSchema>;