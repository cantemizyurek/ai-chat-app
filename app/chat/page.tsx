'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { Chat } from '@/components/chat/chat'
import { useEffect, useState } from 'react'
import { createChatAction } from './action'
import { useAction } from 'next-safe-action/hooks'
import { Message } from 'ai'
import { useAtom, useAtomValue } from 'jotai'
import { chatSettingsAtom } from '@/lib/jotai/atoms'

export default function Home() {
  const [input, setInput] = useState('')
  const { execute, status } = useAction(createChatAction)
  const [messages] = useState<Message[]>([])
  const [settings, setSettings] = useAtom(chatSettingsAtom)

  useEffect(() => {
    setSettings({
      systemPrompt: '',
      temperature: 1,
      topP: 1,
      topK: 1,
    })
  }, [])

  return (
    <>
      <Chat messages={messages} isLoading={false} />
      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={(e) => {
          e.preventDefault()
          execute({ message: input, settings })
        }}
        stop={() => {}}
        status={status === 'executing' ? 'submitted' : 'ready'}
      />
    </>
  )
}
