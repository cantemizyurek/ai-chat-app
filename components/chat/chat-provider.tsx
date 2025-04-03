'use client'

import { createContext, use, useState } from 'react'
import { z } from 'zod'
import { aiModels } from '@/lib/schema'

interface ChatProviderProps {
  model: z.infer<typeof aiModels>
  setModel: (model: z.infer<typeof aiModels>) => void
}

export const ChatContext = createContext<ChatProviderProps>({
  model: 'gpt-4o-mini',
  setModel: () => {},
})

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<z.infer<typeof aiModels>>('gpt-4o-mini')

  return <ChatContext value={{ model, setModel }}>{children}</ChatContext>
}

export function useChat() {
  const context = use(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
