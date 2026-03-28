import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { restaurantName, contactName, email, phone, googleUrl } = await req.json();

    if (!restaurantName || !contactName || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert restaurant — idempotent if same email signs up twice
    const { data, error } = await supabaseAdmin
      .from('restaurants')
      .upsert(
        {
          name: restaurantName,
          contact_name: contactName,
          email: email.toLowerCase().trim(),
          phone,
          google_url: googleUrl || null,
          status: 'trial',
        },
        { onConflict: 'email' }
      )
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error saving restaurant:', error);
      return NextResponse.json({ error: 'Failed to save restaurant' }, { status: 500 });
    }

    return NextResponse.json({ success: true, restaurantId: data.id });
  } catch (err) {
    console.error('Trial signup error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
