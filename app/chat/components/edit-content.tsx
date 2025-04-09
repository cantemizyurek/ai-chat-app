'use client'

import { Label } from '@/components/ui/label'
import {
  SheetHeader,
  SheetTitle,
  SheetContent,
  Sheet,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { HookActionStatus, useAction } from 'next-safe-action/hooks'
import { updateChatSettingsAction } from '../action'
import { chatSettingsSchema } from '../schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Settings2 } from 'lucide-react'
import { useAtom } from 'jotai'
import { chatSettingsAtom } from '@/lib/jotai/atoms'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

export function EditContentSheet() {
  const [chatSettings, setChatSettings] = useAtom(chatSettingsAtom)
  const { id } = useParams()
  const { execute, status } = useAction(updateChatSettingsAction)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Settings2 className="w-6 h-6" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Context Settings</SheetTitle>
        </SheetHeader>
        <EditContent
          onSave={async (settings) => {
            if (id) {
              await execute({
                id: id as string,
                settings,
              })
            } else {
              setChatSettings(settings)
            }
            toast.success('Settings saved')
          }}
          currentSettings={chatSettings}
          status={id ? status : 'idle'}
        />
      </SheetContent>
    </Sheet>
  )
}

export function EditContent({
  onSave,
  status,
  currentSettings,
}: {
  onSave: (settings: z.infer<typeof chatSettingsSchema>) => void
  currentSettings: z.infer<typeof chatSettingsSchema>
  status: HookActionStatus
}) {
  const form = useForm<z.infer<typeof chatSettingsSchema>>({
    resolver: zodResolver(chatSettingsSchema),
    defaultValues: currentSettings,
  })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 p-4"
        onSubmit={form.handleSubmit((data) => {
          onSave(data)
        })}
      >
        <FormField
          control={form.control}
          name="systemPrompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Prompt</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder="You are a helpful assistant that can answer questions and help with tasks."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Temperature</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  value={[field.value]}
                  max={1}
                  min={0}
                  step={0.05}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topP"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Top P</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  value={[field.value]}
                  max={1}
                  min={0}
                  step={0.05}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topK"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-2">
                <FormLabel>Top K</FormLabel>
                <span className="text-sm text-muted-foreground">
                  {field.value}
                </span>
              </div>
              <FormControl>
                <Slider
                  value={[field.value]}
                  max={1}
                  min={0}
                  step={0.05}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={status === 'executing'}>
          Save
        </Button>
      </form>
    </Form>
  )
}
