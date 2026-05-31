import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const tabs = ['Overview', 'Users', 'Courses', 'Approvals', 'Access Control', 'Analytics']

const StatCard = ({ icon, label, value, sub, color, delay = 0 }) => (
  <div className="card-hover" style={{
    background: '#FFFFFF', border: `1.5px solid #E2E8F0`,
    borderRadius: 16, padding: '18px 20px',
    animation: `fadeUp 0.6s ease ${delay}s both`,
    transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)'
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = color }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
  >
    <div style={{ position: 'absolute', top: -15, right: -15, width: 60, height: 60, borderRadius: '50%', background: color + '15' }} />
    <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 26, color: '#1E293B', marginBottom: 3 }}>{value}</div>
    <div style={{ color: '#64748B', fontSize: 12, marginBottom: sub ? 3 : 0, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ color, fontSize: 11, fontWeight: 700 }}>{sub}</div>}
  </div>
)

const AdminPanel = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [pendingCourses, setPendingCourses] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [tabMenuOpen, setTabMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  useEffect(() => {
    Promise.all([
      API.get('/users'),
      API.get('/courses'),
      API.get('/courses/admin/pending'),
      API.get('/users/pending')
    ]).then(([u, c, p, pu]) => {
      setUsers(u.data)
      setCourses(c.data)
      setPendingCourses(p.data)
      setPendingUsers(pu.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await API.delete(`/users/${id}`)
      setUsers(users.filter(u => u._id !== id))
      showMsg('✅ User deleted')
    } catch { showMsg('❌ Failed to delete user', 'error') }
  }

  const handleRoleChange = async (id, role) => {
    try {
      const { data } = await API.put(`/users/${id}/role`, { role })
      setUsers(users.map(u => u._id === id ? data : u))
      showMsg('✅ User role updated')
    } catch { showMsg('❌ Failed to update role', 'error') }
  }

  const handleApproveCourse = async (id) => {
    try {
      const { data } = await API.put(`/courses/${id}/approve`)
      setPendingCourses(pendingCourses.filter(c => c._id !== id))
      setCourses([...courses, data])
      showMsg('✅ Course approved!')
    } catch { showMsg('❌ Failed to approve course', 'error') }
  }

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return
    try {
      await API.delete(`/courses/${id}`)
      setCourses(courses.filter(c => c._id !== id))
      setPendingCourses(pendingCourses.filter(c => c._id !== id))
      showMsg('✅ Course deleted')
    } catch { showMsg('❌ Failed to delete course', 'error') }
  }

  const handleApproveUser = async (id) => {
    try {
      await API.put(`/users/${id}/approve`)
      setPendingUsers(pendingUsers.filter(u => u._id !== id))
      const { data } = await API.get('/users')
      setUsers(data)
      showMsg('✅ User login access approved!')
    } catch { showMsg('❌ Failed to approve user', 'error') }
  }

  const handleRejectUser = async (id) => {
    if (!window.confirm('Reject this user?')) return
    try {
      await API.delete(`/users/${id}`)
      setPendingUsers(pendingUsers.filter(u => u._id !== id))
      showMsg('✅ User access request rejected')
    } catch { showMsg('❌ Failed to reject user', 'error') }
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const roleColors = {
    admin: '#EF4444', instructor: '#6D8EF7',
    student: '#8EC5FC', moderator: '#F59E0B', content_manager: '#10B981'
  }

  const barData = [
    { label: 'Students', value: users.filter(u => u.role === 'student').length, color: '#8EC5FC' },
    { label: 'Instructors', value: users.filter(u => u.role === 'instructor').length, color: '#6D8EF7' },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: '#EF4444' },
    { label: 'Moderators', value: users.filter(u => u.role === 'moderator').length, color: '#F59E0B' },
  ]
  const maxBar = Math.max(...barData.map(b => b.value), 1)

  const tabIcons = {
    Overview: '📊', Users: '👥', Courses: '📚',
    Approvals: '✅', 'Access Control': '🔐', Analytics: '📈'
  }

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh', color: '#1E293B', fontFamily: "'DM Sans',sans-serif" }}>

      {/* BG */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,156,245,0.06) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(165,184,255,0.06) 0%,transparent 70%)' }} />
      </div>

      {/* Toast */}
      {message.text && (
        <div style={{ position: 'fixed', top: 16, right: 16, left: 16, zIndex: 999, background: message.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', border: `1px solid ${message.type === 'error' ? '#EF4444' : '#10B981'}`, borderRadius: 12, padding: '12px 16px', fontSize: 14, color: message.type === 'error' ? '#EF4444' : '#10B981', backdropFilter: 'blur(20px)', animation: 'fadeUp 0.3s ease both', textAlign: 'center', fontWeight: 600 }}>
          {message.text}
        </div>
      )}

      <div style={{ position: 'relative', maxWidth: 1300, margin: '0 auto', padding: isMobile ? '16px 12px' : '28px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12, animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)' }}>🛡️</div>
            <div>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: isMobile ? 20 : 26, margin: 0, letterSpacing: '-0.5px', color: '#1E293B' }}>Admin Center</h1>
              <p style={{ color: '#64748B', margin: 0, fontSize: 12, fontWeight: 500 }}>Learnix Cohorts & Platform Management</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {pendingUsers.length > 0 && (
              <div onClick={() => setActiveTab('Access Control')} style={{ background: 'rgba(109,142,247,0.08)', border: '1px solid rgba(109,142,247,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 12, color: '#6D8EF7', cursor: 'pointer', fontWeight: 700 }}>
                🔐 {pendingUsers.length} requests
              </div>
            )}
            {pendingCourses.length > 0 && (
              <div onClick={() => setActiveTab('Approvals')} style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '6px 12px', fontSize: 12, color: '#F59E0B', cursor: 'pointer', fontWeight: 700 }}>
                ⚡ {pendingCourses.length} approvals
              </div>
            )}
          </div>
        </div>

        {/* Tabs - Mobile dropdown OR Desktop pills */}
        {isMobile ? (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <button onClick={() => setTabMenuOpen(!tabMenuOpen)} style={{ width: '100%', background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '12px 16px', color: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
              <span>{tabIcons[activeTab]} {activeTab}</span>
              <span style={{ fontSize: 12 }}>{tabMenuOpen ? '▲' : '▼'}</span>
            </button>
            {tabMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 12, zIndex: 50, overflow: 'hidden', marginTop: 4, boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setTabMenuOpen(false) }} style={{ width: '100%', padding: '12px 16px', background: activeTab === tab ? 'rgba(109,142,247,0.08)' : 'transparent', border: 'none', color: activeTab === tab ? '#6D8EF7' : '#64748B', textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'DM Sans,sans-serif', fontWeight: activeTab === tab ? 700 : 500, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{tabIcons[tab]} {tab}</span>
                    {tab === 'Approvals' && pendingCourses.length > 0 && <span style={{ background: '#F59E0B', color: '#fff', borderRadius: 100, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>{pendingCourses.length}</span>}
                    {tab === 'Access Control' && pendingUsers.length > 0 && <span style={{ background: '#6D8EF7', color: '#fff', borderRadius: 100, padding: '1px 8px', fontSize: 10, fontWeight: 700 }}>{pendingUsers.length}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#FFFFFF', borderRadius: 14, padding: 4, border: '1.5px solid #E2E8F0', flexWrap: 'wrap', animation: 'fadeUp 0.5s ease 0.1s both', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: 13, transition: 'all 0.2s', background: activeTab === tab ? 'linear-gradient(135deg,#7C9CF5,#A5B8FF)' : 'transparent', color: activeTab === tab ? '#fff' : '#64748B', boxShadow: activeTab === tab ? '0 4px 12px rgba(124,156,245,0.3)' : 'none', position: 'relative' }}>
                {tabIcons[tab]} {tab}
                {tab === 'Approvals' && pendingCourses.length > 0 && <span style={{ marginLeft: 5, background: '#F59E0B', color: '#fff', borderRadius: 100, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{pendingCourses.length}</span>}
                {tab === 'Access Control' && pendingUsers.length > 0 && <span style={{ marginLeft: 5, background: '#6D8EF7', color: '#fff', borderRadius: 100, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{pendingUsers.length}</span>}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748B', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 40, marginBottom: 14, animation: 'spin 2s linear infinite', display: 'inline-block' }}>⚙️</div>
            <p style={{ fontWeight: 600 }}>Loading Learnix platform metrics...</p>
          </div>
        ) : (
          <>
            {/* ══ OVERVIEW ══ */}
            {activeTab === 'Overview' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                  <StatCard icon="👥" label="Total Users" value={users.length} sub={`${users.filter(u => u.isApproved).length} active`} color="#6D8EF7" delay={0.05} />
                  <StatCard icon="📚" label="Live Courses" value={courses.length} color="#8EC5FC" delay={0.1} />
                  <StatCard icon="⏳" label="Pending Approvals" value={pendingCourses.length} color="#F59E0B" delay={0.15} />
                  <StatCard icon="🔐" label="Access Requests" value={pendingUsers.length} color="#EF4444" delay={0.2} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 20 }}>
                  <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 16px', color: '#1E293B' }}>User Roles</h3>
                    {barData.map((b, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>{b.label}</span>
                          <span style={{ color: b.color, fontWeight: 700 }}>{b.value}</span>
                        </div>
                        <div style={{ background: '#F1F5F9', borderRadius: 100, height: 7 }}>
                          <div style={{ height: 7, borderRadius: 100, width: `${(b.value / maxBar) * 100}%`, background: b.color, transition: 'width 1s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 16px', color: '#1E293B' }}>Recently Joined</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {users.slice(0, 4).map((u, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${roleColors[u.role] || '#6D8EF7'},#A5B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, color: '#fff' }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: 13, color: '#1E293B', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{u.email}</p>
                          </div>
                          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: (roleColors[u.role] || '#6D8EF7') + '15', color: roleColors[u.role] || '#6D8EF7', flexShrink: 0, textTransform: 'capitalize', fontWeight: 700 }}>{u.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg,rgba(124,156,245,0.08),rgba(142,197,252,0.04))', border: '1px solid rgba(124,156,245,0.15)', borderRadius: 16, padding: 18 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 12px', color: '#1E293B' }}>Quick Administrator Actions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 10 }}>
                    {[
                      { label: 'Manage All Users', tab: 'Users', icon: '👥', color: '#6D8EF7' },
                      { label: 'Login Access control', tab: 'Access Control', icon: '🔐', color: '#F59E0B' },
                      { label: 'Pending Approvals', tab: 'Approvals', icon: '✅', color: '#10B981' },
                      { label: 'Platform Analytics', tab: 'Analytics', icon: '📈', color: '#8EC5FC' },
                    ].map((a, i) => (
                      <button key={i} onClick={() => setActiveTab(a.tab)} style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, color: '#1E293B', padding: '12px 14px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                      >
                        {a.icon} {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ══ USERS ══ */}
            {activeTab === 'Users' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: 0, color: '#1E293B' }}>
                    Registered Users <span style={{ color: '#64748B', fontSize: 15, fontWeight: 600 }}>({users.length})</span>
                  </h2>
                  <input placeholder="🔍 Search users by name..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ padding: '9px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 13, outline: 'none', fontFamily: 'DM Sans,sans-serif', width: isMobile ? '100%' : 240, fontWeight: 500 }}
                    onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>

                {isMobile ? (
                  // Mobile: Card list
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filteredUsers.map((u, i) => (
                      <div key={u._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: 14, animation: `fadeUp 0.4s ease ${i * 0.04}s both`, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg,${roleColors[u.role] || '#6D8EF7'},#A5B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0, color: '#fff' }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, color: '#1E293B', fontSize: 14 }}>{u.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{u.email}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, color: '#1E293B', padding: '5px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'DM Sans,sans-serif', flex: 1 }}>
                            {['admin', 'instructor', 'student', 'content_manager', 'moderator'].map(r => (
                              <option key={r} value={r} style={{ background: '#FFFFFF', color: '#1E293B' }}>{r}</option>
                            ))}
                          </select>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: u.isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: u.isApproved ? '#10B981' : '#F59E0B', fontWeight: 700, border: `1px solid ${u.isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                            {u.isApproved ? '● Active' : '○ Pending'}
                          </span>
                          <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans,sans-serif', fontWeight: 700 }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Desktop: Table
                  <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                          <tr style={{ borderBottom: '1.5px solid #E2E8F0', background: '#F8FAFC' }}>
                            {['User Profile', 'Email Address', 'Platform Role', 'Roster Status', 'Joined Date', 'Actions'].map(h => (
                              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748B', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u, i) => (
                            <tr key={u._id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${roleColors[u.role] || '#6D8EF7'},#A5B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, color: '#fff' }}>
                                    {u.name?.[0]?.toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: 700, color: '#1E293B' }}>{u.name}</span>
                                </div>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12, fontWeight: 500 }}>{u.email}</td>
                              <td style={{ padding: '12px 16px' }}>
                                <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', padding: '4px 8px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer', outline: 'none', fontFamily: 'DM Sans,sans-serif' }}>
                                  {['admin', 'instructor', 'student', 'content_manager', 'moderator'].map(r => (
                                    <option key={r} value={r} style={{ background: '#FFFFFF', color: '#1E293B' }}>{r}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: u.isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: u.isApproved ? '#10B981' : '#F59E0B', fontWeight: 700, border: `1px solid ${u.isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                                  {u.isApproved ? 'Active' : 'Pending'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 16px', color: '#64748B', fontSize: 12, fontWeight: 500 }}>
                                {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td style={{ padding: '12px 16px' }}>
                                <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans,sans-serif', fontWeight: 700 }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredUsers.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: '#64748B', fontWeight: 500 }}>No users found</div>}
                  </div>
                )}
              </div>
            )}

            {/* ══ COURSES ══ */}
            {activeTab === 'Courses' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#1E293B' }}>
                  Manage Platform Courses <span style={{ color: '#64748B', fontSize: 15, fontWeight: 600 }}>({courses.length})</span>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {courses.map((c, i) => (
                    <div key={c._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, animation: `fadeUp 0.4s ease ${i * 0.04}s both`, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1E293B', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{c.instructor?.name} · {c.category} · {c.level}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: c.isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)', color: c.isApproved ? '#10B981' : '#F59E0B', fontWeight: 700, border: `1px solid ${c.isApproved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                          {c.isApproved ? '✓ Live' : '⏳ Pending'}
                        </span>
                        <button onClick={() => handleDeleteCourse(c._id)} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '5px 12px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans,sans-serif', fontWeight: 700 }}>Delete</button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#64748B', background: '#FFFFFF', borderRadius: 16, border: '1.5px solid #E2E8F0', fontWeight: 500 }}>No courses found</div>}
                </div>
              </div>
            )}

            {/* ══ APPROVALS ══ */}
            {activeTab === 'Approvals' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#1E293B' }}>
                  Pending Course Approvals
                  {pendingCourses.length > 0 && <span style={{ marginLeft: 10, background: '#F59E0B', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{pendingCourses.length}</span>}
                </h2>
                {pendingCourses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', background: '#FFFFFF', borderRadius: 18, border: '1.5px dashed #10B981', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                    <p style={{ color: '#64748B', fontWeight: 600, fontSize: 14 }}>All submitted courses are approved!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {pendingCourses.map((c, i) => (
                      <div key={c._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 18, animation: `fadeUp 0.5s ease ${i * 0.08}s both`, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, margin: '0 0 6px', color: '#1E293B' }}>{c.title}</h3>
                            <p style={{ color: '#64748B', fontSize: 13, margin: '0 0 10px', lineHeight: 1.5, fontWeight: 500 }}>
                              {c.description?.slice(0, 100)}{c.description?.length > 100 ? '...' : ''}
                            </p>
                            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748B', flexWrap: 'wrap', fontWeight: 600 }}>
                              <span>👨‍🏫 Instructor: {c.instructor?.name}</span>
                              <span>📂 Category: {c.category}</span>
                              <span style={{ textTransform: 'capitalize' }}>📊 Level: {c.level}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <button onClick={() => handleApproveCourse(c._id)} style={{ background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', color: '#fff', padding: '9px 16px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(16,185,129,0.2)' }}>✅ Approve Course</button>
                            <button onClick={() => handleDeleteCourse(c._id)} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>Reject</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ══ ACCESS CONTROL ══ */}
            {activeTab === 'Access Control' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 6px', color: '#1E293B' }}>
                  🔐 Access Request Queue
                  {pendingUsers.length > 0 && <span style={{ marginLeft: 10, background: '#6D8EF7', color: '#fff', borderRadius: 100, padding: '2px 10px', fontSize: 13, fontWeight: 700 }}>{pendingUsers.length}</span>}
                </h2>
                <p style={{ color: '#64748B', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>Approve login registrations and access privileges for new cohorts</p>

                {pendingUsers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px', background: '#FFFFFF', borderRadius: 16, border: '1.5px dashed #E2E8F0', marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
                    <p style={{ color: '#64748B', fontWeight: 600, fontSize: 13 }}>No pending registrations!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {pendingUsers.map((u, i) => (
                      <div key={u._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 14, padding: 16, animation: `fadeUp 0.5s ease ${i * 0.07}s both`, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, flexShrink: 0, color: '#fff' }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#1E293B' }}>{u.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{u.email}</p>
                            <span style={{ fontSize: 11, color: '#F59E0B', textTransform: 'capitalize', fontWeight: 700 }}>Requested: {u.role}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => handleApproveUser(u._id)} style={{ flex: 1, background: 'linear-gradient(135deg,#10B981,#059669)', border: 'none', color: '#fff', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(16,185,129,0.2)' }}>
                            ✅ Grant Login Access
                          </button>
                          <button onClick={() => handleRejectUser(u._id)} style={{ flex: 1, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '10px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif' }}>
                            ❌ Deny request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, margin: '0 0 12px', color: '#1E293B' }}>
                  Authorized Active Directory <span style={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>({users.filter(u => u.isApproved).length})</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {users.filter(u => u.isApproved).map((u, i) => (
                    <div key={u._id} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg,${roleColors[u.role] || '#6D8EF7'},#A5B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0, color: '#fff' }}>
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: '#1E293B', fontSize: 13 }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{u.email}</p>
                      </div>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: (roleColors[u.role] || '#6D8EF7') + '15', color: roleColors[u.role] || '#6D8EF7', flexShrink: 0, textTransform: 'capitalize', fontWeight: 700 }}>{u.role}</span>
                      <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans,sans-serif', flexShrink: 0, fontWeight: 700 }}>Revoke</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ ANALYTICS ══ */}
            {activeTab === 'Analytics' && (
              <div style={{ animation: 'fadeIn 0.4s ease both' }}>
                <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 16px', color: '#1E293B' }}>Platform Analytics</h2>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                  <StatCard icon="👥" label="Total Users" value={users.length} color="#6D8EF7" delay={0.05} />
                  <StatCard icon="✅" label="Approved active" value={users.filter(u => u.isApproved).length} color="#10B981" delay={0.1} />
                  <StatCard icon="📚" label="Live Courses" value={courses.length} color="#8EC5FC" delay={0.15} />
                  <StatCard icon="👨‍🏫" label="Instructors" value={users.filter(u => u.role === 'instructor').length} color="#F59E0B" delay={0.2} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                  <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 20px', color: '#1E293B' }}>Monthly Student Signups</h3>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
                      {[
                        { month: 'Oct', users: 40 }, { month: 'Nov', users: 65 },
                        { month: 'Dec', users: 55 }, { month: 'Jan', users: 80 },
                        { month: 'Feb', users: 70 }, { month: 'Mar', users: 100 },
                      ].map((d, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ width: '100%', borderRadius: '4px 4px 0 0', height: `${d.users}%`, background: i === 5 ? 'linear-gradient(to top,#7C9CF5,#A5B8FF)' : 'rgba(124,156,245,0.3)', transition: 'all 0.3s', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(to top,#7C9CF5,#A5B8FF)'}
                            onMouseLeave={e => { if (i !== 5) e.currentTarget.style.background = 'rgba(124,156,245,0.3)' }} />
                          <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>{d.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 16px', color: '#1E293B' }}>Platform Health Meters</h3>
                    {[
                      { label: 'User Verification Rate', value: users.length > 0 ? Math.round((users.filter(u => u.isApproved).length / users.length) * 100) : 0, color: '#10B981' },
                      { label: 'Course Quality Standard', value: (courses.length + pendingCourses.length) > 0 ? Math.round((courses.length / (courses.length + pendingCourses.length)) * 100) : 0, color: '#6D8EF7' },
                      { label: 'CS Lab Completion Ratios', value: 78, color: '#8EC5FC' },
                      { label: 'Assessment Passing Rate', value: 92, color: '#F59E0B' },
                    ].map((item, i) => (
                      <div key={i} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>{item.label}</span>
                          <span style={{ color: item.color, fontWeight: 700 }}>{item.value}%</span>
                        </div>
                        <div style={{ background: '#F1F5F9', borderRadius: 100, height: 7 }}>
                          <div style={{ height: 7, borderRadius: 100, width: `${item.value}%`, background: item.color, transition: 'width 1.2s ease' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
        input::placeholder { color: #94A3B8; }
        select option { background: #FFFFFF; color: #1E293B; }
        @media (max-width: 768px) { * { -webkit-tap-highlight-color: transparent; } }
      `}</style>
    </div>
  )
}

export default AdminPanel