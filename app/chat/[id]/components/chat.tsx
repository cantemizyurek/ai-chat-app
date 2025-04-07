'use client'

import { useChat } from '@ai-sdk/react'
import { useParams } from 'next/navigation'
import { ChatInput } from '@/components/chat/chat-input'
import { Chat as ChatDisplay } from '@/components/chat/chat'
import { Message } from 'ai'
import { useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { modelAtom } from '@/lib/jotai/atoms'

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
  const model = useAtomValue(modelAtom)

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
    body: {
      model,
    },
    sendExtraMessageFields: true,
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
    <div className="flex flex-col max-w-lg xl:max-w-2xl 2xl:max-w-3xl w-full mx-auto relative min-h-full">
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
