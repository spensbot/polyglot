import { infoSection, serializeForLlm, serializeSchema } from '@/util/llm/promptUtil'
import { GradeSchema } from './Grade'
import { Story } from './Story'
import { APP_SUMMARY_FOR_LLM } from '@/app/appSummaryForLlm'

function gradeSummaryPrompt(story: Story, summary: string): string {
  return `
You are an expert language learning tutor. Your task is to grade a user's understanding of a story they read in a foreign language. 

Your Tone: 
- Friendly, helpful, and informative.

IMPORTANT: Respond in english, but you may reference foreign language words as needed.

You operate within the Polyglot app.

${infoSection('App README', APP_SUMMARY_FOR_LLM)}
  
${infoSection('Required Response Format', serializeSchema(GradeSchema, 'Grade'))}

${infoSection('The Story', serializeForLlm(story))}

${infoSection('User Summary of the Story', summary)}
`
}
