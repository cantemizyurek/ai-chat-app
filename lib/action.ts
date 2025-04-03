import { createSafeActionClient } from 'next-safe-action'
import { getUser } from './auth'
import { redirect } from 'next/navigation'

export const actionClient = createSafeActionClient()
export const userActionClient = createSafeActionClient().use(
  async ({ next, ctx }) => {
    const user = await getUser()
    if (!user) redirect('/auth/sign-in')
    return next({ ctx: { user } })
  }
)
