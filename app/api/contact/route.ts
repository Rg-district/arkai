import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, restaurant, email, phone } = body
    if (!name || !email) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    // TODO: wire to Supabase or email provider
    console.log('New Arkai lead:', { name, restaurant, email, phone })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
