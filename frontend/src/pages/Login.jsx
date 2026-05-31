import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await API.post('/auth/login', form)
      login(data); navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C9CF5] rounded-full opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#A5B8FF] rounded-full opacity-10 blur-3xl animate-pulse" style={{animationDelay:'1s'}} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 10, 
              background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 900, 
              fontSize: 18,
              color: '#fff',
              boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)'
            }}>L</div>
            <span className="font-black text-2xl text-[#1E293B]" style={{fontFamily:'Syne'}}>
              Learn<span style={{ color: '#6D8EF7' }}>ix</span>
            </span>
          </Link>
          <h1 className="text-3xl font-black text-[#1E293B] mb-2 tracking-tight" style={{fontFamily:'Syne'}}>Welcome back</h1>
          <p className="text-[#64748B] font-medium">Sign in to continue learning</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 font-medium">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-1 block">Email Address</label>
              <input type="email" placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#1E293B] placeholder-gray-400 focus:outline-none focus:border-[#7C9CF5] focus:ring-2 focus:ring-[#7C9CF5]/25 transition text-sm font-medium"
                value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
            </div>
            <div>
              <label className="text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-1 block">Password</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#E2E8F0] text-[#1E293B] placeholder-gray-400 focus:outline-none focus:border-[#7C9CF5] focus:ring-2 focus:ring-[#7C9CF5]/25 transition text-sm font-medium"
                value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C9CF5] to-[#A5B8FF] text-white font-bold hover:opacity-95 transition-all shadow-md shadow-[#7C9CF5]/20 mt-2 hover:-translate-y-0.5 duration-200 active:translate-y-0">
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[#64748B] text-sm mt-6 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#6D8EF7] hover:text-[#5A7CF0] font-bold">Create one free</Link>
        </p>
      </div>
    </div>
  )
}

export default Login