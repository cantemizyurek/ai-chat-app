'use client'

import { useChat } from '@ai-sdk/react'
import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChatInput } from '@/components/chat/chat-input'
import { Chat } from '@/components/chat/chat'
import { useLocalStorage } from '@/lib/providers/local-storage-provider'

export default function ChatPage() {
  const params = useParams()
  const id = params.id as string
  const searchParams = useSearchParams()
  const router = useRouter()
  const hasAppendedRef = useRef(false)
  const { getChatMessages, saveChat } = useLocalStorage()

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
    initialMessages: getChatMessages(id),
  })

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(id, messages)
    }
  }, [messages, id, saveChat])

  useEffect(() => {
    const message = searchParams.get('initialMessage')
    if (message && !hasAppendedRef.current) {
      hasAppendedRef.current = true
      append({
        role: 'user',
        content: message,
      })
    }

    if (searchParams.has('initialMessage')) {
      router.replace(`/chat/${id}`)
    }
  }, [searchParams, append, router, id])

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto relative min-h-full">
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
