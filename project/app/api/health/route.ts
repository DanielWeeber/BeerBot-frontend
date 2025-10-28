import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  const backend = process.env.NEXT_PUBLIC_BACKEND_BASE || 'http://localhost:8080'
  const started = Date.now()
  console.info('[health] start', JSON.stringify({ backend }))
  try {
    const resp = await fetch(`${backend}/healthz`, { method: 'GET' })
    if (!resp.ok) {
      const duration = Date.now() - started
      console.error('[health] unhealthy', JSON.stringify({ backend, backend_status: resp.status, duration_ms: duration }))
      return NextResponse.json({ status: 'unhealthy', backend: resp.status }, { status: 502 })
    }
    const duration = Date.now() - started
    console.info('[health] ok', JSON.stringify({ backend, duration_ms: duration }))
    return NextResponse.json({ status: 'ok', backend }, { status: 200 })
  } catch (err) {
    const message = (err as Error)?.message ?? 'unknown error'
    const duration = Date.now() - started
    console.error('[health] error', JSON.stringify({ backend, duration_ms: duration, error: message }))
    return NextResponse.json({ status: 'unreachable', error: message }, { status: 502 })
  }
}
