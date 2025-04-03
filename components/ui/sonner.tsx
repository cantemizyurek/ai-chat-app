'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--radius': '0px',
          '--border-radius': '0px',
          '--toast-radius': '0px',
          '--toast-border-radius': '0px',
          '--backdrop-filter': 'blur(8px)',
          backdropFilter: 'blur(8px)',
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
