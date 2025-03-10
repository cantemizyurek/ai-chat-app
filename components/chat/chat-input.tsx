'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SendIcon, PauseIcon } from 'lucide-react'

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
  const adjustTextareaHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
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

  return (
    <form
      className="w-full fixed max-w-2xl mx-auto bottom-0 z-10 pb-4 pt-2"
      onSubmit={handleSubmit}
    >
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 w-full">
            <textarea
              value={input}
              onChange={(e) => {
                handleInputChange(e)
                adjustTextareaHeight(e)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none outline-none bg-transparent min-h-[24px] max-h-[200px] overflow-y-auto"
            />
            <div className="flex items-center justify-end">
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
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
