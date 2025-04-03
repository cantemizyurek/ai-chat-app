'use client'

import { useChat } from '@ai-sdk/react'
import { useParams } from 'next/navigation'
import { ChatInput } from '@/components/chat/chat-input'
import { Chat as ChatDisplay } from '@/components/chat/chat'
import { Message } from 'ai'
import { useEffect, useRef } from 'react'

export function Chat({
  isInitial,
  initialMessages,
}: {
  isInitial: boolean
  initialMessages: Message[]
}) {
  const isFirstRender = useRef(true)
  const params = useParams()
  const id = params.id as string

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    append,
  } = useChat({
    id,
    initialMessages: isInitial ? initialMessages : undefined,
  })

  useEffect(() => {
    if (!isInitial && isFirstRender.current) {
      isFirstRender.current = false
      initialMessages.forEach((message) => {
        append({
          role: message.role,
          content: message.content,
        })
      })
    }
  }, [])

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto relative min-h-full">
      <ChatDisplay messages={messages} isLoading={status === 'streaming'} />
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
