export type Model = {
  slug: string
  name: string
}

export const models = [
  { slug: 'gpt-4o', name: 'GPT-4o' },
  { slug: 'gpt-4o-mini', name: 'GPT-4o Mini' },
  { slug: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet' },
  { slug: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet' },
  { slug: 'grok-2', name: 'Grok 2' },
  { slug: 'deepseek-3-fireworks', name: 'DeepSeek 3 Fireworks' },
  { slug: 'llma4-groq', name: 'LLMA4 (Groq)' },
] as const

export type ModelSlug = (typeof models)[number]['slug']
