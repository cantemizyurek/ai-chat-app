import { z } from 'zod'
import { emailSchema, passwordSchema } from '@/lib/schema'

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})
