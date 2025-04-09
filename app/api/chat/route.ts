import { openai } from '@ai-sdk/openai'
import { anthropic, AnthropicProviderOptions } from '@ai-sdk/anthropic'
import { xai } from '@ai-sdk/xai'
import { fireworks } from '@ai-sdk/fireworks'
import { groq } from '@ai-sdk/groq'
import { LanguageModelV1, streamText, smoothStream } from 'ai'
import { db } from '@/lib/database'
import { schema } from '@/lib/database'
import { eq } from 'drizzle-orm'
import { aiModels } from '@/lib/schema'
import { z } from 'zod'

export const maxDuration = 30

export async function POST(req: Request) {
  const message = await req.json()
  const model = aiModels.parse(message.model)
  const [settings] = await db
    .select()
    .from(schema.chatSettings)
    .where(eq(schema.chatSettings.chatId, message.id))

  const result = streamText({
    model: getModel(model),
    system:
      settings.systemPrompt ||
      'You are a helpful assistant who always speaks in pleasant form',
    messages: message.messages,
    experimental_transform: smoothStream(),
    temperature: settings.temperature,
    topP: settings.topP,
    topK: settings.topK,
    async onFinish(result) {
      await db
        .update(schema.chats)
        .set({
          initialized: true,
          messages: [
            ...message.messages,
            {
              role: 'assistant',
              content: result.text,
              id: crypto.randomUUID(),
              createdAt: new Date(),
            },
          ],
        })
        .where(eq(schema.chats.id, message.id))
    },
  })

  return result.toDataStreamResponse()
}

function getModel(model: z.infer<typeof aiModels>): LanguageModelV1 {
  switch (model) {
    case 'gpt-4o':
      return openai(model)
    case 'gpt-4o-mini':
      return openai(model)
    case 'claude-3-7-sonnet':
      return anthropic('claude-3-7-sonnet-latest') as unknown as LanguageModelV1
    case 'claude-3-5-sonnet':
      return anthropic('claude-3-5-sonnet-latest') as unknown as LanguageModelV1
    case 'grok-2':
      return xai('grok-2-1212') as unknown as LanguageModelV1
    case 'deepseek-3-fireworks':
      return fireworks(
        'accounts/fireworks/models/deepseek-v3'
      ) as unknown as LanguageModelV1
    case 'llma4-groq':
      return groq(
        'meta-llama/llama-4-scout-17b-16e-instruct'
      ) as unknown as LanguageModelV1
    default:
      throw new Error(`Unsupported model: ${model}`)
  }
}
