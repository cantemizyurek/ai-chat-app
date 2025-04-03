import { getUser } from '@/lib/auth'
import { Nav } from './components/nav'
import { getChats } from '@/lib/database/queries'
import { redirect } from 'next/navigation'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Nav
        chatsPromise={getUser().then((user) =>
          user?.id ? getChats(user.id) : redirect('/auth/sign-in')
        )}
      />
      <div className="flex flex-col w-full min-h-full ml-68">{children}</div>
    </div>
  )
}
