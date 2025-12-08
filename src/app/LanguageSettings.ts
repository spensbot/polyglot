import z from "zod";

// BCP 47 language codes for supported languages
export const LanguageCodeSchema = z.literal(["en", "zh-Hans-CN", "zh-Hant-TW"]);
export type LanguageCode = z.infer<typeof LanguageCodeSchema>

export const LanguageNames: Record<LanguageCode, string> = {
  "zh-Hans-CN": "Simplified Chinese",
  "zh-Hant-TW": "Traditional Chinese",
  "en": "English",
}

export const LanguageSettingsSchema = z.object({
  learning: LanguageCodeSchema.catch('zh-Hans-CN'),
  native: LanguageCodeSchema.catch('en'),
  alternate: z.boolean().optional(), // e.g. for traditional vs simplified Chinese
})