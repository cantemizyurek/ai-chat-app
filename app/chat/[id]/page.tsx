import { getChat } from '@/lib/database/queries'
import { Chat } from './components/chat'
import { Message } from 'ai'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const chat = await getChat(id)

  return (
    <Chat
      isInitial={chat.initialized}
      initialMessages={chat.messages as Message[]}
      initialSettings={chat.settings}
    />
  )
}
