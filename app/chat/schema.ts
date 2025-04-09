import { z } from 'zod'

export const chatSettingsSchema = z.object({
  systemPrompt: z.string(),
  temperature: z.number().min(0).max(1),
  topP: z.number().min(0).max(1),
  topK: z.number().min(0).max(1),
})
