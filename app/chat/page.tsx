'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { Chat } from '@/components/chat/chat'
import { useState } from 'react'
import { createChatAction } from './action'
import { useAction } from 'next-safe-action/hooks'

export default function Home() {
  const [input, setInput] = useState('')
  const { execute, status } = useAction(createChatAction)
  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto relative min-h-full">
      <Chat messages={[]} isLoading={false} />
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
    </div>
  )
}
