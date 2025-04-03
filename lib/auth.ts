import { db, schema } from '@/lib/database'
import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

export async function getUser() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')

  if (!session) return null

  const [result] = await db
    .select({
      user: schema.users,
    })
    .from(schema.users)
    .innerJoin(schema.sessions, eq(schema.users.id, schema.sessions.userId))
    .where(eq(schema.sessions.id, session.value))

  if (!result) return null

  return {
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
  }
}

export async function createSession(userId: string) {
  const session = await db
    .insert(schema.sessions)
    .values({
      userId,
    })
    .returning()

  const cookieStore = await cookies()

  cookieStore.set('session', session[0].id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return session[0]
}

export async function deleteSession(id: string) {
  await db.delete(schema.sessions).where(eq(schema.sessions.id, id))
}
