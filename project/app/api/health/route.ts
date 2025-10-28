import { NextResponse } from 'next/server'

export async function GET(): Promise<NextResponse> {
  // Simple health check - just verify the app is running
  // Don't check backend connectivity in healthcheck (causes container restart loops)
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}
