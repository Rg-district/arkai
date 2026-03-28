import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function twimlResponse(message: string): NextResponse {
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`;
  return new NextResponse(xml, {
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get('From') as string;
    const body = (formData.get('Body') as string || '').trim();
    const twilioSid = formData.get('MessageSid') as string;

    if (!from || !body) {
      return twimlResponse('Sorry, we could not process your response.');
    }

    // Parse rating from message body (look for 1-5)
    const ratingMatch = body.match(/[1-5]/);
    const rating = ratingMatch ? parseInt(ratingMatch[0]) : null;

    // Find the most recent customer record for this phone number that hasn't received a rating yet
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .select('id, restaurant_id, sms_sent_at')
      .eq('phone', from)
      .is('rating', null)
      .not('sms_sent_at', 'is', null)
      .order('sms_sent_at', { ascending: false })
      .limit(1)
      .single();

    if (customerError || !customer) {
      return twimlResponse('Thanks for your message!');
    }

    // Log inbound SMS
    await supabaseAdmin.from('sms_logs').insert({
      customer_id: customer.id,
      twilio_sid: twilioSid,
      status: 'received',
      direction: 'inbound',
      body,
    });

    if (rating === null) {
      return twimlResponse('Thanks! Please reply with a number 1-5 to rate your experience (5 = amazing!).');
    }

    // Fetch restaurant for context
    const { data: restaurant } = await supabaseAdmin
      .from('restaurants')
      .select('name, google_url')
      .eq('id', customer.restaurant_id)
      .single();

    if (rating >= 4) {
      // Positive: update rating, set redirect timestamp, send Google review link
      await supabaseAdmin
        .from('customers')
        .update({
          rating,
          google_redirect_at: new Date().toISOString(),
        })
        .eq('id', customer.id);

      const googleUrl = restaurant?.google_url || `https://search.google.com/local/reviews?q=${encodeURIComponent(restaurant?.name || '')}`;
      return twimlResponse(`That's wonderful, thank you! 🌟 We'd love if you could share your experience on Google — it only takes 30 seconds and helps us a lot: ${googleUrl}`);
    } else {
      // Negative: save privately, notify restaurant via SMS
      await supabaseAdmin
        .from('customers')
        .update({ rating, feedback: body })
        .eq('id', customer.id);

      // Notify restaurant owner
      if (restaurant) {
        const { data: restaurantData } = await supabaseAdmin
          .from('restaurants')
          .select('phone')
          .eq('id', customer.restaurant_id)
          .single();

        if (restaurantData?.phone) {
          try {
            await twilioClient.messages.create({
              body: `[Arkai Alert] A customer rated their visit ${rating}/5 at ${restaurant.name}. Their feedback: "${body}". Log in to your dashboard to follow up.`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: restaurantData.phone,
            });
          } catch (err) {
            console.error('Failed to notify restaurant:', err);
          }
        }
      }

      return twimlResponse(`Thank you for the honest feedback — it really helps us improve! We've passed this on to the team. We hope to do better next time and welcome you back soon. 🙏`);
    }
  } catch (err) {
    console.error('SMS response handler error:', err);
    return twimlResponse('Sorry, something went wrong. Please try again later.');
  }
}
