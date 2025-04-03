'use client'

import { PlusIcon, MessageSquare, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { use } from 'react'
import { deleteChatAction } from '../action'

export function Nav({
  chatsPromise,
}: {
  chatsPromise: Promise<
    {
      id: string
      name: string
      totalMessages: number
    }[]
  >
}) {
  const chats = use(chatsPromise)
  const pathname = usePathname()

  return (
    <div className="m-4 h-[calc(100vh-32px)] backdrop-blur-md bg-[rgba(255,255,255,0.45)] dark:bg-[rgba(10,10,10,0.35)] border border-white/10 w-64 overflow-hidden fixed top-0 left-0">
      <nav className="relative z-10 p-4 flex flex-col gap-4 h-full">
        <Button variant="outline" className="w-full group" asChild>
          <Link href="/chat">
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
                <Link
                  href={`/chat/${chat.id}`}
                  className="flex-1 flex items-center gap-3 cursor-pointer overflow-hidden"
                >
                  <MessageSquare className="w-4 h-4 text-white/60" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">
                      {chat.name}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {chat.totalMessages} messages
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() =>
                    deleteChatAction({
                      id: chat.id,
                      path: pathname,
                    })
                  }
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
