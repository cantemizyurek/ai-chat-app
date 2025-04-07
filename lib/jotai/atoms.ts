import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { z } from 'zod'
import { aiModels } from '../schema'
import { Message } from 'ai'

export type Chat = {
  id: string
  name: string
  messages: Message[]
}

export const modelAtom = atomWithStorage<z.infer<typeof aiModels>>(
  'model',
  'gpt-4o-mini',
  {
    getItem: (key) => {
      const model = localStorage.getItem(key)
      if (model) {
        return model as z.infer<typeof aiModels>
      }
      return 'gpt-4o-mini'
    },
    setItem: (key, value) => {
      localStorage.setItem(key, value)
    },
    removeItem: (key) => {
      localStorage.removeItem(key)
    },
  }
)

export const chatsAtom = atom<Chat[]>([])
