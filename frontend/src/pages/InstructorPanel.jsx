import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const tabs = ['Dashboard', 'Course Builder', 'Attendance', 'Q&A Inbox', 'Analytics', 'Earnings']

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => (
  <div className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: '16px 18px', animation: `fadeUp 0.6s ease ${delay}s both`, transition: 'all 0.3s', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
  >
    <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: color + '15' }} />
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, color: '#1E293B', marginBottom: 3 }}>{value}</div>
    <div style={{ color: '#64748B', fontSize: 12, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ color, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{sub}</div>}
  </div>
)

const mockQA = [
  { id: 1, student: 'Arjun M.', course: 'React JS Bootcamp', question: 'How do I use useEffect with async functions?', time: '2 hours ago', answered: false },
  { id: 2, student: 'Priya N.', course: 'Node.js REST APIs', question: 'What is the difference between require and import?', time: '5 hours ago', answered: true },
  { id: 3, student: 'Rahul D.', course: 'React JS Bootcamp', question: 'Can you explain the Context API with a real example?', time: '1 day ago', answered: false },
  { id: 4, student: 'Sneha K.', course: 'Node.js REST APIs', question: 'How do I handle file uploads with multer?', time: '2 days ago', answered: true },
]

const mockEarnings = [
  { month: 'Oct', amount: 12400 },
  { month: 'Nov', amount: 18900 },
  { month: 'Dec', amount: 15200 },
  { month: 'Jan', amount: 22800 },
  { month: 'Feb', amount: 19500 },
  { month: 'Mar', amount: 28400 },
]

const InstructorPanel = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', description: '', category: '', price: 0, level: 'beginner' })
  const [message, setMessage] = useState('')
  const [answers, setAnswers] = useState({})
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [tabMenuOpen, setTabMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (user?.role !== 'instructor' && user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  useEffect(() => {
    API.get('/courses/instructor/my-courses')
      .then(({ data }) => { setCourses(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await API.post('/courses', form)
      setCourses([...courses, data])
      setMessage('✅ Course created! Awaiting admin approval.')
      setForm({ title: '', description: '', category: '', price: 0, level: 'beginner' })
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage('❌ Failed: ' + (err.response?.data?.message || 'Error creating course'))
    }
  }

  const totalStudents = courses.reduce((a, c) => a + (c.totalStudents || 0), 0)
  const totalEarnings = mockEarnings.reduce((a, e) => a + e.amount, 0)
  const maxEarning = Math.max(...mockEarnings.map(e => e.amount))

  const tabIcons = {
    Dashboard: '📊',
    'Course Builder': '🎬',
    Attendance: '📋',
    'Q&A Inbox': '💬',
    Analytics: '📈',
    Earnings: '💰'
  }

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh', color: '#1E293B', fontFamily: "'DM Sans',sans-serif" }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,156,245,0.06) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(165,184,255,0.06) 0%,transparent 70%)' }} />
      </div>

      <div style={{ position: 'relative', maxWidth: 1300, margin: '0 auto', padding: isMobile ? '16px 12px' : '28px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)' }}>👨‍🏫</div>
            <div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: isMobile ? 20 : 26, margin: 0, color: '#1E293B' }}>Instructor Studio</h1>
              <p style={{ color: '#64748B', margin: 0, fontSize: 12, fontWeight: 500 }}>Welcome back, {user?.name}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => navigate('/attendance')} style={{ background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
              📋 Attendance Manager
            </button>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
              <span style={{ color: '#10B981', animation: 'pulse 1.5s infinite' }}>●</span>
              <span style={{ color: '#64748B' }}>Online</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isMobile ? (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <button onClick={() => setTabMenuOpen(!tabMenuOpen)} style={{ width: '100%', background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '12px 16px', color: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
              <span>{tabIcons[activeTab]} {activeTab}</span>
              <span>{tabMenuOpen ? '▲' : '▼'}</span>
            </button>
            {tabMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 12, zIndex: 50, overflow: 'hidden', marginTop: 4, boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setTabMenuOpen(false) }} style={{ width: '100%', padding: '12px 16px', background: activeTab === tab ? 'rgba(109,142,247,0.08)' : 'transparent', border: 'none', color: activeTab === tab ? '#6D8EF7' : '#64748B', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans,sans-serif', fontWeight: activeTab === tab ? 700 : 500, borderBottom: '1px solid #E2E8F0' }}>
                    {tabIcons[tab]} {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#FFFFFF', borderRadius: 14, padding: 4, border: '1.5px solid #E2E8F0', flexWrap: 'wrap', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: 13, transition: 'all 0.2s', background: activeTab === tab ? 'linear-gradient(135deg,#7C9CF5,#A5B8FF)' : 'transparent', color: activeTab === tab ? '#fff' : '#64748B', boxShadow: activeTab === tab ? '0 4px 12px rgba(124,156,245,0.3)' : 'none' }}>
                {tabIcons[tab]} {tab}
              </button>
            ))}
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {activeTab === 'Dashboard' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <StatCard icon="📚" label="My Courses" value={courses.length} color="#6D8EF7" delay={0.05} />
              <StatCard icon="👥" label="Active Students" value={totalStudents.toLocaleString()} sub="+12% this month" color="#8EC5FC" delay={0.1} />
              <StatCard icon="⭐" label="Instructor Rating" value="4.8" color="#F59E0B" delay={0.15} />
              <StatCard icon="💰" label="This Month Earnings" value="₹28,400" color="#10B981" delay={0.2} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: 0, color: '#1E293B' }}>Course Catalog</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => navigate('/attendance')} style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.2)', color: '#10B981', padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>
                  📋 Attendance
                </button>
                <button onClick={() => setActiveTab('Course Builder')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '7px 16px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
                  + New Course
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 32, color: '#64748B', fontWeight: 500 }}>Loading curriculum studio...</div>
            ) : courses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FFFFFF', borderRadius: 16, border: '1.5px dashed #A5B8FF', marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎬</div>
                <p style={{ color: '#64748B', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>No courses created yet.</p>
                <button onClick={() => setActiveTab('Course Builder')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'DM Sans,sans-serif', fontSize: 13, boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>Create Course</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {courses.map((c) => (
                  <div key={c._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748B', textTransform: 'capitalize', fontWeight: 500 }}>{c.category} · {c.level} · {c.totalStudents || 0} students enrolled</p>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, fontWeight: 700, background: c.isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: c.isApproved ? '#10B981' : '#F59E0B', border: `1.5px solid ${c.isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                      {c.isApproved ? '✓ Live' : '⏳ Pending Approval'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 12px', color: '#1E293B' }}>Recent Student Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockQA.slice(0, 3).map(q => (
                <div key={q.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, color: '#fff' }}>{q.student[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, color: '#1E293B', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{q.student} · {q.course} · {q.time}</p>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: q.answered ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', color: q.answered ? '#10B981' : '#EF4444', fontWeight: 700, border: `1px solid ${q.answered ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    {q.answered ? 'Answered' : 'Pending Action'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ COURSE BUILDER ══ */}
        {activeTab === 'Course Builder' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: 20, alignItems: 'start' }}>
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: isMobile ? 18 : 26, boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 4px', color: '#1E293B' }}>Syllabus Course Builder</h2>
                <p style={{ color: '#64748B', fontSize: 13, marginBottom: 20, fontWeight: 500 }}>Publish curriculum guidelines for students to view</p>
                {message && (
                  <div style={{ background: message.includes('created') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1.5px solid ${message.includes('created') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: message.includes('created') ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                    {message}
                  </div>
                )}
                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Course Title', key: 'title', placeholder: 'e.g. Complete React & Tailwind JS Bootcamp', type: 'text' },
                    { label: 'Category', key: 'category', placeholder: 'e.g. Frontend Development', type: 'text' },
                    { label: 'Price (₹)', key: 'price', placeholder: '0 for free access', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 700 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required={f.key !== 'price'}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 500 }}
                        onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                        onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 700 }}>Description</label>
                    <textarea placeholder="Describe the topics and hands-on portfolio projects..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 500 }}
                      onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 700 }}>Difficulty Level</label>
                    <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 700, cursor: 'pointer' }}>
                      <option value="beginner">🟢 Beginner Level</option>
                      <option value="intermediate">🟡 Intermediate Level</option>
                      <option value="advanced">🔴 Advanced Level</option>
                    </select>
                  </div>
                  <button type="submit" style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '13px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 15, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 12px rgba(124,156,245,0.3)', transition: 'all 0.2s' }}>
                    🚀 Publish Course to catalog
                  </button>
                </form>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ background: 'linear-gradient(135deg,rgba(124,156,245,0.08),rgba(165,184,255,0.04))', border: '1px solid rgba(124,156,245,0.15)', borderRadius: 18, padding: 20 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 14px', color: '#1E293B' }}>📋 Course Checklist Guidelines</h3>
                  {[
                    { done: true, text: 'Define robust titles and syllabus objectives' },
                    { done: true, text: 'Configure tags and difficulty filters' },
                    { done: false, text: 'Upload 5+ verified video assets' },
                    { done: false, text: 'Add descriptive course banner graphics' },
                    { done: false, text: 'Embed at least 1 assessment quiz module' },
                    { done: false, text: 'Submit course for administrator clearance' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: item.done ? '#10B981' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0, color: '#fff', fontWeight: 700 }}>
                        {item.done ? '✓' : ''}
                      </div>
                      <span style={{ fontSize: 13, color: item.done ? '#64748B' : '#475569', textDecoration: item.done ? 'line-through' : 'none', fontWeight: 500 }}>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 18, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 10px', color: '#1E293B' }}>📋 Cohorts Attendance</h3>
                  <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 16px', fontWeight: 500 }}>Log and track daily classroom logs for cohorts</p>
                  <button onClick={() => navigate('/attendance')} style={{ width: '100%', background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', color: '#fff', padding: '11px', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 12px rgba(16,185,129,0.2)' }}>
                    📋 Launch Attendance Roster →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══ ATTENDANCE ══ */}
        {activeTab === 'Attendance' && (
          <div style={{ animation: 'fadeIn 0.4s ease both', textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1.5px solid #E2E8F0', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 28, margin: '0 0 10px', color: '#1E293B' }}>Attendance Manager</h2>
            <p style={{ color: '#64748B', fontSize: 15, marginBottom: 24, fontWeight: 500 }}>
              The attendance system features its own dedicated platform view with email alert dispatches and CSV export logs.
            </p>
            <button onClick={() => navigate('/attendance')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '14px 36px', borderRadius: 14, cursor: 'pointer', fontWeight: 800, fontSize: 16, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 12px rgba(124,156,245,0.3)' }}>
              📋 Launch Attendance Platform →
            </button>
          </div>
        )}

        {/* ══ Q&A INBOX ══ */}
        {activeTab === 'Q&A Inbox' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: 0, color: '#1E293B' }}>Q&A Inbox Inbox</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {mockQA.filter(q => !q.answered).length} Unresolved
                </span>
                <span style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {mockQA.filter(q => q.answered).length} Resolved
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockQA.map((q) => (
                <div key={q.id} style={{ background: '#FFFFFF', border: `1.5px solid ${q.answered ? '#E2E8F0' : 'rgba(124,156,245,0.3)'}`, borderRadius: 16, padding: 18, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0, color: '#fff' }}>
                        {q.student[0]}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{q.student}</p>
                        <p style={{ margin: 0, color: '#64748B', fontSize: 11, fontWeight: 500 }}>{q.course} · {q.time}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: q.answered ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', color: q.answered ? '#10B981' : '#EF4444', fontWeight: 700, border: `1px solid ${q.answered ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {q.answered ? '✓ Resolved' : '⏳ Pending Answer'}
                    </span>
                  </div>
                  <div style={{ background: '#F7F9FC', borderRadius: 10, padding: '10px 12px', marginBottom: q.answered ? 0 : 12, border: '1px solid #E2E8F0' }}>
                    <p style={{ margin: 0, fontSize: 14, color: '#334155', lineHeight: 1.5, fontWeight: 500 }}>"{q.question}"</p>
                  </div>
                  {!q.answered && (
                    <div>
                      <textarea placeholder="Type your expert guidance..." value={answers[q.id] || ''} onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })} rows={2}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#1E293B', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', marginBottom: 8, fontWeight: 500 }}
                        onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                        onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                      <button style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '9px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
                        Send Answer →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ANALYTICS ══ */}
        {activeTab === 'Analytics' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#1E293B' }}>Course Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <StatCard icon="⏱" label="Avg Watch Duration" value="18 min" color="#6D8EF7" delay={0.05} />
              <StatCard icon="✅" label="Completion Ratio" value="68%" color="#10B981" delay={0.1} />
              <StatCard icon="📉" label="Syllabus Drop-off" value="32%" color="#EF4444" delay={0.15} />
              <StatCard icon="📺" label="Watch Duration" value="4,820 hrs" color="#F59E0B" delay={0.2} />
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 18px', color: '#1E293B' }}>Monthly Cohort Enrollment</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
                {[{ month: 'Oct', value: 65 }, { month: 'Nov', value: 82 }, { month: 'Dec', value: 71 }, { month: 'Jan', value: 90 }, { month: 'Feb', value: 78 }, { month: 'Mar', value: 100 }].map((d, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${d.value}%`, background: i === 5 ? 'linear-gradient(to top,#7C9CF5,#A5B8FF)' : 'rgba(124,156,245,0.3)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(to top,#7C9CF5,#A5B8FF)'}
                      onMouseLeave={e => { if (i !== 5) e.currentTarget.style.background = 'rgba(124,156,245,0.3)' }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 16px', color: '#1E293B' }}>Cohort drop-off by curriculum</h3>
              {[{ lesson: 'Introduction Overview', watch: 98 }, { lesson: 'Core Fundamentals', watch: 87 }, { lesson: 'Advanced Patterns', watch: 71 }, { lesson: 'Portfolio Projects', watch: 65 }, { lesson: 'Assessment Quiz', watch: 58 }].map((row, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: '#1E293B', fontWeight: 700 }}>{row.lesson}</span>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>{row.watch}% retention</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: 100, height: 6 }}>
                    <div style={{ height: 6, borderRadius: 100, width: `${row.watch}%`, background: row.watch > 80 ? '#10B981' : row.watch > 60 ? '#F59E0B' : '#EF4444' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ EARNINGS ══ */}
        {activeTab === 'Earnings' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#1E293B' }}>Financial Studio</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              <StatCard icon="💰" label="Total Revenue" value={`₹${totalEarnings.toLocaleString()}`} sub="Lifetime" color="#10B981" delay={0.05} />
              <StatCard icon="📅" label="This Month Earnings" value="₹28,400" sub="+46% vs last month" color="#6D8EF7" delay={0.1} />
              <StatCard icon="⏳" label="Pending payouts" value="₹12,200" sub="Processing" color="#F59E0B" delay={0.15} />
              <StatCard icon="🏦" label="Cleared Earnings" value={`₹${(totalEarnings - 12200).toLocaleString()}`} color="#8EC5FC" delay={0.2} />
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 18px', color: '#1E293B' }}>Monthly Earnings Overview (₹)</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
                {mockEarnings.map((e, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 9, color: '#64748B', fontWeight: 600 }}>₹{(e.amount / 1000).toFixed(0)}k</span>
                    <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${(e.amount / maxEarning) * 100}%`, background: i === mockEarnings.length - 1 ? 'linear-gradient(to top,#10B981,#8EC5FC)' : 'rgba(16,185,129,0.25)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={ev => ev.currentTarget.style.background = 'linear-gradient(to top,#10B981,#8EC5FC)'}
                      onMouseLeave={ev => { if (i !== mockEarnings.length - 1) ev.currentTarget.style.background = 'rgba(16,185,129,0.25)' }} />
                    <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{e.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', background: '#F7F9FC' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: 0, color: '#1E293B' }}>Cleared Payout Logs</h3>
              </div>
              {[
                { date: 'March 01, 2026', amount: '₹16,200', status: 'Paid' },
                { date: 'February 01, 2026', amount: '₹19,500', status: 'Paid' },
                { date: 'January 01, 2026', amount: '₹22,800', status: 'Paid' },
                { date: 'March 26, 2026', amount: '₹12,200', status: 'Processing' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, color: '#1E293B', fontSize: 14 }}>{row.amount}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{row.date}</p>
                  </div>
                  <span style={{ fontSize: 12, padding: '3px 12px', borderRadius: 100, background: row.status === 'Paid' ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: row.status === 'Paid' ? '#10B981' : '#F59E0B', border: `1.5px solid ${row.status === 'Paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, fontWeight: 700 }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #94A3B8; }
        select option { background: #FFFFFF; color: #1E293B; }
        @media (max-width: 768px) { * { -webkit-tap-highlight-color: transparent; } }
      `}</style>
    </div>
  )
}

export default InstructorPanel