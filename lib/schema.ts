import { z } from 'zod'

export const emailSchema = z.string().email()

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(16, { message: 'Password must be less than 16 characters long' })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }
  )

export const nameSchema = z
  .string()
  .min(1, { message: 'Name is required' })
  .max(32, { message: 'Name must be less than 32 characters long' })
  .regex(/^[a-zA-Z0-9]+$/, {
    message: 'Name must contain only letters and numbers',
  })
  .transform((val) => val.trim())

export const aiModels = z.enum([
  'gpt-4o',
  'gpt-4o-mini',
  'claude-3-7-sonnet',
  'claude-3-5-sonnet',
  'grok-2',
  'deepseek-3-fireworks',
])
