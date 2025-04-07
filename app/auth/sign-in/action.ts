'use server'

import { actionClient } from '@/lib/action'
import { signInSchema } from './schema'
import { db } from '@/lib/database'
import { eq } from 'drizzle-orm'
import { users } from '@/lib/database/schema'
import { compare } from '@node-rs/bcrypt'
import { redirect } from 'next/navigation'
import { returnValidationErrors } from 'next-safe-action'
import { createSession } from '@/lib/auth'

export const signInAction = actionClient
  .schema(signInSchema)
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput

    const [user] = await db.select().from(users).where(eq(users.email, email))

    if (!user)
      return returnValidationErrors(signInSchema, {
        email: { _errors: ['User not found'] },
      })

    const isPasswordValid = await compare(password, user.password!)

    if (!isPasswordValid)
      return returnValidationErrors(signInSchema, {
        password: { _errors: ['Invalid password'] },
      })

    await createSession(user.id)

    redirect('/chat')
  })
