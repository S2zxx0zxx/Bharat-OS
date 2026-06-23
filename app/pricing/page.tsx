import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — BharatOS',
  description: 'Simple, transparent pricing. Start free, upgrade when you need more.',
}

const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    desc: 'Sab kuch try karo — koi card nahi chahiye.',
    features: [
      '10 questions per day',
      'All 6 AI modules',
      'Hindi + Hinglish + English',
      'Voice input',
      'Helpline numbers',
      'Official portal links',
    ],
    cta: 'Get Started Free',
    href: '/chat',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '₹199',
    period: 'per month',
    desc: 'Power users ke liye — unlimited access.',
    features: [
      'Unlimited questions',
      'All 6 AI modules',
      'Priority AI responses',
      'Voice input + TTS',
      'Download answers as PDF',
      'Early access to new features',
      'Email support',
    ],
    cta: 'Start Free Trial',
    href: '/chat',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'NGOs, govt bodies, large organizations ke liye.',
    features: [
      'Everything in Pro',
      'API access',
      'Custom AI modules',
      'White-label option',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Us',
    href: 'mailto:hello@bharatos.in',
    highlight: false,
  },
]

const faqs = [
  {
    q: 'Free plan mein kya include hai?',
    a: 'Free plan mein 10 sawaal/day, saare 6 AI modules, Hindi/Hinglish/English support, aur voice input milta hai. Koi credit card nahi chahiye.',
  },
  {
    q: 'Pro plan cancel kar sakte hain?',
    a: 'Haan, kabhi bhi cancel kar sakte hain. Koi hidden charges nahi hain. Cancel karne pe aapka Pro access billing cycle ke end tak rahega.',
  },
  {
    q: 'Kya data secure hai?',
    a: 'Bilkul. Aapka Aadhaar, PAN, phone number — sab automatically redact hota hai. Koi personal data store nahi karte.',
  },
  {
    q: 'Enterprise ke liye minimum users kya hain?',
    a: 'Enterprise plan 50+ users ke liye designed hai. NGOs aur govt bodies ke liye special rates available hain.',
  },
]

export default function PricingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #141414; color: #FFFFFF; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 64px; background: rgba(20,20,20,0.85);
          backdrop-filter: blur(20px); border-bottom: 1px solid #2E2E2E;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
        }
        .nav-logo { font-size: 1.3rem; font-weight: 800; text-decoration: none; color: #FFFFFF; letter-spacing: -0.04em; }
        .logo-os { color: #FF6B00; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link { color: #A3A3A3; text-decoration: none; font-size: 0.9rem; padding: 8px 16px; border-radius: 9999px; transition: color 200ms, background 200ms; }
        .nav-link:hover { color: #FFFFFF; background: #2A2A2A; }
        .btn-primary { background: #FFFFFF; color: #000000; border: none; border-radius: 9999px; padding: 0 22px; height: 40px; font-size: 0.88rem; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; transition: transform 200ms; }
        .btn-primary:hover { transform: scale(1.02); }

        .pricing-hero { padding: 120px 24px 60px; text-align: center; }
        .pricing-label { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #FF6B00; margin-bottom: 16px; }
        .pricing-title { font-family: 'Playfair Display', Georgia, serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 20px; }
        .pricing-subtitle { font-size: 1.1rem; color: #A3A3A3; line-height: 1.7; max-width: 500px; margin: 0 auto; }

        .plans-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; max-width: 1100px; margin: 60px auto; padding: 0 24px;
        }
        @media (max-width: 768px) { .plans-grid { grid-template-columns: 1fr; max-width: 480px; } }

        .plan-card {
          background: #1E1E1E; border: 1px solid #2E2E2E;
          border-radius: 24px; padding: 36px 28px;
          display: flex; flex-direction: column; gap: 0;
          position: relative;
        }
        .plan-card.highlighted {
          background: #1E1E1E;
          border-color: #FF6B00;
          box-shadow: 0 0 0 1px #FF6B00, 0 24px 60px rgba(255,107,0,0.12);
        }
        .plan-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: #FF6B00; color: #FFFFFF;
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 4px 16px; border-radius: 9999px;
          white-space: nowrap;
        }
        .plan-name { font-size: 1rem; font-weight: 600; color: #A3A3A3; margin-bottom: 12px; }
        .plan-price { font-family: 'Playfair Display', Georgia, serif; font-size: 3.5rem; font-weight: 900; line-height: 1; margin-bottom: 4px; }
        .plan-period { font-size: 0.85rem; color: #666666; margin-bottom: 12px; }
        .plan-desc { font-size: 0.9rem; color: #A3A3A3; line-height: 1.6; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid #2E2E2E; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; flex: 1; }
        .plan-feature { font-size: 0.9rem; color: #D4D4D4; display: flex; align-items: flex-start; gap: 10px; }
        .feature-check { color: #FF6B00; font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
        .plan-cta {
          display: block; text-align: center; text-decoration: none;
          border-radius: 9999px; padding: 14px 24px;
          font-size: 0.95rem; font-weight: 700;
          transition: transform 200ms, box-shadow 200ms, background 200ms;
        }
        .plan-cta-primary { background: #FFFFFF; color: #000000; }
        .plan-cta-primary:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(255,255,255,0.15); }
        .plan-cta-secondary { background: transparent; color: #FFFFFF; border: 1.5px solid #383838; }
        .plan-cta-secondary:hover { border-color: #FFFFFF; background: rgba(255,255,255,0.04); }

        .faq-section { max-width: 720px; margin: 0 auto; padding: 40px 24px 100px; }
        .faq-title { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; font-weight: 900; margin-bottom: 40px; text-align: center; }
        .faq-item { border-top: 1px solid #2E2E2E; padding: 24px 0; }
        .faq-q { font-size: 1rem; font-weight: 600; margin-bottom: 12px; }
        .faq-a { font-size: 0.9rem; color: #A3A3A3; line-height: 1.7; }

        .footer-simple { border-top: 1px solid #2E2E2E; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; }
        .footer-copy { font-size: 0.82rem; color: #666666; }
        .footer-link { font-size: 0.82rem; color: #A3A3A3; text-decoration: none; }
        .footer-link:hover { color: #FFFFFF; }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">Bharat<span className="logo-os">OS</span></a>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <Link href="/chat" className="btn-primary">Try Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <div className="pricing-hero">
        <div className="pricing-label">Pricing</div>
        <h1 className="pricing-title">Simple, Transparent<br />Pricing</h1>
        <p className="pricing-subtitle">
          Free se shuru karo. Jab zaroorat ho tab upgrade karo. Koi hidden charges nahi.
        </p>
      </div>

      {/* PLANS */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-card ${plan.highlight ? 'highlighted' : ''}`}>
            {plan.highlight && <div className="plan-badge">Most Popular</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">{plan.price}</div>
            <div className="plan-period">{plan.period}</div>
            <div className="plan-desc">{plan.desc}</div>
            <ul className="plan-features">
              {plan.features.map((f) => (
                <li key={f} className="plan-feature">
                  <span className="feature-check">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`plan-cta ${plan.highlight ? 'plan-cta-primary' : 'plan-cta-secondary'}`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        {faqs.map((faq) => (
          <div key={faq.q} className="faq-item">
            <div className="faq-q">{faq.q}</div>
            <div className="faq-a">{faq.a}</div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="footer-simple">
        <div className="footer-copy">© 2026 BharatOS</div>
        <a href="/" className="footer-link">← Back to Home</a>
      </footer>
    </>
  )
}
