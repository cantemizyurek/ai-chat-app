'use server'

import { userActionClient } from '@/lib/action'
import { db } from '@/lib/database'
import { schema } from '@/lib/database'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { chatSettingsSchema } from './schema'

export const createChatAction = userActionClient
  .schema(z.object({ message: z.string(), settings: chatSettingsSchema }))
  .action(async ({ parsedInput: { message, settings }, ctx: { user } }) => {
    const [chat] = await db
      .insert(schema.chats)
      .values({
        userId: user.id,
        messages: [
          {
            id: crypto.randomUUID(),
            role: 'user',
            content: message,
          },
        ],
        name: message,
      })
      .returning()

    await db.insert(schema.chatSettings).values({
      chatId: chat.id,
      systemPrompt: settings.systemPrompt,
      temperature: settings.temperature,
      topP: settings.topP,
      topK: settings.topK,
    })

    revalidatePath('/chat')

    redirect(`/chat/${chat.id}`)
  })

export const updateChatSettingsAction = userActionClient
  .schema(z.object({ id: z.string(), settings: chatSettingsSchema }))
  .action(async ({ parsedInput: { id, settings }, ctx: { user } }) => {
    await db
      .update(schema.chatSettings)
      .set(settings)
      .where(eq(schema.chatSettings.chatId, id))

    revalidatePath(`/chat`, 'layout')
  })

export const deleteChatAction = userActionClient
  .schema(z.object({ id: z.string(), path: z.string() }))
  .action(async ({ parsedInput: { id, path }, ctx: { user } }) => {
    const [chat] = await db
      .delete(schema.chats)
      .where(and(eq(schema.chats.id, id), eq(schema.chats.userId, user.id)))
      .returning()

    revalidatePath('/chat')

    if (path === `/chat/${id}`) {
      redirect('/chat')
    }
  })
