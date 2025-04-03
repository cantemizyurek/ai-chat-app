import { NextRequest, NextResponse } from 'next/server'
import { createMiddleware } from '@/lib/middleware'

export default createMiddleware({
  getContext: async (request: NextRequest) => {
    const session = request.cookies.get('session')
    if (!session) return {}
    return { session: session.value }
  },
  routes: [
    {
      exact: true,
      pattern: '/',
      handler: async (req, params, ctx) => {
        if (!ctx.session) return '/auth/sign-in'
        return '/chat'
      },
    },
    {
      pattern: '/chat',
      handler: async (req, params, ctx) => {
        if (!ctx.session) return '/auth/sign-in'
        return true
      },
    },
  ],
})
