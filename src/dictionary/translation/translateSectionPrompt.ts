import { LanguageSettings } from '@/app/LanguageSettings'
import { infoSection } from '@/util/llm/promptUtil'

export function translateSectionPrompt(section: string, language: LanguageSettings): string {
  return `
You are an expert language learning tutor. Your task is to translate a section of a story from ${language.learning} to ${language.native}.

Your Tone: 
- Friendly, helpful, and informative.

Important Requirements:
- The literalTranslation must break down the section into an array of the smallest words possible

${infoSection('The Section To Translate', section)}
`
}

