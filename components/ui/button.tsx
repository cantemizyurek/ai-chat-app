import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 relative overflow-hidden backdrop-blur-[2px] before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(circle_at_50%_-20%,var(--glass-shine),transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--glass-border] group",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-primary/90 to-primary border border-[--glass-border] text-primary-foreground shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_3px_var(--glass-shadow)] hover:shadow-[inset_0_1px_0_var(--glass-highlight),0_8px_20px_-3px_var(--glass-shadow)] hover:translate-y-[-1px] active:translate-y-[1px] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-[linear-gradient(180deg,var(--glass-shimmer)_0%,transparent_60%)] overflow-hidden',
        destructive:
          'bg-gradient-to-b from-destructive/90 to-destructive border border-[--glass-border] text-destructive-foreground shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_3px_var(--glass-shadow)] hover:shadow-[inset_0_1px_0_var(--glass-highlight),0_8px_20px_-3px_var(--glass-shadow)] hover:translate-y-[-1px] active:translate-y-[1px] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-[linear-gradient(180deg,var(--glass-shimmer)_0%,transparent_60%)]',
        outline:
          'bg-gradient-to-b from-background/50 to-background/30 backdrop-blur-[6px] border-2 border-[--glass-border] text-foreground shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_3px_var(--glass-shadow)] hover:shadow-[inset_0_1px_0_var(--glass-highlight),0_8px_20px_-3px_var(--glass-shadow)] hover:translate-y-[-1px] active:translate-y-[1px] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-[linear-gradient(180deg,var(--glass-shimmer)_0%,transparent_60%)]',
        secondary:
          'bg-gradient-to-b from-secondary/90 to-secondary border border-[--glass-border] text-secondary-foreground shadow-[inset_0_1px_0_var(--glass-highlight),0_1px_3px_var(--glass-shadow)] hover:shadow-[inset_0_1px_0_var(--glass-highlight),0_8px_20px_-3px_var(--glass-shadow)] hover:translate-y-[-1px] active:translate-y-[1px] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-[linear-gradient(180deg,var(--glass-shimmer)_0%,transparent_60%)]',
        ghost:
          'hover:bg-accent/10 hover:shadow-[0_8px_20px_-3px_var(--glass-shadow)] hover:translate-y-[-1px] active:translate-y-[1px] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:transition-opacity hover:after:opacity-100 after:bg-[linear-gradient(180deg,var(--glass-shimmer)_0%,transparent_60%)]',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/90',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-9 px-4 py-2',
        lg: 'h-11 px-6 py-3',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
