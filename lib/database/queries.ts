import { db, schema } from '@/lib/database'
import { desc, eq, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'

export async function getChats(userId: string) {
  const chats = await db
    .select({
      id: schema.chats.id,
      name: schema.chats.name,
      totalMessages: sql<number>`jsonb_array_length(${schema.chats.messages})`,
    })
    .from(schema.chats)
    .where(eq(schema.chats.userId, userId))
    .orderBy(desc(schema.chats.createdAt))

  return chats
}

export async function getChat(id: string) {
  const [chat] = await db
    .select({
      id: schema.chats.id,
      name: schema.chats.name,
      messages: schema.chats.messages,
      initialized: schema.chats.initialized,
      settings: {
        systemPrompt: schema.chatSettings.systemPrompt,
        temperature: schema.chatSettings.temperature,
        topP: schema.chatSettings.topP,
        topK: schema.chatSettings.topK,
      },
      createdAt: schema.chats.createdAt,
      updatedAt: schema.chats.updatedAt,
    })
    .from(schema.chats)
    .where(eq(schema.chats.id, id))
    .innerJoin(
      schema.chatSettings,
      eq(schema.chats.id, schema.chatSettings.chatId)
    )

  if (!chat) redirect('/chat')

  return chat
}
