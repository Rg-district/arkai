import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: NextRequest) {
  try {
    const { restaurant_id, customer_phone, visit_time } = await req.json();

    if (!restaurant_id || !customer_phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch restaurant details
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('id, name, status, google_url')
      .eq('id', restaurant_id)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (restaurant.status !== 'active' && restaurant.status !== 'trial') {
      return NextResponse.json({ error: 'Restaurant account is not active' }, { status: 403 });
    }

    const visitedAt = visit_time ? new Date(visit_time) : new Date();

    // Create customer record
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .insert({
        restaurant_id,
        phone: customer_phone,
        visited_at: visitedAt.toISOString(),
      })
      .select('id')
      .single();

    if (customerError || !customer) {
      console.error('Failed to create customer:', customerError);
      return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 });
    }

    const sendSms = async () => {
      const message = `Hi! Thanks for visiting ${restaurant.name}. How was your experience? Reply with a number 1-5 (5 = amazing!) 🌟`;

      try {
        const twilioMsg = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: customer_phone,
        });

        await supabaseAdmin.from('customers').update({ sms_sent_at: new Date().toISOString() }).eq('id', customer.id);

        await supabaseAdmin.from('sms_logs').insert({
          customer_id: customer.id,
          twilio_sid: twilioMsg.sid,
          status: twilioMsg.status,
          direction: 'outbound',
          body: message,
        });
      } catch (err) {
        console.error('Failed to send SMS:', err);
        await supabaseAdmin.from('sms_logs').insert({
          customer_id: customer.id,
          status: 'failed',
          direction: 'outbound',
          body: message,
        });
      }
    };

    // If visit_time is provided and is in the future (accounting for 30-min delay), schedule it
    // Otherwise send immediately (for manual triggers or past visits)
    const delayMs = 30 * 60 * 1000;
    const scheduledTime = visitedAt.getTime() + delayMs;
    const now = Date.now();

    if (scheduledTime > now) {
      setTimeout(sendSms, scheduledTime - now);
      return NextResponse.json({ success: true, customerId: customer.id, scheduled: true, sendAt: new Date(scheduledTime).toISOString() });
    } else {
      await sendSms();
      return NextResponse.json({ success: true, customerId: customer.id, scheduled: false });
    }
  } catch (err) {
    console.error('SMS send error:', err);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
