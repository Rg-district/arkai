'use client'
import { useState } from 'react'

const PRODUCTS = [
  {
    icon: '⭐',
    name: 'Review Autopilot',
    tagline: 'Turn every meal into a 5-star review.',
    description: 'Automated post-visit SMS/email sequences that get your happy customers to Google, TripAdvisor, and Deliveroo — without you lifting a finger.',
    results: '+47 reviews in 30 days (avg)',
    price: '£249/mo',
  },
  {
    icon: '📲',
    name: 'Lead Follow-Up',
    tagline: 'Never lose a booking enquiry again.',
    description: 'Instant AI-powered responses to every enquiry — WhatsApp, email, phone. Qualifies, books, and follows up automatically while you\'re in service.',
    results: '3x more bookings converted',
    price: '£299/mo',
  },
  {
    icon: '📅',
    name: 'Social Autopilot',
    tagline: 'Consistent presence. Zero effort.',
    description: 'We build your content calendar and auto-schedule posts across Instagram and Facebook. Weekly specials, events, and promotions — automated.',
    results: '2-3x more reach. No agency fees.',
    price: '£199/mo',
  },
]

const RESULTS = [
  { stat: '47+', label: 'New reviews per month (avg)' },
  { stat: '3x', label: 'More bookings from enquiries' },
  { stat: '£0', label: 'Extra staff time required' },
  { stat: '14 days', label: 'To see results' },
]

export default function Home() {
  const [form, setForm] = useState({ name: '', restaurant: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#0a0a0a', color: '#f5f5f5', minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)', zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px' }}>
          <span style={{ color: '#6366f1' }}>ark</span>ai
        </div>
        <a href="#contact" style={{ background: '#6366f1', color: '#fff', padding: '10px 22px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          Get a free audit →
        </a>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#1a1a2e', border: '1px solid #6366f1', borderRadius: 100, padding: '6px 16px', fontSize: 13, color: '#818cf8', marginBottom: 32, fontWeight: 500 }}>
          AI automation for UK restaurants
        </div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: '-2px' }}>
          Your restaurant runs.<br />
          <span style={{ color: '#6366f1' }}>Arkai handles the rest.</span>
        </h1>
        <p style={{ fontSize: 20, color: '#888', lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
          Automated reviews, booking follow-ups, and social media — set up in a week, running in the background while you focus on the food.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contact" style={{ background: '#6366f1', color: '#fff', padding: '16px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>
            Get your free audit
          </a>
          <a href="#products" style={{ background: '#111', color: '#f5f5f5', padding: '16px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 16, border: '1px solid #222' }}>
            See how it works
          </a>
        </div>
      </section>

      {/* RESULTS STRIP */}
      <section style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '40px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {RESULTS.map(r => (
            <div key={r.stat} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#6366f1', letterSpacing: '-1px' }}>{r.stat}</div>
              <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>{r.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Three tools. One monthly fee.
          </h2>
          <p style={{ color: '#666', fontSize: 17 }}>Mix and match. Cancel anytime.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {PRODUCTS.map(p => (
            <div key={p.name} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.icon}</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 14, color: '#6366f1', fontWeight: 600, marginBottom: 16 }}>{p.tagline}</div>
              <p style={{ color: '#888', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>{p.description}</p>
              <div style={{ background: '#0d0d0d', border: '1px solid #2a2a2a', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#4ade80', marginBottom: 24 }}>
                ✓ {p.results}
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{p.price}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>No setup fee · Cancel anytime</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '100px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 64 }}>
            Live in 7 days. Zero faff.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, textAlign: 'left' }}>
            {[
              { step: '01', title: 'Free audit call', desc: 'We review your current setup — reviews, enquiries, social — and identify the biggest wins. Takes 20 minutes.' },
              { step: '02', title: 'We build it for you', desc: 'No software to learn. We set up all automations, connect your accounts, and write all the copy.' },
              { step: '03', title: 'It runs in the background', desc: 'From day one, reviews get requested, enquiries get answered, posts go out. You just watch the numbers.' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#6366f1', minWidth: 32, paddingTop: 4 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ maxWidth: 560, margin: '0 auto', padding: '100px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
            Get your free restaurant audit
          </h2>
          <p style={{ color: '#666', fontSize: 16 }}>
            We&apos;ll review your online presence and show you exactly where you&apos;re losing revenue. No pitch. No pressure.
          </p>
        </div>

        {submitted ? (
          <div style={{ background: '#0d1a0d', border: '1px solid #166534', borderRadius: 16, padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>We&apos;ll be in touch within 2 hours.</div>
            <div style={{ color: '#666', fontSize: 15 }}>Check your email for confirmation.</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 16, padding: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'name', placeholder: 'Your name', type: 'text' },
              { key: 'restaurant', placeholder: 'Restaurant name', type: 'text' },
              { key: 'email', placeholder: 'Email address', type: 'email' },
              { key: 'phone', placeholder: 'Phone number (optional)', type: 'tel' },
            ].map(f => (
              <input
                key={f.key}
                type={f.type}
                placeholder={f.placeholder}
                required={f.key !== 'phone'}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: 10, padding: '14px 16px', color: '#f5f5f5', fontSize: 15, outline: 'none' }}
              />
            ))}
            <button type="submit" disabled={loading} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, padding: '16px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>
              {loading ? 'Sending...' : 'Book my free audit →'}
            </button>
            <p style={{ color: '#444', fontSize: 12, textAlign: 'center', margin: 0 }}>
              No spam. No obligation. We respond within 2 hours.
            </p>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          <span style={{ color: '#6366f1' }}>ark</span>ai
        </div>
        <div style={{ color: '#444', fontSize: 13 }}>
          AI automation for UK restaurants · arkaihq.com
        </div>
      </footer>
    </main>
  )
}
