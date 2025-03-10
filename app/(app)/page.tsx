'use client'

import { ChatInput } from '@/components/chat/chat-input'
import { Chat } from '@/components/chat/chat'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState('')
  const router = useRouter()

  return (
    <div className="flex flex-col max-w-2xl w-full mx-auto relative min-h-full">
      <Chat messages={[]} isLoading={false} />
      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSubmit={(e) => {
          e.preventDefault()
          router.push(`/chat/${nanoid()}?initialMessage=${input}`)
        }}
        stop={() => {}}
        status={'ready'}
      />
    </div>
  )
}
