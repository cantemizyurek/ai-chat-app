import { z } from 'zod'
import { emailSchema, passwordSchema, nameSchema } from '@/lib/schema'

export const signUpSchema = z
  .object({
    email: emailSchema,
    name: nameSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
