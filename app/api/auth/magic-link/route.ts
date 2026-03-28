import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check restaurant exists
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!restaurant) {
      // Don't reveal whether email exists
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email.toLowerCase().trim(),
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
      },
    });

    if (error) {
      console.error('Magic link error:', error);
      return NextResponse.json({ error: 'Failed to send magic link' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Magic link request error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
