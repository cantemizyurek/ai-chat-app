'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { userActionClient } from './action'
import { z } from 'zod'

export const enhancePrompt = userActionClient
  .schema(z.string())
  .action(async ({ parsedInput: prompt }) => {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system:
        'You are an advanced prompt engineer. You will be given a prompt and you will need to enhance it to make it more specific and to the point. YOUR ONLY OUTPUT SHOULD BE THE ENHANCED PROMPT. DO NOT INCLUDE ANY OTHER TEXT AND DO NOT INCLUDE ANY MARKDOWN SYNTAX.',
      prompt,
    })

    return result.text
  })
