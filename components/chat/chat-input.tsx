'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SendIcon, PauseIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { aiModels } from '@/lib/schema'
import { z } from 'zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChat as useChatProvider } from '@/components/chat/chat-provider'
export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  stop,
  status,
}: {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  stop: () => void
  status: 'streaming' | 'submitted' | 'ready' | 'error'
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { model, setModel } = useChatProvider()

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      if (status === 'ready' && input.trim()) {
        const form = e.currentTarget.form
        if (form) {
          form.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
          )
        }
      }
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  return (
    <form
      className="w-full fixed max-w-2xl mx-auto bottom-0 z-10 pb-4 pt-2"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit(e)
      }}
    >
      <Card className="w-full p-0 bg-background/10 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 w-full">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                handleInputChange(e)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none outline-none bg-transparent min-h-[24px] max-h-[200px] overflow-y-auto"
            />
            <div className="flex items-center justify-between">
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="claude-3-7-sonnet">
                    Claude Sonnet 3.7
                  </SelectItem>
                  <SelectItem value="claude-3-5-sonnet">
                    Claude Sonnet 3.5
                  </SelectItem>
                  <SelectItem value="grok-2">Grok 2</SelectItem>
                  <SelectItem value="deepseek-3-fireworks">
                    DeepSeek 3 (Fireworks)
                  </SelectItem>
                </SelectContent>
              </Select>

              <>
                {(status === 'streaming' || status === 'submitted') && (
                  <Button size="icon" onClick={stop} type="button">
                    <PauseIcon className="size-4" />
                  </Button>
                )}
                {status === 'ready' && (
                  <Button size="icon" type="submit">
                    <SendIcon className="size-4" />
                  </Button>
                )}
              </>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
