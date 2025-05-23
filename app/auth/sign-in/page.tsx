'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInAction } from './action'
import { signInSchema } from './schema'
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputPassword } from '@/components/ui/input-password'

export default function SignInPage() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  const { execute, status } = useAction(signInAction, {
    onError: (error) => {
      for (const key in error.error.validationErrors) {
        const validationError =
          error.error.validationErrors[
            key as keyof z.infer<typeof signInSchema>
          ]
        if (validationError?._errors?.[0]) {
          form.setError(key as keyof z.infer<typeof signInSchema>, {
            message: validationError._errors[0],
          })
        }
      }
    },
  })

  return (
    <div className="h-screen w-screen p-15 flex justify-between">
      <div className="h-full flex flex-col justify-between w-full">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">
              /Sign<span className="text-primary/70">In</span>
            </h1>
            <p className="text-muted-foreground">
              Sign in to your account to access TriGPT
            </p>
          </div>
          <div className="text-lg text-muted-foreground">Tri - GPT</div>
        </div>
      </div>
      <Form {...form}>
        <form
          className="w-full h-full flex items-center justify-center"
          onSubmit={form.handleSubmit(execute)}
        >
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        {...field}
                        id={field.name}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <FormControl>
                      <InputPassword placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground ml-auto"
              >
                <Link href="/auth/forgot-password">Forgot password?</Link>
              </Button>
            </div>
            <Button
              disabled={status === 'executing' || !form.formState.isValid}
              type="submit"
            >
              {status === 'executing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
            <div className="flex gap-2 items-center mx-auto text-sm">
              <span className="text-muted-foreground items-center">
                Don't have an account?
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground p-0 text-sm"
                asChild
              >
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
