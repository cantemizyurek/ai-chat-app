'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { Chat } from '@/components/chat/chat'
import { useState } from 'react'
import { createChatAction } from './action'
import { useAction } from 'next-safe-action/hooks'
import { Message } from 'ai'

export default function Home() {
  const [input, setInput] = useState('')
  const { execute, status } = useAction(createChatAction)
  const [messages] = useState<Message[]>([])

  return (
    <>
      <Chat messages={messages} isLoading={false} />
      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={(e) => {
          e.preventDefault()
          execute(input)
        }}
        stop={() => {}}
        status={status === 'executing' ? 'submitted' : 'ready'}
      />
    </>
  )
}
