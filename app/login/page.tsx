'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });

      if (authError) {
        setError('Could not send login link. Please try again.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-3xl font-bold mb-2">arkai</div>
          <h1 className="text-xl font-semibold mb-2">Sign in to your dashboard</h1>
          <p className="text-white/50 text-sm">We&apos;ll send you a magic link — no password needed.</p>
        </div>

        {sent ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-semibold mb-2">Check your inbox</p>
            <p className="text-white/60 text-sm">We sent a login link to <strong>{email}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-white"
                placeholder="you@restaurant.com"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send magic link →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
