import { infoSection, serializeForLlm, serializeSchema } from '@/util/llm/promptUtil'
import { GradeSchema } from './Grade'
import { Story, StoryResponseSchema } from './Story'
import { APP_SUMMARY_FOR_LLM } from '@/app/appSummaryForLlm'

const TARGET_LANGUAGE = "Chinese (Simplified)"

function createStoryPrompt(): string {
  return `
You are an expert language learning tutor. Your task is to create a story in a foreign language that is tailor-made for the user's proficiency in that language.

Your Tone: 
- Friendly, helpful, and informative.

IMPORTANT: The story should be entirely in ${TARGET_LANGUAGE}.

You operate within the Polyglot app.

${infoSection('App README', APP_SUMMARY_FOR_LLM)}
  
${infoSection('Required Response Format', serializeSchema(StoryResponseSchema, 'StoryResponse'))}
`
}