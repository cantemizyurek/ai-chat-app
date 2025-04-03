'use client'

import { Input } from '@/components/ui/input'
import { Button } from './button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

export function InputPassword({
  className,
  ...props
}: React.ComponentProps<typeof Input> & {
  className?: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        className="peer"
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 peer-aria-invalid:text-destructive peer-aria-invalid:dark:text-destructive"
        onClick={() => setShowPassword(!showPassword)}
        type="button"
      >
        {showPassword ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
