'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Welcome to Arkai!</h1>
        <p className="text-white/60 mb-8">
          Your 14-day free trial has started. We&apos;ll send you an email with next steps to get your review system up and running.
        </p>
        
        <div className="bg-[#141414] border border-white/10 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4">What happens next:</h2>
          <ol className="space-y-3 text-sm text-white/70">
            <li className="flex gap-3">
              <span className="text-white/30">1.</span>
              <span>Check your email for your login credentials</span>
            </li>
            <li className="flex gap-3">
              <span className="text-white/30">2.</span>
              <span>Complete the 5-minute setup wizard</span>
            </li>
            <li className="flex gap-3">
              <span className="text-white/30">3.</span>
              <span>Start collecting reviews automatically</span>
            </li>
          </ol>
        </div>

        <p className="text-sm text-white/40 mb-6">
          Questions? Email us at{' '}
          <a href="mailto:hello@arkaihq.com" className="text-white/60 hover:text-white">
            hello@arkaihq.com
          </a>
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
