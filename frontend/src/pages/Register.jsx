import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await API.post('/auth/register', form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
    setLoading(false)
  }

  if (pending) return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ textAlign: 'center', maxWidth: 480, padding: 24 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 32, color: '#1E293B', marginBottom: 12 }}>Account Submitted!</h2>
        <p style={{ color: '#64748B', fontSize: 16, marginBottom: 28, lineHeight: 1.7, fontWeight: 500 }}>
          Your account is pending admin approval. You'll receive access once an admin activates your account.
        </p>
        <Link to="/login" style={{ 
          background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
          color: '#fff', 
          textDecoration: 'none', 
          padding: '14px 32px', 
          borderRadius: 14, 
          fontWeight: 700, 
          fontSize: 16,
          boxShadow: '0 4px 14px rgba(124, 156, 245, 0.3)'
        }}>
          Go to Login →
        </Link>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@900&family=DM+Sans:wght@400;500&display=swap');`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,156,245,0.12) 0%,transparent 70%)' }} />
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#1E293B', marginBottom: 24 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 900, 
              fontSize: 20,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)'
            }}>L</div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 22 }}>
              Learn<span style={{ color: '#6D8EF7' }}>ix</span>
            </span>
          </Link>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 34, margin: '0 0 8px', color: '#1E293B', tracking: '-1px' }}>Create Account</h1>
          <p style={{ color: '#64748B', margin: 0, fontWeight: 500 }}>Join 50,000+ learners at Learnix</p>
        </div>
        <div className="glass rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#ef4444', fontSize: 14, fontWeight: 500 }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 600, uppercase: 'true', letterSpacing: 0.5 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                  style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 600, uppercase: 'true', letterSpacing: 0.5 }}>I want to</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ width: '100%', padding: '13px 16px', borderRadius: 12, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif', fontWeight: 500, cursor: 'pointer' }}>
                <option value="student">Learn as a Student</option>
                <option value="instructor">Teach as an Instructor</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ 
              padding: '14px', 
              borderRadius: 14, 
              background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
              border: 'none', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: 16, 
              cursor: 'pointer', 
              fontFamily: 'DM Sans,sans-serif', 
              marginTop: 4, 
              boxShadow: '0 4px 14px rgba(124, 156, 245, 0.3)',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}>
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', color: '#64748B', fontSize: 14, marginTop: 20, fontWeight: 500 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6D8EF7', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap'); input::placeholder,select option{color:rgba(148,163,184,0.7);} select option{background:#FFFFFF; color: #1E293B;}`}</style>
    </div>
  )
}

export default Register