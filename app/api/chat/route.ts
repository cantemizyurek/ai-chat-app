import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant who always speaks in pleasant form',
    messages,
  })

  return result
}
