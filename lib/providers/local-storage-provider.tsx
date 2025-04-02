'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Message } from 'ai'

interface Chat {
  id: string
  messages: Message[]
  firstMessage: string
  updatedAt: string
}

interface LocalStorageContextType {
  chats: Chat[]
  saveChat: (chatId: string, messages: Message[]) => void
  deleteChat: (chatId: string) => Promise<void>
  getChatMessages: (chatId: string) => Message[]
}

const LocalStorageContext = createContext<LocalStorageContextType | null>(null)

export function LocalStorageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const loadedChats: Chat[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith('chat-')) {
        const id = key.replace('chat-', '')
        const messages = JSON.parse(localStorage.getItem(key) || '[]')
        if (messages.length > 0) {
          loadedChats.push({
            id,
            messages,
            firstMessage: messages[0].content,
            updatedAt: new Date().toLocaleDateString(),
          })
        }
      }
    }
    loadedChats.sort((a, b) => b.messages.length - a.messages.length)
    setChats(loadedChats)
  }, [])

  const saveChat = (chatId: string, messages: Message[]) => {
    if (messages.length === 0) return

    const existingChat = chats.find((chat) => chat.id === chatId)
    const existingMessages = existingChat?.messages || []

    const messagesChanged =
      existingMessages.length !== messages.length ||
      JSON.stringify(existingMessages) !== JSON.stringify(messages)

    if (!messagesChanged) return

    localStorage.setItem(`chat-${chatId}`, JSON.stringify(messages))

    setChats((prevChats) => {
      const existingChatIndex = prevChats.findIndex(
        (chat) => chat.id === chatId
      )
      const newChat = {
        id: chatId,
        messages,
        firstMessage: messages[0].content,
        updatedAt: new Date().toLocaleDateString(),
      }

      if (existingChatIndex !== -1) {
        const updatedChats = [...prevChats]
        updatedChats[existingChatIndex] = newChat
        return updatedChats
      }

      return [...prevChats, newChat]
    })
  }

  const deleteChat = async (chatId: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        localStorage.removeItem(`chat-${chatId}`)

        setChats((prevChats) => {
          const chatExists = prevChats.some((chat) => chat.id === chatId)
          if (!chatExists) {
            resolve()
            return prevChats
          }

          const newChats = prevChats.filter((chat) => chat.id !== chatId)
          resolve()
          return newChats
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const getChatMessages = (chatId: string): Message[] => {
    const chat = chats.find((c) => c.id === chatId)
    return chat?.messages || []
  }

  return (
    <LocalStorageContext
      value={{ chats, saveChat, deleteChat, getChatMessages }}
    >
      {children}
    </LocalStorageContext>
  )
}

export function useLocalStorage() {
  const context = useContext(LocalStorageContext)
  if (!context) {
    throw new Error(
      'useLocalStorage must be used within a LocalStorageProvider'
    )
  }
  return context
}
