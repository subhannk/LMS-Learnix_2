import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const courses = [
  { icon: '💻', title: 'Full Stack Web Dev', students: '12,400', level: 'Beginner', color: '#7C9CF5' },
  { icon: '🤖', title: 'AI & Machine Learning', students: '8,900', level: 'Intermediate', color: '#A5B8FF' },
  { icon: '📱', title: 'Mobile App Dev', students: '7,200', level: 'Beginner', color: '#8EC5FC' },
  { icon: '🔒', title: 'Cybersecurity', students: '9,100', level: 'Advanced', color: '#A5B8FF' },
  { icon: '☁️', title: 'Cloud & DevOps', students: '6,800', level: 'Intermediate', color: '#7C9CF5' },
  { icon: '🎨', title: 'UI/UX Design', students: '5,400', level: 'Beginner', color: '#8EC5FC' },
]

const stats = [
  { value: '50000', label: 'Students Enrolled', suffix: '+' },
  { value: '200', label: 'Expert Courses', suffix: '+' },
  { value: '95', label: 'Placement Rate', suffix: '%' },
  { value: '8', label: 'Years Excellence', suffix: '+' },
]

const testimonials = [
  { name: 'Arjun Menon', role: 'Software Engineer @ Google', text: 'Learnix transformed my career. The mentorship and hands-on projects gave me the confidence to crack top tech interviews.', avatar: '👨‍💻' },
  { name: 'Priya Nair', role: 'UI Designer @ Swiggy', text: "From zero design knowledge to landing a dream job — Learnix's UI/UX course is absolutely world-class.", avatar: '👩‍🎨' },
  { name: 'Rahul Dev', role: 'ML Engineer @ Amazon', text: 'The AI course content is incredibly up-to-date. I got placed within 2 months of completing my certification.', avatar: '🧑‍🔬' },
]

const Counter = ({ target, suffix }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const num = parseInt(target)
        let cur = 0
        const step = Math.ceil(num / 60)
        const timer = setInterval(() => {
          cur += step
          if (cur >= num) { setCount(num); clearInterval(timer) }
          else setCount(cur)
        }, 30)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const Landing = () => {
  const [scrollY, setScrollY] = useState(0)
  const [activeTest, setActiveTest] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setActiveTest(p => (p + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ background: '#F7F9FC', color: '#1E293B', fontFamily: "'DM Sans',sans-serif", overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '14px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrollY > 50 ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(226, 232, 240, 0.8)' : 'none',
        boxShadow: scrollY > 50 ? '0 4px 30px rgba(0, 0, 0, 0.02)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 36, 
            height: 36, 
            borderRadius: 10, 
            background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 900, 
            fontSize: 18, 
            color: '#fff',
            boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)'
          }}>L</div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: '#1E293B' }}>
            Learn<span style={{ color: '#6D8EF7' }}>ix</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/login" style={{ color: '#64748B', textDecoration: 'none', padding: '8px 16px', fontSize: 14, fontWeight: 600, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#1E293B'}
            onMouseLeave={e => e.target.style.color = '#64748B'}>
            Sign In
          </Link>
          <Link to="/register" style={{ 
            background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
            color: '#fff', 
            textDecoration: 'none', 
            padding: '10px 22px', 
            borderRadius: 12, 
            fontSize: 14, 
            fontWeight: 600, 
            boxShadow: '0 4px 14px rgba(124, 156, 245, 0.35)', 
            transition: 'opacity 0.2s' 
          }}
            onMouseEnter={e => e.target.style.opacity = '0.9'}
            onMouseLeave={e => e.target.style.opacity = '1'}>
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,156,245,0.15) 0%,transparent 70%)', animation: 'float1 6s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(165,184,255,0.12) 0%,transparent 70%)', animation: 'float2 8s ease-in-out infinite' }} />
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#E2E8F0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div style={{ position: 'relative', maxWidth: 900 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(109,142,247,0.08)', border: '1px solid rgba(109,142,247,0.2)', borderRadius: 100, padding: '8px 18px', marginBottom: 28, fontSize: 13, color: '#6D8EF7', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Premium Global Student Workspace
          </div>

          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(44px,8vw,80px)', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-2px', color: '#1E293B' }}>
            Build Your Future<br />
            <span style={{ background: 'linear-gradient(135deg,#7C9CF5 0%,#A5B8FF 50%,#8EC5FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% auto', animation: 'shimmer 4s linear infinite' }}>
              in Tech & Design.
            </span>
          </h1>

          <p style={{ color: '#64748B', fontSize: 'clamp(16px,2vw,20px)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 500 }}>
            Industry-leading courses in Web Development, AI, Cybersecurity & more. Join 50,000+ students globally who chose Learnix.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <Link to="/register" style={{ 
              background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
              color: '#fff', 
              textDecoration: 'none', 
              padding: '16px 36px', 
              borderRadius: 16, 
              fontWeight: 700, 
              fontSize: 16, 
              boxShadow: '0 8px 24px rgba(124, 156, 245, 0.3)', 
              transition: 'all 0.3s' 
            }}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 30px rgba(124, 156, 245, 0.45)' }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(124, 156, 245, 0.3)' }}>
              Start Learning Free →
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['👨‍💻', '👩‍💻', '🧑‍💻', '👨‍🎓', '👩‍🎓'].map((e, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: `hsl(${i * 45 + 200},70%,80%)`, border: '2px solid #FFFFFF', marginLeft: i > 0 ? -10 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>{e}</div>
              ))}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>50,000+ students</div>
              <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>⭐⭐⭐⭐⭐ 4.9 overall rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '60px 24px', background: 'rgba(124,156,245,0.05)', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(30px,5vw,46px)', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ color: '#64748B', fontSize: 13, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ color: '#6D8EF7', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>What We Teach</span>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,46px)', marginTop: 8, letterSpacing: '-1.5px', color: '#1E293B' }}>
            World-Class <span style={{ color: '#6D8EF7' }}>Learning Track</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20 }}>
          {courses.map((c, i) => (
            <div key={i} style={{ 
              background: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              borderRadius: 20, 
              padding: 26, 
              cursor: 'pointer', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              position: 'relative', 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = 'translateY(-6px)'; 
                e.currentTarget.style.borderColor = '#7C9CF5'; 
                e.currentTarget.style.boxShadow = `0 20px 30px rgba(124,156,245,0.12)` 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.borderColor = '#E2E8F0'; 
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)' 
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${c.color},#A5B8FF)` }} />
              <div style={{ fontSize: 36, marginBottom: 14 }}>{c.icon}</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, marginBottom: 8, color: '#1E293B' }}>{c.title}</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>👥 {c.students}</span>
                <span style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 11, padding: '2px 10px', borderRadius: 100, fontWeight: 700 }}>{c.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY LEARNIX */}
      <section style={{ padding: '80px 24px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ color: '#6D8EF7', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Why Choose Us</span>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,5vw,46px)', marginTop: 8, letterSpacing: '-1.5px', color: '#1E293B' }}>
              The Learnix <span style={{ color: '#6D8EF7' }}>Advantage</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {[
              { icon: '🏆', title: 'Industry Mentors', desc: 'Learn from engineers at Google, Amazon, Microsoft', color: '#7C9CF5' },
              { icon: '💼', title: '100% Placement Support', desc: 'Dedicated placement cell with 500+ hiring partners', color: '#8EC5FC' },
              { icon: '🔬', title: 'Hands-on Projects', desc: 'Build real-world projects for your portfolio', color: '#A5B8FF' },
              { icon: '📜', title: 'Certified Curriculum', desc: 'AWS, Google, Microsoft aligned courses', color: '#7C9CF5' },
              { icon: '🤝', title: 'Lifetime Community', desc: 'Join 50,000+ alumni for networking and support', color: '#8EC5FC' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'HD videos on mobile, tablet and desktop 24/7', color: '#A5B8FF' },
            ].map((f, i) => (
              <div key={i} style={{ 
                background: '#F7F9FC', 
                border: '1px solid #E2E8F0', 
                borderRadius: 18, 
                padding: 22, 
                transition: 'all 0.3s', 
                cursor: 'default',
                boxShadow: '0 2px 10px rgba(0,0,0,0.01)'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.borderColor = '#7C9CF5' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F7F9FC'; e.currentTarget.style.borderColor = '#E2E8F0' }}
              >
                <div style={{ fontSize: 30, marginBottom: 12 }}>{f.icon}</div>
                <h4 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, marginBottom: 7, color: '#1E293B' }}>{f.title}</h4>
                <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ color: '#6D8EF7', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Student Stories</span>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(24px,4vw,40px)', margin: '8px 0 40px', letterSpacing: '-1px', color: '#1E293B' }}>
          Life-Changing <span style={{ color: '#6D8EF7' }}>Experiences</span>
        </h2>

        <div style={{ position: 'relative', minHeight: 220 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, 
              opacity: activeTest === i ? 1 : 0, 
              transform: activeTest === i ? 'translateY(0)' : 'translateY(20px)', 
              transition: 'all 0.6s ease', 
              pointerEvents: activeTest === i ? 'auto' : 'none', 
              background: '#FFFFFF', 
              border: '1px solid #E2E8F0', 
              borderRadius: 22, 
              padding: '32px 36px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontSize: 44, marginBottom: 14, opacity: 0.15, color: '#6D8EF7', lineHeight: 1, fontFamily: 'serif' }}>“</div>
              <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 22, fontStyle: 'italic', fontWeight: 500 }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{t.avatar}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{t.name}</div>
                  <div style={{ color: '#6D8EF7', fontSize: 12, fontWeight: 600 }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 240, display: 'flex', justifyContent: 'center', gap: 8 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActiveTest(i)} style={{ width: activeTest === i ? 24 : 8, height: 8, borderRadius: 100, background: activeTest === i ? '#6D8EF7' : '#E2E8F0', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(124,156,245,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 660, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(32px,6vw,60px)', lineHeight: 1.1, marginBottom: 18, letterSpacing: '-1.5px', color: '#1E293B' }}>
            Your Tech Career<br />Starts <span style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Today.</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: 16, marginBottom: 36, fontWeight: 500 }}>
            Join 50,000+ students building their dream careers with Learnix.
          </p>
          <Link to="/register" style={{ 
            background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
            color: '#fff', 
            textDecoration: 'none', 
            padding: '18px 48px', 
            borderRadius: 18, 
            fontWeight: 800, 
            fontSize: 18, 
            display: 'inline-block', 
            boxShadow: '0 8px 24px rgba(124, 156, 245, 0.3)', 
            transition: 'all 0.3s' 
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 12px 30px rgba(124, 156, 245, 0.45)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 8px 24px rgba(124, 156, 245, 0.3)' }}>
            Enroll Now — It's Free →
          </Link>
          <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 14, fontWeight: 500 }}>No credit card required · Access instantly</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 24px 28px', borderTop: '1px solid #E2E8F0', background: '#FFFFFF', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ 
            width: 30, 
            height: 30, 
            borderRadius: 8, 
            background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 900, 
            fontSize: 15,
            color: '#fff'
          }}>L</div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, color: '#1E293B' }}>Learnix</span>
        </div>
        <p style={{ color: '#64748B', fontSize: 13, fontWeight: 500 }}>Global Student Workspace · Interactive Educational Platform</p>
        <p style={{ color: '#94A3B8', fontSize: 12, marginTop: 6, fontWeight: 500 }}>© 2026 Learnix. All rights reserved.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes float1 { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-30px) translateX(15px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(20px) translateX(-10px)} }
        @keyframes shimmer { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}

export default Landing