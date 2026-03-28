import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get restaurant for this user
    const { data: restaurant, error: restaurantError } = await supabaseAdmin
      .from('restaurants')
      .select('*')
      .eq('email', user.email!)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Fetch all customers for this restaurant
    const { data: customers } = await supabaseAdmin
      .from('customers')
      .select('id, rating, sms_sent_at, google_redirect_at, feedback, visited_at, phone')
      .eq('restaurant_id', restaurant.id)
      .order('visited_at', { ascending: false });

    const allCustomers = customers || [];
    const sentCount = allCustomers.filter((c) => c.sms_sent_at).length;
    const ratedCount = allCustomers.filter((c) => c.rating !== null).length;
    const googleRedirects = allCustomers.filter((c) => c.google_redirect_at).length;
    const positiveFeedback = allCustomers.filter((c) => c.rating !== null && c.rating >= 4);
    const negativeFeedback = allCustomers.filter((c) => c.rating !== null && c.rating <= 3);

    const ratingBreakdown = [1, 2, 3, 4, 5].reduce((acc, r) => {
      acc[r] = allCustomers.filter((c) => c.rating === r).length;
      return acc;
    }, {} as Record<number, number>);

    return NextResponse.json({
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
        status: restaurant.status,
        googleUrl: restaurant.google_url,
      },
      stats: {
        totalSmsSent: sentCount,
        totalRated: ratedCount,
        googleRedirects,
        ratingBreakdown,
        positiveCount: positiveFeedback.length,
        negativeCount: negativeFeedback.length,
      },
      recentFeedback: negativeFeedback.slice(0, 10).map((c) => ({
        phone: c.phone.slice(0, -4) + '****',
        rating: c.rating,
        feedback: c.feedback,
        visitedAt: c.visited_at,
      })),
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
