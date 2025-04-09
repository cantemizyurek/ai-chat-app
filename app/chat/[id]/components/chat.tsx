'use client'

import { useChat } from '@ai-sdk/react'
import { useParams } from 'next/navigation'
import { ChatInput } from '@/components/chat/chat-input'
import { Chat as ChatDisplay } from '@/components/chat/chat'
import { Message } from 'ai'
import { useEffect, useRef } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { chatSettingsAtom, modelAtom } from '@/lib/jotai/atoms'
import { chatSettingsSchema } from '@/app/chat/schema'
import { z } from 'zod'

export function Chat({
  isInitial,
  initialMessages,
  initialSettings,
}: {
  isInitial: boolean
  initialMessages: Message[]
  initialSettings: z.infer<typeof chatSettingsSchema>
}) {
  const isFirstRender = useRef(true)
  const params = useParams()
  const id = params.id as string
  const model = useAtomValue(modelAtom)
  const setChatSettings = useSetAtom(chatSettingsAtom)

  useEffect(() => {
    setChatSettings(initialSettings)
  }, [initialSettings])

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
    <>
      <ChatDisplay messages={messages} isLoading={status === 'streaming'} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        stop={stop}
        status={status || 'ready'}
      />
    </>
  )
}
