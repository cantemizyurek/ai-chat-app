import { getUser } from '@/lib/auth'
import { Nav } from './components/nav'
import { getChats } from '@/lib/database/queries'
import { redirect } from 'next/navigation'
import { NavSkeleton } from './components/nav-skeleton'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { JotaiProvider } from '@/components/jotai-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <JotaiProvider>
      <div className="flex min-h-screen">
        <Suspense fallback={<NavSkeleton />}>
          <Nav
            chatsPromise={getUser().then((user) =>
              user?.id ? getChats(user.id) : redirect('/auth/sign-in')
            )}
          />
        </Suspense>
        <div className="flex flex-col w-full min-h-full ml-68">{children}</div>
      </div>
      <Toaster />
    </JotaiProvider>
  )
}
