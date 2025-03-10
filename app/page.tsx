'use client'

import { ChatInput } from './components/chat-input'
import { useChat } from '@ai-sdk/react'
import { Chat } from './components/chat'

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    append,
  } = useChat()

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto  relative">
      <Chat messages={messages} isLoading={status === 'streaming'} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        stop={stop}
        status={status || 'ready'}
      />
    </div>
  )
}
