'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const plans = [
  {
    name: 'Standard',
    price: 139,
    priceId: 'price_1TAd3oEL6yquQGHSFWHuuBOQ',
    features: [
      '200 SMS per month',
      'Review request automation',
      'Basic dashboard',
      'Monthly performance report',
      'Email support (48hr response)',
    ],
    notIncluded: [
      'AI review responses',
      'Negative review interception',
      'Competitor monitoring',
    ],
  },
  {
    name: 'Premium',
    price: 249,
    priceId: 'price_1TAd3xEL6yquQGHS7fZdxLD3',
    popular: true,
    features: [
      'Unlimited SMS',
      'Review request automation',
      'AI-powered review responses',
      'Negative review interception',
      'Competitor monitoring dashboard',
      'Weekly performance reports',
      'Priority support (same-day)',
      'White-label SMS',
      'Multi-location support',
    ],
    notIncluded: [],
  },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const restaurant = searchParams.get('restaurant') || '';
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (priceId: string) => {
    setLoading(priceId);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          customerEmail: email || 'test@example.com',
          restaurantName: restaurant || 'Test Restaurant',
        }),
      });

      const { url, error } = await res.json();

      if (error) {
        alert('Something went wrong. Please try again.');
        setLoading(null);
        return;
      }

      window.location.href = url;
    } catch (err) {
      alert('Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-white/60 text-lg">
          Start with a 14-day free trial — try our system and see if it works for you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-[#141414] border rounded-2xl p-8 ${
              plan.popular
                ? 'border-white/30 ring-1 ring-white/10'
                : 'border-white/10'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}

            <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">£{plan.price}</span>
              <span className="text-white/40">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
              {plan.notIncluded.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <span className="text-white/20 mt-0.5">✗</span>
                  <span className="text-white/30">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan.priceId)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-white text-black hover:bg-white/90'
                  : 'bg-white/10 text-white hover:bg-white/20'
              } disabled:opacity-50`}
            >
              {loading === plan.priceId ? 'Loading...' : 'Start 14-Day Free Trial'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-white/40 mt-8">
        You won&apos;t be charged until your trial ends. Cancel anytime.
      </p>
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-16 px-4">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <PricingContent />
      </Suspense>
    </div>
  );
}
