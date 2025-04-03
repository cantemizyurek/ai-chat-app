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
    .select()
    .from(schema.chats)
    .where(eq(schema.chats.id, id))

  if (!chat) redirect('/chat')

  return chat
}
