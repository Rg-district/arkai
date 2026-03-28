'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

type Stats = {
  totalSmsSent: number;
  totalRated: number;
  googleRedirects: number;
  ratingBreakdown: Record<number, number>;
  positiveCount: number;
  negativeCount: number;
};

type Feedback = {
  phone: string;
  rating: number;
  feedback: string | null;
  visitedAt: string;
};

type DashboardData = {
  restaurant: { id: string; name: string; status: string; googleUrl: string | null };
  stats: Stats;
  recentFeedback: Feedback[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [smsPhone, setSmsPhone] = useState('');
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push('/login');
        return;
      }

      setToken(session.access_token);

      const res = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        setData(await res.json());
      }
      setLoading(false);
    });
  }, [router]);

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !token) return;
    setSmsSending(true);
    setSmsResult('');

    try {
      const res = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          restaurant_id: data.restaurant.id,
          customer_phone: smsPhone,
        }),
      });

      if (res.ok) {
        setSmsResult('SMS sent successfully!');
        setSmsPhone('');
      } else {
        setSmsResult('Failed to send SMS. Please try again.');
      }
    } catch {
      setSmsResult('Error sending SMS.');
    } finally {
      setSmsSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/50">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-white/50">Could not load dashboard.</p>
      </div>
    );
  }

  const { restaurant, stats, recentFeedback } = data;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-white/40 mb-1">arkai dashboard</div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full ${
            restaurant.status === 'active' ? 'bg-green-500/20 text-green-400' :
            restaurant.status === 'trial' ? 'bg-blue-500/20 text-blue-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {restaurant.status}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="SMS Sent" value={stats.totalSmsSent} />
          <StatCard label="Reviews Captured" value={stats.totalRated} />
          <StatCard label="Google Redirects" value={stats.googleRedirects} />
          <StatCard label="Private Feedback" value={stats.negativeCount} />
        </div>

        {/* Rating breakdown */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-4">Rating Breakdown</h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = stats.ratingBreakdown[r] || 0;
              const pct = stats.totalRated > 0 ? (count / stats.totalRated) * 100 : 0;
              return (
                <div key={r} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-white/60">{r}★</span>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${r >= 4 ? 'bg-green-500' : r === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-white/40">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual SMS trigger */}
        <div className="bg-[#141414] border border-white/10 rounded-xl p-5 mb-6">
          <h2 className="font-semibold mb-3">Send Review Request SMS</h2>
          <form onSubmit={handleSendSms} className="flex gap-3">
            <input
              type="tel"
              required
              value={smsPhone}
              onChange={(e) => setSmsPhone(e.target.value)}
              placeholder="+44 7XXX XXXXXX"
              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white text-sm"
            />
            <button
              type="submit"
              disabled={smsSending}
              className="px-5 py-2 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 text-sm"
            >
              {smsSending ? 'Sending...' : 'Send SMS'}
            </button>
          </form>
          {smsResult && <p className={`text-sm mt-2 ${smsResult.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{smsResult}</p>}
        </div>

        {/* Recent private feedback */}
        {recentFeedback.length > 0 && (
          <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
            <h2 className="font-semibold mb-4">Recent Private Feedback</h2>
            <div className="space-y-3">
              {recentFeedback.map((f, i) => (
                <div key={i} className="border border-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white/40">{f.phone}</span>
                    <span className="text-sm font-semibold">{f.rating}★</span>
                  </div>
                  {f.feedback && <p className="text-sm text-white/70">{f.feedback}</p>}
                  <p className="text-xs text-white/30 mt-1">{new Date(f.visitedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-4">
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}
