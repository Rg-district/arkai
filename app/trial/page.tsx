'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TrialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    restaurantName: '',
    contactName: '',
    email: '',
    phone: '',
    googleUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch('/api/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch {
      // Non-fatal — still proceed to pricing
    }

    router.push(`/pricing?email=${encodeURIComponent(form.email)}&restaurant=${encodeURIComponent(form.restaurantName)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Start Your Free Trial</h1>
          <p className="text-white/60">14 days free — try our system and see if it works for you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1">Restaurant Name</label>
            <input
              type="text"
              required
              value={form.restaurantName}
              onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
              placeholder="e.g., The Golden Fork"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Your Name</label>
            <input
              type="text"
              required
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
              placeholder="e.g., John Smith"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
              placeholder="you@restaurant.com"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
              placeholder="+44 7XXX XXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1">Google Business URL (optional)</label>
            <input
              type="url"
              value={form.googleUrl}
              onChange={(e) => setForm({ ...form, googleUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
              placeholder="https://g.page/your-restaurant"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 mt-6"
          >
            {loading ? 'Loading...' : 'Continue to Select Plan →'}
          </button>

          <p className="text-center text-xs text-white/40 mt-4">
            14-day free trial • Cancel anytime • No commitment
          </p>
        </form>
      </div>
    </div>
  );
}
