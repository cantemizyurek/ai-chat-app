'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SendIcon, PauseIcon, Wand2Icon } from 'lucide-react'
import { useEffect, useRef } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { enhancePrompt } from '@/lib/ai'
import { useAction } from 'next-safe-action/hooks'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { modelAtom } from '@/lib/jotai/atoms'
import { aiModels } from '@/lib/schema'
import { models } from '@/lib/models'

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

  const { execute: executeEnhancePrompt, status: enhancePromptStatus } =
    useAction(enhancePrompt, {
      onSuccess: (data) => {
        console.log(data)
        handleInputChange({
          target: {
            value: data.data || '',
          },
        } as React.ChangeEvent<HTMLTextAreaElement>)
      },
    })

  return (
    <form
      className="w-full fixed max-w-lg xl:max-w-2xl 2xl:max-w-3xl mx-auto bottom-0 z-10 pb-4 pt-2"
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
              disabled={enhancePromptStatus === 'executing'}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full resize-none outline-none bg-transparent min-h-[24px] max-h-[200px] overflow-y-auto"
            />
            <div className="flex items-center justify-between">
              <ModelSelector />
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => executeEnhancePrompt(input)}
                  disabled={enhancePromptStatus === 'executing'}
                >
                  <Wand2Icon
                    className={cn(
                      'size-4',
                      enhancePromptStatus === 'executing' && 'animate-pulse'
                    )}
                  />
                </Button>
                <>
                  {(status === 'streaming' || status === 'submitted') && (
                    <Button size="icon" onClick={stop} type="button">
                      <PauseIcon className="size-4" />
                    </Button>
                  )}
                  {status === 'ready' && (
                    <Button
                      size="icon"
                      type="submit"
                      disabled={enhancePromptStatus === 'executing'}
                    >
                      <SendIcon className="size-4" />
                    </Button>
                  )}
                </>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

function ModelSelector() {
  const [model, setModel] = useAtom(modelAtom)

  return (
    <Select
      value={model}
      defaultValue={model}
      onValueChange={(value) => {
        const parsed = aiModels.safeParse(value)
        if (parsed.success) {
          setModel(parsed.data)
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.slug} value={model.slug}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
