'use client'

import { cn } from '@/lib/utils'
import { BotIcon, User2Icon } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect } from 'react'

interface MessageProps {
  content: string
  createdAt?: Date
  isLoading?: boolean
  isLast?: boolean
}

export function UserMessage({ content, createdAt }: MessageProps) {
  return (
    <motion.div
      className="flex items-start gap-4 justify-end group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="flex flex-col items-end w-full">
        <motion.div className="bg-primary text-primary-foreground max-w-[80%] w-fit rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm transition-all">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </motion.div>
        {createdAt && (
          <span className="text-xs text-muted-foreground mt-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(createdAt)}
          </span>
        )}
      </div>
      <motion.div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
        <User2Icon className="h-4 w-4" />
      </motion.div>
    </motion.div>
  )
}

export function AIMessage({
  content,
  createdAt,
  isLoading,
  isLast,
}: MessageProps) {
  return (
    <motion.div
      className="flex items-start gap-4 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.div
        className={cn(
          'flex-shrink-0 h-8 w-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white',
          isLoading && isLast && 'animate-bounce'
        )}
      >
        <BotIcon className="h-4 w-4" />
      </motion.div>
      <div className="flex flex-col">
        <motion.div className="bg-zinc-800 dark:bg-zinc-900 text-white max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-white/10 hover:shadow-lg hover:border-white/20 transition-all">
          <div className="whitespace-pre-wrap break-words">{content}</div>
        </motion.div>
        {createdAt && (
          <span className="text-xs text-muted-foreground mt-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(createdAt)}
          </span>
        )}
      </div>
    </motion.div>
  )
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date)
}
