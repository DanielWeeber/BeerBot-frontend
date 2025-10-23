import { NextRequest, NextResponse } from 'next/server'

type ProxyParams = { path?: string[] | string }

async function proxy(
  request: NextRequest,
  ctx: { params: Promise<ProxyParams> }
) {
  const p = await ctx.params
  const pathArr = Array.isArray(p?.path) ? p.path : (p?.path ? [p.path] : [])
  const pathStr = pathArr.join('/')

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8080'
  const search = request.nextUrl?.search || ''
  const url = `${backendBase}/api/${pathStr}${search}`

  // Rebuild headers, propagate Authorization, or fall back to API_TOKEN
  const headers = new Headers()
  const authHeader = request.headers.get('Authorization')
  const HARDCODED_API_TOKEN = process.env.API_TOKEN || 'my-secret-token'
  let authSource: 'none' | 'client' | 'HARDCODED' = 'none'  

  if (authHeader) {
    headers.set('Authorization', authHeader)
    authSource = 'client'
  } else if (HARDCODED_API_TOKEN) {
    headers.set('Authorization', `Bearer ${HARDCODED_API_TOKEN}`)
    authSource = 'HARDCODED'
  }

  // Forward content-type if present
  const contentType = request.headers.get('Content-Type')
  if (contentType) headers.set('Content-Type', contentType)

  const started = Date.now()
  const hasUser = request.nextUrl?.searchParams?.has('user')
  const shouldLog = (pathStr === 'given' || pathStr === 'received') && !hasUser
  if (shouldLog) {
    console.info('[proxy] start', JSON.stringify({ method: request.method, path: pathStr, query: request.nextUrl?.searchParams?.toString() || '', authSource }))
  }

  // Prepare body for non-GET/HEAD
  let body: BodyInit | undefined = undefined
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = (await request.arrayBuffer()) as unknown as BodyInit
  }

  try {
    const resp = await fetch(url, {
      method: request.method,
      headers,
      body,
      // Avoid sending cookies/credentials to different origin by default
      redirect: 'manual',
    })

    const respContentType = resp.headers.get('Content-Type') || 'text/plain'
    const text = await resp.text()

    const duration = Date.now() - started
    if (shouldLog) {
      console.info('[proxy] done', JSON.stringify({ method: request.method, path: pathStr, status: resp.status, duration_ms: duration }))
    }

    return new NextResponse(text, {
      status: resp.status,
      headers: { 'Content-Type': respContentType },
    })
  } catch (err) {
    const duration = Date.now() - started
    if (shouldLog) {
      console.error('[proxy] error', JSON.stringify({ method: request.method, path: pathStr, duration_ms: duration, error: (err as Error)?.message }))
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}

export async function POST(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}

export async function PUT(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}

export async function OPTIONS(request: NextRequest, ctx: { params: Promise<ProxyParams> }) {
  return proxy(request, ctx)
}
