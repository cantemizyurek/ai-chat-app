'use server'

import { actionClient } from '@/lib/action'
import { signUpSchema } from './schema'
import { db } from '@/lib/database'
import { users } from '@/lib/database/schema'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hash } from '@node-rs/bcrypt'
import { eq } from 'drizzle-orm'
import { returnValidationErrors } from 'next-safe-action'
import { z } from 'zod'

export const anonymousSignUpAction = actionClient
  .schema(z.void())
  .action(async ({ parsedInput }) => {
    const [user] = await db.insert(users).values({}).returning()

    await createSession(user.id)

    redirect('/chat')
  })

export const signUpAction = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput }) => {
    const { email, password, name } = parsedInput

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser)
      return returnValidationErrors(signUpSchema, {
        email: { _errors: ['User already exists'] },
      })

    const [user] = await db
      .insert(users)
      .values({
        email,
        password: await hash(password, 10),
        name,
      })
      .returning()

    await createSession(user.id)

    redirect('/chat')
  })
