'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, VenetianMask } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from './schema'
import { Form, FormMessage } from '@/components/ui/form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { InputPassword } from '@/components/ui/input-password'
import { anonymousSignUpAction, signUpAction } from './action'

export default function SignUpPage() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  })

  const { execute, status } = useAction(signUpAction, {
    onError: (error) => {
      for (const key in error.error.validationErrors) {
        const validationError =
          error.error.validationErrors[
            key as keyof z.infer<typeof signUpSchema>
          ]
        if (validationError?._errors?.[0]) {
          form.setError(key as keyof z.infer<typeof signUpSchema>, {
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
              /Sign<span className="text-primary/70">Up</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Sign up to get started with TriGPT and explore the next generation
              of AI Chat Applications.
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
                    <FormLabel
                      htmlFor={field.name}
                      className={cn(
                        form.formState.errors.email && 'text-destructive'
                      )}
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="test@test.com"
                        id={field.name}
                        {...field}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Username</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Can"
                        id={field.name}
                        {...field}
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
                      <InputPassword
                        placeholder="********"
                        id={field.name}
                        {...field}
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="********"
                        id={field.name}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              disabled={status === 'executing' || !form.formState.isValid}
              className="flex gap-2 items-center"
            >
              {status === 'executing' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Sign Up'
              )}
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-px w-full bg-border" />
              <span className="text-muted-foreground text-sm">Or</span>
              <div className="h-px w-full bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={() => anonymousSignUpAction()}
              >
                <VenetianMask className="h-4 w-4" />
                Anonymous
              </Button>
              <div></div>
            </div>
            <div className="flex gap-2 items-center mx-auto text-sm">
              <span className="text-muted-foreground items-center">
                Already have an account?
              </span>
              <Button
                variant="link"
                size="sm"
                className="text-muted-foreground p-0 text-sm"
                asChild
              >
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
