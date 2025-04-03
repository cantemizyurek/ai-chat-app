'use server'

import { userActionClient } from '@/lib/action'
import { db } from '@/lib/database'
import { schema } from '@/lib/database'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const createChatAction = userActionClient
  .schema(z.string())
  .action(async ({ parsedInput: message, ctx: { user } }) => {
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

    revalidatePath('/chat')

    redirect(`/chat/${chat.id}`)
  })

export const deleteChatAction = userActionClient
  .schema(z.object({ id: z.string(), path: z.string() }))
  .action(async ({ parsedInput: { id, path }, ctx: { user } }) => {
    const [chat] = await db
      .delete(schema.chats)
      .where(and(eq(schema.chats.id, id), eq(schema.chats.userId, user.id)))
      .returning()

    revalidatePath('/chat')

    if (chat.id === id) {
      redirect('/chat')
    }

    return { success: true }
  })
