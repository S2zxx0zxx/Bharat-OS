import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'BharatOS — India Ka AI, Har Sawaal Ka Jawab',
  description: 'Legal help, Govt schemes, Health, Finance, Agriculture, Education — sab ek jagah. Gaon se shahar tak, sabke liye. Free mein.',
}

const modules = [
  { emoji: '⚖️', name: 'NyayBot', desc: 'Legal help & Rights', color: '#7C3AED' },
  { emoji: '🏛️', name: 'JanSeva', desc: 'Govt Schemes & Benefits', color: '#0369A1' },
  { emoji: '🏥', name: 'Swasthya', desc: 'Health & Medicine', color: '#059669' },
  { emoji: '💰', name: 'Dhan', desc: 'Finance & Investment', color: '#B45309' },
  { emoji: '🌾', name: 'Kisan', desc: 'Agriculture & Farming', color: '#65A30D' },
  { emoji: '📚', name: 'Gyaan', desc: 'Education & Career', color: '#DB2777' },
]

const stats = [
  { number: '6', label: 'AI Modules' },
  { number: '3', label: 'Languages' },
  { number: '100%', label: 'Free to Start' },
  { number: '24/7', label: 'Available' },
]

const steps = [
  { n: '01', title: 'Choose Topic', desc: 'Select from 6 expert AI modules — Legal, Health, Finance, and more.' },
  { n: '02', title: 'Ask in Hindi', desc: 'Type your question in Hindi, Hinglish, or English — jo aapko comfortable lage.' },
  { n: '03', title: 'Get Expert Help', desc: 'Instant AI-powered answers with helpline numbers and official links.' },
]

const testimonials = [
  {
    name: 'Ramesh Kumar',
    location: 'Farmer, Bihar',
    module: '🌾 Kisan',
    text: 'PM Fasal Bima ka claim process samajh nahi aata tha. BharatOS ne step by step sab bataya — pehli baar successfully claim mila.',
  },
  {
    name: 'Priya Sharma',
    location: 'Student, Lucknow',
    module: '📚 Gyaan',
    text: 'NSP scholarship ke liye apply karna tha. BharatOS ne documents list se leke form filling tak sab guide kiya. Scholarship mil gayi!',
  },
  {
    name: 'Vikram Singh',
    location: 'Shop Owner, Delhi',
    module: '⚖️ NyayBot',
    text: 'Cheque bounce case mein kya karna hai bilkul pata nahi tha. NyayBot ne legal steps clearly explain kiye — vakil ki zaroorat nahi padi.',
  },
]

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', background: '#141414' }}>
      {/* ─── INLINE STYLES ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #141414;
          color: #FFFFFF;
          font-family: 'Inter', system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: 64px;
          background: rgba(20,20,20,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #2E2E2E;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 10px;
          font-size: 1.3rem; font-weight: 800; letter-spacing: -0.04em;
          text-decoration: none; color: #FFFFFF;
        }
        .nav-logo-flag {
          width: 26px; height: 18px; border-radius: 3px; overflow: hidden;
          display: flex; flex-direction: column;
        }
        .flag-s { flex: 1; }
        .flag-sf { background: #FF9933; }
        .flag-sw { background: #FFFFFF; display: flex; align-items: center; justify-content: center; }
        .flag-sg { background: #138808; }
        .flag-dot { width: 5px; height: 5px; border-radius: 50%; background: #000080; }
        .logo-os { color: #FF6B00; }
        .nav-links {
          display: flex; align-items: center; gap: 8px;
        }
        .nav-link {
          color: #A3A3A3; text-decoration: none; font-size: 0.9rem;
          padding: 8px 16px; border-radius: 9999px;
          transition: color 200ms, background 200ms;
        }
        .nav-link:hover { color: #FFFFFF; background: #2A2A2A; }
        .btn-primary {
          background: #FFFFFF; color: #000000;
          border: none; border-radius: 9999px;
          padding: 0 22px; height: 40px; font-size: 0.88rem; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center;
          transition: transform 200ms, box-shadow 200ms;
        }
        .btn-primary:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(255,255,255,0.15); }
        .btn-secondary {
          background: transparent; color: #FFFFFF;
          border: 1.5px solid #FFFFFF; border-radius: 9999px;
          padding: 0 22px; height: 40px; font-size: 0.88rem; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center;
          transition: transform 200ms, background 200ms;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.06); transform: scale(1.02); }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 80px 24px 60px;
          position: relative; overflow: hidden;
        }
        .particles-container {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .particle {
          position: absolute; width: 2px; height: 2px; border-radius: 50%;
          animation: particle-float linear infinite;
          opacity: 0.6;
        }
        @keyframes particle-float {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          10%  { opacity: 0.7; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,107,0,0.12); border: 1px solid rgba(255,107,0,0.25);
          border-radius: 9999px; padding: 6px 16px;
          font-size: 0.8rem; font-weight: 600; color: #FF6B00;
          margin-bottom: 32px;
          animation: fade-up 0.6s ease both;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900; line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: fade-up 0.6s 0.1s ease both;
        }
        .hero-title-accent { color: #FF6B00; }
        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          color: #A3A3A3; line-height: 1.7;
          max-width: 580px; margin: 0 auto 40px;
          animation: fade-up 0.6s 0.2s ease both;
        }
        .hero-buttons {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap; justify-content: center;
          animation: fade-up 0.6s 0.3s ease both;
        }
        .hero-btn-primary {
          background: #FFFFFF; color: #000000; border: none;
          border-radius: 9999px; padding: 0 32px; height: 52px;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
          transition: transform 200ms, box-shadow 200ms;
        }
        .hero-btn-primary:hover { transform: scale(1.03); box-shadow: 0 8px 32px rgba(255,255,255,0.2); }
        .hero-btn-secondary {
          background: transparent; color: #FFFFFF;
          border: 1.5px solid rgba(255,255,255,0.4); border-radius: 9999px;
          padding: 0 32px; height: 52px;
          font-size: 1rem; font-weight: 600; cursor: pointer;
          text-decoration: none; display: inline-flex; align-items: center;
          transition: transform 200ms, border-color 200ms, background 200ms;
        }
        .hero-btn-secondary:hover { border-color: #FFFFFF; background: rgba(255,255,255,0.05); transform: scale(1.02); }
        .hero-scroll-hint {
          margin-top: 64px; color: #666666; font-size: 0.8rem;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          animation: fade-up 0.6s 0.5s ease both;
        }
        .scroll-dot {
          width: 1px; height: 40px; background: linear-gradient(to bottom, #666666, transparent);
        }

        /* SECTION WRAPPER */
        .section { padding: 100px 24px; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em;
          text-transform: uppercase; color: #FF6B00; margin-bottom: 16px;
        }
        .section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900; line-height: 1.1; letter-spacing: -0.025em;
          margin-bottom: 20px;
        }
        .section-subtitle {
          font-size: 1.05rem; color: #A3A3A3; line-height: 1.7; max-width: 560px;
        }
        .section-divider {
          border: none; border-top: 1px solid #2E2E2E; margin: 0;
        }

        /* STATS */
        .stats-section {
          border-top: 1px solid #2E2E2E; border-bottom: 1px solid #2E2E2E;
          padding: 60px 24px;
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px;
          max-width: 1100px; margin: 0 auto;
        }
        .stat-item { text-align: center; }
        .stat-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3rem; font-weight: 900; line-height: 1;
          color: #FFFFFF; margin-bottom: 8px;
        }
        .stat-label { font-size: 0.9rem; color: #A3A3A3; }
        @media (max-width: 640px) {
          .stats-section { grid-template-columns: repeat(2, 1fr); }
        }

        /* MODULES GRID */
        .modules-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 48px;
        }
        @media (max-width: 768px) { .modules-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .modules-grid { grid-template-columns: 1fr; } }

        .module-card {
          background: #1E1E1E; border: 1px solid #2E2E2E;
          border-radius: 20px; padding: 28px 24px;
          cursor: pointer; text-decoration: none; color: #FFFFFF;
          display: flex; flex-direction: column; gap: 12px;
          transition: background 200ms, border-color 200ms, transform 200ms;
          position: relative; overflow: hidden;
        }
        .module-card:hover {
          background: #242424; transform: translateY(-4px);
        }
        .module-card::before {
          content: '';
          position: absolute; inset: 0; border-radius: 20px;
          background: var(--module-color);
          opacity: 0; transition: opacity 200ms;
        }
        .module-card:hover::before { opacity: 0.04; }
        .module-emoji { font-size: 2rem; line-height: 1; }
        .module-name { font-size: 1.1rem; font-weight: 700; }
        .module-desc { font-size: 0.85rem; color: #A3A3A3; line-height: 1.5; }
        .module-arrow {
          margin-top: auto; font-size: 0.8rem; color: #666666;
          display: flex; align-items: center; gap: 4px;
          transition: color 200ms, gap 200ms;
        }
        .module-card:hover .module-arrow { color: #FFFFFF; gap: 8px; }

        /* HOW IT WORKS */
        .steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 32px; margin-top: 48px;
        }
        @media (max-width: 768px) { .steps-grid { grid-template-columns: 1fr; } }

        .step-card {
          background: #1E1E1E; border: 1px solid #2E2E2E;
          border-radius: 20px; padding: 32px 24px;
        }
        .step-number {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3.5rem; font-weight: 900; color: #2E2E2E;
          line-height: 1; margin-bottom: 20px;
        }
        .step-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 10px; }
        .step-desc { font-size: 0.9rem; color: #A3A3A3; line-height: 1.65; }

        /* TESTIMONIALS */
        .testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 16px; margin-top: 48px;
        }
        @media (max-width: 768px) { .testimonials-grid { grid-template-columns: 1fr; } }

        .testimonial-card {
          background: #1E1E1E; border: 1px solid #2E2E2E;
          border-radius: 20px; padding: 28px 24px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .testimonial-module {
          font-size: 0.75rem; font-weight: 700; color: #FF6B00;
          background: rgba(255,107,0,0.1); border-radius: 9999px;
          padding: 4px 12px; width: fit-content;
        }
        .testimonial-text {
          font-size: 0.92rem; color: #D4D4D4; line-height: 1.7;
          flex: 1;
        }
        .testimonial-author { border-top: 1px solid #2E2E2E; padding-top: 16px; }
        .testimonial-name { font-size: 0.9rem; font-weight: 600; }
        .testimonial-location { font-size: 0.8rem; color: #666666; margin-top: 2px; }

        /* CTA SECTION */
        .cta-section {
          margin: 60px 24px;
          background: #1E1E1E; border: 1px solid #2E2E2E;
          border-radius: 28px; padding: 80px 40px;
          text-align: center;
          position: relative; overflow: hidden;
          max-width: 1052px; margin-left: auto; margin-right: auto;
        }
        .cta-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: conic-gradient(from 180deg at 50% 50%, #FF6B00 0deg, #7C3AED 60deg, #0369A1 120deg, #059669 180deg, #DB2777 240deg, #FF6B00 360deg);
          filter: blur(80px); opacity: 0.08; border-radius: 28px;
        }
        .cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 900; line-height: 1.1; margin-bottom: 16px;
        }
        .cta-subtitle { font-size: 1.05rem; color: #A3A3A3; margin-bottom: 36px; }
        .cta-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* FOOTER */
        .footer {
          border-top: 1px solid #2E2E2E;
          padding: 60px 32px 32px;
          max-width: 1100px; margin: 0 auto;
        }
        .footer-top {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px; margin-bottom: 48px;
        }
        @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 480px) { .footer-top { grid-template-columns: 1fr; } }

        .footer-brand-desc { font-size: 0.9rem; color: #666666; line-height: 1.7; margin-top: 12px; }
        .footer-col-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #666666; margin-bottom: 16px; }
        .footer-link {
          display: block; font-size: 0.875rem; color: #A3A3A3;
          text-decoration: none; margin-bottom: 10px;
          transition: color 150ms;
        }
        .footer-link:hover { color: #FFFFFF; }
        .footer-bottom {
          border-top: 1px solid #2E2E2E; padding-top: 24px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-copy { font-size: 0.82rem; color: #666666; }

        /* MOBILE NAV */
        @media (max-width: 640px) {
          .nav { padding: 0 16px; }
          .nav-links .nav-link { display: none; }
          .hero { padding: 80px 16px 60px; }
          .section { padding: 60px 16px; }
          .cta-section { padding: 48px 24px; margin: 40px 16px; }
          .footer { padding: 48px 16px 24px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <a href="/" className="nav-logo">
          <div className="nav-logo-flag">
            <div className="flag-s flag-sf" />
            <div className="flag-s flag-sw"><div className="flag-dot" /></div>
            <div className="flag-s flag-sg" />
          </div>
          Bharat<span className="logo-os">OS</span>
        </a>
        <div className="nav-links">
          <a href="/#features" className="nav-link">Features</a>
          <a href="/pricing" className="nav-link">Pricing</a>
          <Link href="/chat" className="btn-primary" style={{ height: 38, fontSize: '0.85rem' }}>
            Try Free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        {/* Particles */}
        <div className="particles-container" aria-hidden="true">
          {[
            { x: 10, delay: 0,    dur: 18, color: '#FF6B00' },
            { x: 20, delay: 3,    dur: 22, color: '#138808' },
            { x: 35, delay: 6,    dur: 15, color: '#000080' },
            { x: 48, delay: 1,    dur: 20, color: '#FF6B00' },
            { x: 62, delay: 8,    dur: 25, color: '#138808' },
            { x: 75, delay: 4,    dur: 17, color: '#FF6B00' },
            { x: 88, delay: 11,   dur: 21, color: '#000080' },
            { x: 15, delay: 9,    dur: 19, color: '#138808' },
            { x: 55, delay: 14,   dur: 16, color: '#FF6B00' },
            { x: 92, delay: 2,    dur: 23, color: '#138808' },
            { x: 30, delay: 16,   dur: 20, color: '#000080' },
            { x: 70, delay: 7,    dur: 18, color: '#FF6B00' },
            { x: 42, delay: 12,   dur: 24, color: '#138808' },
            { x: 82, delay: 5,    dur: 22, color: '#FF6B00' },
            { x: 5,  delay: 18,   dur: 16, color: '#000080' },
            { x: 95, delay: 10,   dur: 19, color: '#138808' },
            { x: 25, delay: 15,   dur: 21, color: '#FF6B00' },
            { x: 65, delay: 13,   dur: 17, color: '#000080' },
            { x: 50, delay: 20,   dur: 23, color: '#FF6B00' },
            { x: 80, delay: 17,   dur: 25, color: '#138808' },
          ].map((p) => (
            <div
              key={`${p.x}-${p.delay}`}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: '100%',
                background: p.color,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-badge">
          🇮🇳 India Ka AI Assistant
        </div>

        <h1 className="hero-title">
          Har Sawaal Ka<br />
          <span className="hero-title-accent">Jawab Ek Jagah</span>
        </h1>

        <p className="hero-subtitle">
          Legal help, Govt schemes, Health, Finance, Agriculture, Education —
          sab ek jagah. Gaon se shahar tak, har Indian ke liye. Bilkul free.
        </p>

        <div className="hero-buttons">
          <Link href="/chat" className="hero-btn-primary">
            Explore Now →
          </Link>
          <Link href="/pricing" className="hero-btn-secondary">
            View Pricing
          </Link>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-dot" />
          Scroll to explore
        </div>
      </section>

      {/* STATS */}
      <div className="stats-section">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <section className="section" id="features">
        <div className="section-label">What We Offer</div>
        <h2 className="section-title">6 Expert AI Modules</h2>
        <p className="section-subtitle">
          Har module ek specialized AI expert hai — apna koi bhi sawaal kisi bhi module se poochein.
        </p>
        <div className="modules-grid">
          {modules.map((m) => (
            <Link
              key={m.name}
              href="/chat"
              className="module-card"
              style={{ '--module-color': m.color } as React.CSSProperties}
            >
              <div className="module-emoji">{m.emoji}</div>
              <div>
                <div className="module-name">{m.name}</div>
                <div className="module-desc">{m.desc}</div>
              </div>
              <div className="module-arrow">Ask now →</div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="section-label">Simple Process</div>
        <h2 className="section-title">Kaise Kaam Karta Hai?</h2>
        <p className="section-subtitle">Teen simple steps mein apna jawab paayein.</p>
        <div className="steps-grid">
          {steps.map((s) => (
            <div key={s.n} className="step-card">
              <div className="step-number">{s.n}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="section-label">Real Stories</div>
        <h2 className="section-title">Logon Ne Kya Kaha</h2>
        <p className="section-subtitle">Real users, real help, real impact.</p>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-module">{t.module}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-location">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-glow" aria-hidden="true" />
        <h2 className="cta-title">Shuru Karein Aaj — Free Mein</h2>
        <p className="cta-subtitle">
          Koi registration nahi. Koi credit card nahi. Bas poochho.
        </p>
        <div className="cta-buttons">
          <Link href="/chat" className="hero-btn-primary">Get Started Free →</Link>
          <Link href="/pricing" className="hero-btn-secondary">See Pricing</Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <a href="/" className="nav-logo" style={{ textDecoration: 'none', color: '#FFFFFF' }}>
              BharatOS
            </a>
            <p className="footer-brand-desc">
              India ka pehla AI Life OS. Legal, Health, Finance, Govt schemes —
              sab ek jagah, sabke liye, free mein.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <Link href="/chat" className="footer-link">Try BharatOS</Link>
            <Link href="/#features" className="footer-link">Features</Link>
            <Link href="/pricing" className="footer-link">Pricing</Link>
          </div>
          <div>
            <div className="footer-col-title">Modules</div>
            <Link href="/chat" className="footer-link">NyayBot — Legal</Link>
            <Link href="/chat" className="footer-link">JanSeva — Govt</Link>
            <Link href="/chat" className="footer-link">Swasthya — Health</Link>
            <Link href="/chat" className="footer-link">Dhan — Finance</Link>
            <Link href="/chat" className="footer-link">Kisan — Agri</Link>
            <Link href="/chat" className="footer-link">Gyaan — Education</Link>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <Link href="/about" className="footer-link">About</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/contact" className="footer-link">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 BharatOS. All rights reserved.</div>
          <div className="footer-copy">Made with ❤️ for India</div>
        </div>
      </footer>
    </div>
  )
}
