'use client'

import { PlusIcon, MessageSquare, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { useLocalStorage } from '@/lib/providers/local-storage-provider'

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { chats, deleteChat } = useLocalStorage()

  async function handleDelete(chatId: string) {
    try {
      if (pathname === `/chat/${chatId}`) {
        router.push('/')
        await new Promise((resolve) => setTimeout(resolve, 500))
        await deleteChat(chatId)
      } else {
        await deleteChat(chatId)
      }
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  function handleChatClick(chatId: string) {
    if (pathname !== `/chat/${chatId}`) {
      router.push(`/chat/${chatId}`)
    }
  }

  return (
    <div className="m-4 backdrop-blur-md h-[calc(100vh-32px)] bg-[rgba(255,255,255,0.45)] dark:bg-[rgba(10,10,10,0.35)] border border-[var(--glass-border)] shadow-[0_4px_30px_var(--glass-shadow)] w-64 rounded-2xl overflow-hidden fixed top-0 left-0">
      <nav className="relative z-10 p-4 flex flex-col gap-4 h-full">
        <Button variant="glass" className="w-full group" asChild>
          <Link href="/">
            <PlusIcon className="w-4 h-4" />
            <span>New chat</span>
          </Link>
        </Button>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {chats.map((chat) => (
            <motion.div
              key={chat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`group p-3 rounded-lg transition-all hover:bg-white/10 max-w-full overflow-hidden ${
                pathname === `/chat/${chat.id}` ? 'bg-white/10' : ''
              }`}
            >
              <div className="flex items-center gap-3 max-w-full overflow-hidden">
                <div
                  className="flex-1 flex items-center gap-3 cursor-pointer overflow-hidden"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <MessageSquare className="w-4 h-4 text-white/60" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">
                      {chat.firstMessage}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {chat.messages.length} messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(chat.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded flex-shrink-0"
                >
                  <Trash2Icon className="w-4 h-4 text-red-500/80" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </nav>
    </div>
  )
}
