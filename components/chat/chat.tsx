'use client'

import { Message } from 'ai'
import { UserMessage } from './message-bubbles'
import { AIMessage } from './message-bubbles'
import { MessageSquareIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

interface ChatProps {
  messages: Message[]
  isLoading?: boolean
}

export function Chat({ messages, isLoading = false }: ChatProps) {
  const isAtBottomRef = useRef(true)

  function checkIfAtBottom() {
    const threshold = 100
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - threshold
    isAtBottomRef.current = isAtBottom
  }

  useEffect(() => {
    if (isAtBottomRef.current) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  useEffect(() => {
    window.addEventListener('scroll', checkIfAtBottom)
    return () => window.removeEventListener('scroll', checkIfAtBottom)
  }, [])

  if (messages.length === 0) {
    return <EmptyChat />
  }

  return (
    <div className="flex flex-col gap-4 h-full mb-40 p-4">
      {messages.map((message) => {
        const createdAt = message.createdAt
          ? new Date(message.createdAt)
          : undefined

        return message.role === 'user' ? (
          <UserMessage
            key={message.id}
            content={message.content}
            createdAt={createdAt}
          />
        ) : (
          <AIMessage
            key={message.id}
            content={message.content}
            createdAt={createdAt}
            isLoading={isLoading}
            isLast={message.id === messages[messages.length - 1].id}
          />
        )
      })}
    </div>
  )
}

export function EmptyChat() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-10rem)] p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          className="mb-6 w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.5,
            ease: [0.23, 1, 0.32, 1],
            delay: 0.2,
          }}
        >
          <MessageSquareIcon className="size-8 text-white/40" />
        </motion.div>
        <motion.h3
          className="text-xl font-semibold text-white/80 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        >
          Start a conversation
        </motion.h3>
        <motion.p
          className="text-white/60 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
        >
          Type a message below to begin chatting with the AI assistant.
        </motion.p>
        <motion.div
          className="text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
        >
          Your conversation will appear here.
        </motion.div>
      </div>
    </motion.div>
  )
}
