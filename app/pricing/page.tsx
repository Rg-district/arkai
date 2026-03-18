'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type BillingCycle = 'monthly' | '6month' | '12month-monthly' | '12month-annual';

const plans = [
  {
    name: 'Standard',
    monthlyPrice: 139,
    prices: {
      monthly: { amount: 139, priceId: 'price_1TAd3oEL6yquQGHSFWHuuBOQ', label: '£139/month', sublabel: 'No commitment' },
      '6month': { amount: 695, priceId: 'price_standard_6month', label: '£695 upfront', sublabel: '6 months (1st month free)' },
      '12month-monthly': { amount: 111, priceId: 'price_standard_12month_monthly', label: '£111/month', sublabel: '12-month commitment (20% off)' },
      '12month-annual': { amount: 1334, priceId: 'price_standard_12month_annual', label: '£1,334 upfront', sublabel: '12 months (20% off)' },
    },
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
    monthlyPrice: 249,
    prices: {
      monthly: { amount: 249, priceId: 'price_1TAd3xEL6yquQGHS7fZdxLD3', label: '£249/month', sublabel: 'No commitment' },
      '6month': { amount: 1245, priceId: 'price_premium_6month', label: '£1,245 upfront', sublabel: '6 months (1st month free)' },
      '12month-monthly': { amount: 199, priceId: 'price_premium_12month_monthly', label: '£199/month', sublabel: '12-month commitment (20% off)' },
      '12month-annual': { amount: 2390, priceId: 'price_premium_12month_annual', label: '£2,390 upfront', sublabel: '12 months (20% off)' },
    },
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

const billingOptions: { value: BillingCycle; label: string; badge?: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: '6month', label: '6 Months', badge: '1 month free' },
  { value: '12month-monthly', label: '12 Months', badge: '20% off' },
  { value: '12month-annual', label: 'Annual (upfront)', badge: '20% off' },
];

function PricingContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const restaurant = searchParams.get('restaurant') || '';
  const [loading, setLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-white/60 text-lg">
          Start with a 14-day free trial — try our system and see if it works for you
        </p>
      </div>

      {/* Billing Cycle Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {billingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setBillingCycle(option.value)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === option.value
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {option.label}
            {option.badge && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                billingCycle === option.value
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500/20 text-green-400'
              }`}>
                {option.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const currentPrice = plan.prices[billingCycle];
          return (
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
              <div className="mb-1">
                <span className="text-3xl font-bold">{currentPrice.label}</span>
              </div>
              <p className="text-white/40 text-sm mb-6">{currentPrice.sublabel}</p>

              {billingCycle !== 'monthly' && (
                <p className="text-green-400 text-sm mb-4">
                  {billingCycle === '6month' 
                    ? `Save £${plan.monthlyPrice} (1 month free)` 
                    : `Save £${Math.round(plan.monthlyPrice * 12 * 0.2)}/year (20% off)`}
                </p>
              )}

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
                onClick={() => handleSelectPlan(currentPrice.priceId)}
                disabled={loading !== null}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } disabled:opacity-50`}
              >
                {loading === currentPrice.priceId ? 'Loading...' : 'Start 14-Day Free Trial'}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-white/40 mt-8">
        You won&apos;t be charged until your trial ends. Cancel anytime during trial.
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
