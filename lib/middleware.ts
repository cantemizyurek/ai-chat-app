import {
  NextResponse,
  URLPattern,
  type NextMiddleware,
  type NextRequest,
} from 'next/server'

export interface MiddlewareOptions<CTX = Record<string, unknown>> {
  getContext?: GetRouteHandlerContext<CTX>
  routes: RouteHandler<CTX>[]
  onError?: OnErrorFunction
  onDenied?: OnDeniedFunction
}

export interface RouteHandler<CTX> {
  pattern: string
  handler: (
    req: NextRequest,
    params: Record<string, string>,
    ctx: CTX
  ) => Promise<string | boolean> | string | boolean
  exact?: boolean
}

export type GetRouteHandlerContext<CTX> = (
  req: NextRequest
) => Promise<CTX> | CTX

export type OnErrorFunction = (error: Error, req: NextRequest) => void

export type OnDeniedFunction = (req: NextRequest) => NextResponse

export function createMiddleware<CTX>({
  routes,
  getContext,
  onError,
  onDenied,
}: MiddlewareOptions<CTX>): NextMiddleware {
  return async (req: NextRequest) => {
    const { pathname } = req.nextUrl

    const ctx = getContext ? await getContext(req) : ({} as CTX)

    for (const route of routes) {
      const pattern = new URLPattern({
        pathname: `${route.pattern}${route.exact ? '' : '(/.*)?'}`,
      })
      const match = pattern.exec({ pathname })

      if (!match) continue

      const params = match.pathname.groups as Record<string, string>

      try {
        const response = await route.handler(req, params, ctx)

        if (typeof response === 'string') redirect(new URL(response, req.url))
        else if (onDenied && typeof response === 'boolean' && !response)
          return onDenied(req)
      } catch (error) {
        if (error instanceof NextResponse) {
          return error
        }
        if (error instanceof Error && onError) {
          onError(error, req)
        }
      }
    }
  }
}

export function redirect(url: URL, status = 302): never {
  throw NextResponse.redirect(url, status)
}
