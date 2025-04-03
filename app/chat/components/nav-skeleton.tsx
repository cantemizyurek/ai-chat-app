import { PlusIcon, MessageSquare, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export function NavSkeleton() {
  return (
    <div className="m-4 h-[calc(100vh-32px)] backdrop-blur-md bg-[rgba(255,255,255,0.45)] dark:bg-[rgba(10,10,10,0.35)] border border-white/10 w-64 overflow-hidden fixed top-0 left-0">
      <nav className="relative z-10 p-4 flex flex-col gap-4 h-full">
        <Button variant="outline" className="w-full group" asChild>
          <Link href="/chat">
            <PlusIcon className="w-4 h-4" />
            <span>New chat</span>
          </Link>
        </Button>

        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </nav>
    </div>
  )
}
