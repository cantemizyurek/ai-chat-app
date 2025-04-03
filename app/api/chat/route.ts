import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { db } from '@/lib/database'
import { schema } from '@/lib/database'
import { eq } from 'drizzle-orm'
export const maxDuration = 30

export async function POST(req: Request) {
  const message = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant who always speaks in pleasant form',
    messages: message.messages,
    async onFinish(result) {
      await db
        .update(schema.chats)
        .set({
          initialized: true,
          messages: [
            ...message.messages.map((m: any) => ({
              ...m,
              id: crypto.randomUUID(),
            })),
            {
              role: 'assistant',
              content: result.text,
              id: crypto.randomUUID(),
            },
          ],
        })
        .where(eq(schema.chats.id, message.id))
    },
  })

  return result.toDataStreamResponse()
}
