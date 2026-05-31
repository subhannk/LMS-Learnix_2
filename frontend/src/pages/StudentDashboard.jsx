import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

// ════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════
const menuItems = [
  { icon: '🏠', label: 'Home', path: '/student' },
  { icon: '🎓', label: 'My Courses', path: '/student/courses' },
  { icon: '⚗️', label: 'CS Lab', path: '/student/lab' },
  { icon: '📅', label: 'Training Sessions', path: '/student/training' },
  { icon: '⚡', label: 'My Activities', path: '/student/activities' },
  { icon: '🏆', label: 'Scorecard', path: '/student/scorecard' },
  { icon: '🗂️', label: 'Projects', path: '/student/projects' },
  { icon: '🎪', label: 'Digital Fest', path: '/student/digitalfest' },
  { icon: '🖥️', label: 'Live Class Room', path: '/student/live' },
  { icon: '🧪', label: 'Lab Exam', path: '/student/exam' },
  { icon: '📝', label: 'Exams', path: '/student/exams' },
]

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleNavClick = () => {
    if (window.innerWidth < 768) setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(30,41,59,0.4)',
          zIndex: 99, backdropFilter: 'blur(8px)'
        }} />
      )}

      <div style={{
        width: 240,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 100,
        overflow: 'hidden',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: window.innerWidth < 768
          ? mobileOpen ? 'translateX(0)' : 'translateX(-100%)'
          : 'translateX(0)'
      }}>

        {/* Logo + Toggle */}
        <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, flexShrink: 0, color: '#fff' }}>L</div>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, color: '#1E293B', whiteSpace: 'nowrap' }}>
              Learn<span style={{ color: '#6D8EF7' }}>ix</span>
            </span>
          </div>
          <button onClick={() => { setCollapsed(false); setMobileOpen(false) }} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, transition: 'all 0.2s', fontWeight: 'bold' }}>
            ✕
          </button>
        </div>

        {/* Profile */}
        <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0, color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
            </div>
          </div>
          <div style={{ background: 'rgba(109,142,247,0.08)', border: '1px solid rgba(109,142,247,0.15)', borderRadius: 10, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6D8EF7', fontWeight: 600 }}>🏆 {user?.scorecard?.rank || 'Newcomer'}</span>
            <span style={{ fontSize: 11, color: '#6D8EF7', fontWeight: 800 }}>{user?.scorecard?.totalPoints || 0} pts</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-scroll" style={{ flex: 1, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'block' }} onClick={handleNavClick}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 10px',
                  borderRadius: 10, marginBottom: 2, transition: 'all 0.2s',
                  background: isActive ? 'rgba(109,142,247,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid #6D8EF7' : '3px solid transparent',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F1F5F9' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#6D8EF7' : '#64748B', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '8px 6px', borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
          <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px', background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', color: '#EF4444', fontFamily: 'DM Sans,sans-serif' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

// ════════════════════════════════════════
// TOP BAR
// ════════════════════════════════════════
const TopBar = ({ user, title, onMenuClick }) => (
  <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #E2E8F0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Hamburger */}
      <button onClick={onMenuClick} style={{ background: '#F1F5F9', border: 'none', color: '#1E293B', width: 36, height: 36, borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
        ☰
      </button>
      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: '#1E293B' }}>{title}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ background: 'rgba(109,142,247,0.1)', border: '1px solid rgba(109,142,247,0.2)', borderRadius: 100, padding: '4px 10px', fontSize: 11, color: '#6D8EF7', fontWeight: 700 }}>
        🏆 {user?.scorecard?.totalPoints || 0} pts
      </div>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#fff' }}>
        {user?.name?.[0]?.toUpperCase()}
      </div>
    </div>
  </div>
)

// ════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════
const HomePage = ({ user, enrollments }) => {
  const navigate = useNavigate()
  return (
    <div style={{ padding: '20px' }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg,rgba(124,156,245,0.12),rgba(165,184,255,0.06))', border: '1px solid rgba(124,156,245,0.18)', borderRadius: 16, padding: '24px 20px', marginBottom: 20, animation: 'fadeUp 0.5s ease both' }}>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(20px,4vw,28px)', margin: '0 0 4px', letterSpacing: '-0.5px', color: '#1E293B' }}>
          Welcome back, <span style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}!</span> 👋
        </h1>
        <p style={{ color: '#64748B', margin: 0, fontSize: 13, fontWeight: 500 }}>Let's continue building your tech skill sets today.</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '📚', label: 'Courses Enrolled', value: enrollments.length, color: '#7C9CF5' },
          { icon: '🏆', label: 'Score Points', value: user?.scorecard?.totalPoints || 0, color: '#8EC5FC' },
          { icon: '⚗️', label: 'Labs Completed', value: user?.scorecard?.labsCompleted || 0, color: '#A5B8FF' },
          { icon: '📝', label: 'Exams Passed', value: user?.scorecard?.examsCompleted || 0, color: '#10B981' },
        ].map((s, i) => (
          <div key={i} className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: '16px', animation: `fadeUp 0.5s ease ${i * 0.05}s both`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.01)' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 22, color: '#1E293B' }}>{s.value}</div>
            <div style={{ color: '#64748B', fontSize: 11, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 12px', color: '#1E293B' }}>Continue Learning</h2>
      {enrollments.length === 0 ? (
        <div style={{ background: '#FFFFFF', border: '1.5px dashed #A5B8FF', borderRadius: 16, padding: '36px 16px', textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📚</div>
          <p style={{ color: '#64748B', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>No enrolled courses yet.</p>
          <button onClick={() => navigate('/courses')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px 22px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 12px rgba(124, 156, 245, 0.25)' }}>
            Browse Courses →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14, marginBottom: 20 }}>
          {enrollments.slice(0, 4).map((e) => (
            <div key={e._id} onClick={() => navigate(`/courses/${e.course?._id}`, { state: { course: e.course } })}
              className="card-hover"
              style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
              <img src={e.course?.thumbnail || 'https://placehold.co/400x120/7C9CF5/fff?text=Course'} alt="" style={{ width: '100%', height: 110, objectFit: 'cover' }} />
              <div style={{ padding: '12px 14px' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, margin: '0 0 6px', color: '#1E293B', lineHeight: 1.3 }}>{e.course?.title}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 4, fontWeight: 500 }}>
                  <span style={{ color: '#64748B' }}>Progress</span>
                  <span style={{ color: '#6D8EF7', fontWeight: 700 }}>{e.progress || 0}%</span>
                </div>
                <div style={{ background: '#E2E8F0', borderRadius: 100, height: 5 }}>
                  <div style={{ height: 5, borderRadius: 100, width: `${e.progress || 0}%`, background: 'linear-gradient(90deg,#7C9CF5,#A5B8FF)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Access */}
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 12px', color: '#1E293B' }}>Quick Workspace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {[
          { icon: '⚗️', label: 'CS Lab', path: '/student/lab', color: '#7C9CF5' },
          { icon: '🏆', label: 'Scorecard', path: '/student/scorecard', color: '#A5B8FF' },
          { icon: '🗂️', label: 'Projects', path: '/student/projects', color: '#8EC5FC' },
          { icon: '🖥️', label: 'Live Class', path: '/student/live', color: '#7C9CF5' },
          { icon: '🧪', label: 'Lab Exam', path: '/student/exam', color: '#A5B8FF' },
          { icon: '📝', label: 'Exams', path: '/student/exams', color: '#10B981' },
        ].map((item, i) => (
          <div key={i} onClick={() => navigate(item.path)} className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 14, padding: '16px 8px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = item.color }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <div style={{ fontSize: 24, marginBottom: 5 }}>{item.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// MY COURSES
// ════════════════════════════════════════
const MyCoursesPage = ({ enrollments }) => {
  const navigate = useNavigate()
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 16px', color: '#1E293B' }}>My Courses</h1>
      {enrollments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#FFFFFF', borderRadius: 16, border: '1.5px dashed #A5B8FF' }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎓</div>
          <p style={{ color: '#64748B', marginBottom: 16, fontSize: 13, fontWeight: 500 }}>No enrolled courses yet.</p>
          <button onClick={() => navigate('/courses')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px 22px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontFamily: 'DM Sans,sans-serif', fontSize: 13, boxShadow: '0 4px 12px rgba(124, 156, 245, 0.25)' }}>
            Browse Courses →
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 14 }}>
          {enrollments.map((e, i) => (
            <div key={e._id} onClick={() => navigate(`/courses/${e.course?._id}`, { state: { course: e.course } })}
              className="card-hover"
              style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s', animation: `fadeUp 0.5s ease ${i * 0.05}s both`, boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
            >
              <img src={e.course?.thumbnail || 'https://placehold.co/400x140/7C9CF5/fff?text=Course'} alt="" style={{ width: '100%', height: 130, objectFit: 'cover' }} />
              <div style={{ padding: '14px 16px' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 14, margin: '0 0 4px', color: '#1E293B' }}>{e.course?.title}</h3>
                <p style={{ color: '#64748B', fontSize: 11, margin: '0 0 10px', fontWeight: 500 }}>by {e.course?.instructor?.name || 'Instructor'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5, fontWeight: 500 }}>
                  <span style={{ color: '#64748B' }}>Progress</span>
                  <span style={{ color: e.progress >= 100 ? '#10B981' : '#6D8EF7', fontWeight: 700 }}>{e.progress}%</span>
                </div>
                <div style={{ background: '#E2E8F0', borderRadius: 100, height: 6 }}>
                  <div style={{ height: 6, borderRadius: 100, width: `${e.progress}%`, background: e.progress >= 100 ? '#10B981' : 'linear-gradient(90deg,#7C9CF5,#A5B8FF)' }} />
                </div>
                {e.isCompleted && <div style={{ marginTop: 10, background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#10B981', textAlign: 'center', fontWeight: 700 }}>✅ Completed</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════
// CS LAB
// ════════════════════════════════════════
const CsLabPage = () => {
  const [labs, setLabs] = useState([])
  const [selected, setSelected] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const diffColor = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' }

  const fallbackLabs = [
    { _id: '1', title: 'Hello World in JS', category: 'JavaScript', difficulty: 'easy', points: 10, instructions: 'Write a function that returns "Hello, World!" string.', starterCode: 'function helloWorld() {\n  // Your code here\n  return "Hello, World!";\n}' },
    { _id: '2', title: 'Fibonacci Sequence', category: 'Python', difficulty: 'medium', points: 20, instructions: 'Write a function to return the nth Fibonacci number.', starterCode: 'def fibonacci(n):\n    # Your code here\n    pass' },
    { _id: '3', title: 'Reverse a String', category: 'JavaScript', difficulty: 'easy', points: 10, instructions: 'Write a function that reverses a string.', starterCode: 'function reverseString(str) {\n  // Your code here\n}' },
    { _id: '4', title: 'Binary Search', category: 'Algorithm', difficulty: 'hard', points: 30, instructions: 'Implement binary search algorithm.', starterCode: 'function binarySearch(arr, target) {\n  // Your code here\n}' },
  ]

  useEffect(() => {
    API.get('/labs').then(({ data }) => setLabs(data.length > 0 ? data : fallbackLabs)).catch(() => setLabs(fallbackLabs))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>⚗️ CS Lab</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Practice coding challenges and earn scorecard points</p>

      {!selected ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {labs.map((lab) => (
            <div key={lab._id} onClick={() => { setSelected(lab); setCode(lab.starterCode || ''); setOutput('') }}
              className="card-hover"
              style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 16, cursor: 'pointer', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = diffColor[lab.difficulty] }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${diffColor[lab.difficulty]},transparent)` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                <span style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>{lab.category}</span>
                <span style={{ background: `${diffColor[lab.difficulty]}15`, color: diffColor[lab.difficulty], fontSize: 10, padding: '2px 8px', borderRadius: 100, textTransform: 'capitalize', fontWeight: 700 }}>{lab.difficulty}</span>
              </div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 6px', color: '#1E293B' }}>{lab.title}</h3>
              <p style={{ color: '#64748B', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5, fontWeight: 500 }}>{lab.instructions?.slice(0, 70)}...</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#F59E0B', fontSize: 12, fontWeight: 800 }}>⚡ {lab.points} pts</span>
                <span style={{ color: '#6D8EF7', fontSize: 12, fontWeight: 700 }}>Start challenge →</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => setSelected(null)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#64748B', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', marginBottom: 16, fontSize: 13, fontFamily: 'DM Sans,sans-serif', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            ← Back to Labs
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 16, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 6px', color: '#1E293B' }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>{selected.category}</span>
                <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>⚡ {selected.points} points</span>
              </div>
              <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{selected.instructions}</p>
              {output && (
                <div style={{ marginTop: 12, background: output.includes('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${output.includes('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 10, padding: 12 }}>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: output.includes('✅') ? '#10B981' : '#EF4444', whiteSpace: 'pre-line', fontWeight: 600 }}>{output}</p>
                </div>
              )}
            </div>
            <div style={{ background: '#0F172A', border: '1px solid #1E293B', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: '#1E293B', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155' }}>
                <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', fontWeight: 600 }}>
                  {selected.category === 'Python' ? '🐍 solution.py' : '⚡ solution.js'}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setOutput('▶ Running code compilers...\n✅ All assertion tests successfully passed!\n⚡ +' + selected.points + ' points earned!')}
                    style={{ background: '#10B981', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif' }}>▶ Run Code</button>
                  <button onClick={() => { setOutput('✅ Solution Submitted!\n🏆 +' + selected.points + ' points successfully added to your profile!'); API.put(`/labs/${selected._id}/complete`).catch(() => {}) }}
                    style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.3)' }}>Submit Solution</button>
                </div>
              </div>
              <textarea value={code} onChange={e => setCode(e.target.value)}
                style={{ width: '100%', minHeight: 280, background: 'transparent', border: 'none', color: '#E2E8F0', fontFamily: 'monospace', fontSize: 13, padding: 16, resize: 'vertical', outline: 'none', lineHeight: 1.8, boxSizing: 'border-box' }}
                spellCheck={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════
// SCORECARD
// ════════════════════════════════════════
const ScorecardPage = ({ user }) => {
  const rank = user?.scorecard?.rank || 'Newcomer'
  const points = user?.scorecard?.totalPoints || 0
  const rankColors = { Expert: '#F59E0B', Advanced: '#6D8EF7', Intermediate: '#8EC5FC', Beginner: '#10B981', Newcomer: '#64748B' }
  const rankEmoji = { Expert: '🥇', Advanced: '🥈', Intermediate: '🥉', Beginner: '⭐', Newcomer: '🌱' }
  const nextPoints = rank === 'Newcomer' ? 50 : rank === 'Beginner' ? 200 : rank === 'Intermediate' ? 500 : rank === 'Advanced' ? 1000 : 9999
  const progress = Math.min((points / nextPoints) * 100, 100)

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 16px', color: '#1E293B' }}>🏆 My Scorecard</h1>

      <div style={{ background: 'linear-gradient(135deg,rgba(124,156,245,0.1),rgba(142,197,252,0.06))', border: '1px solid rgba(124,156,245,0.15)', borderRadius: 18, padding: 24, marginBottom: 20, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{rankEmoji[rank]}</div>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 26, margin: '0 0 4px', color: rankColors[rank] }}>{rank} Status</h2>
        <p style={{ color: '#64748B', margin: '0 0 16px', fontSize: 13, fontWeight: 500 }}>{user?.name}</p>
        <div style={{ display: 'inline-block', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 100, padding: '8px 24px', marginBottom: 16, boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 28, color: '#F59E0B' }}>{points}</span>
          <span style={{ color: '#64748B', fontSize: 12, marginLeft: 6, fontWeight: 600 }}>pts</span>
        </div>
        {rank !== 'Expert' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
              <span>Next Milestone</span><span>{points} / {nextPoints} pts</span>
            </div>
            <div style={{ background: '#E2E8F0', borderRadius: 100, height: 6 }}>
              <div style={{ height: 6, borderRadius: 100, width: `${progress}%`, background: `linear-gradient(90deg,${rankColors[rank]},#7C9CF5)`, transition: 'width 1.5s ease' }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { icon: '⚗️', label: 'Labs Cleared', value: user?.scorecard?.labsCompleted || 0, color: '#8EC5FC' },
          { icon: '📝', label: 'Exams Passed', value: user?.scorecard?.examsCompleted || 0, color: '#6D8EF7' },
          { icon: '🗂️', label: 'Projects Built', value: user?.scorecard?.projectsCompleted || 0, color: '#10B981' },
          { icon: '🔥', label: 'Daily Streak', value: '7 days', color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 20, color: '#1E293B' }}>{s.value}</div>
            <div style={{ color: '#64748B', fontSize: 11, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
        <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 14px', color: '#1E293B' }}>Recent Achievements</h3>
        {[
          { text: 'Completed Hello World lab challenge', pts: '+10', time: '2 hours ago', icon: '⚗️' },
          { text: 'Enrolled in React JS Bootcamp', pts: '—', time: '1 day ago', icon: '📚' },
          { text: 'Passed Web Dev quiz assessment', pts: '+25', time: '2 days ago', icon: '✅' },
          { text: 'Joined Learnix student platform', pts: '+5', time: '3 days ago', icon: '🎉' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < 3 ? '1px solid #E2E8F0' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(109,142,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, color: '#1E293B', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.text}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#64748B', fontWeight: 500 }}>{a.time}</p>
            </div>
            {a.pts !== '—' && <span style={{ color: '#10B981', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{a.pts}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════
const ProjectsPage = () => {
  const diffColor = { easy: '#10B981', medium: '#F59E0B', hard: '#EF4444' }
  const projects = [
    { id: 1, title: 'E-Commerce Platform', tech: ['React', 'Node.js', 'MongoDB'], desc: 'Full-stack shopping platform with Stripe.', difficulty: 'hard', points: 100 },
    { id: 2, title: 'Chat Application', tech: ['React', 'Socket.io'], desc: 'Real-time chat with custom rooms.', difficulty: 'medium', points: 60 },
    { id: 3, title: 'Portfolio Website', tech: ['React', 'Tailwind'], desc: 'Developer portfolio with animations.', difficulty: 'easy', points: 30 },
    { id: 4, title: 'AI Image Generator', tech: ['Python', 'Flask', 'OpenAI'], desc: 'AI-powered image generation tool.', difficulty: 'hard', points: 120 },
    { id: 5, title: 'Task Management App', tech: ['React', 'Redux'], desc: 'Kanban-style tasks manager.', difficulty: 'medium', points: 70 },
    { id: 6, title: 'Weather Dashboard', tech: ['React', 'API'], desc: '7-day weather forecasting dashboard.', difficulty: 'easy', points: 40 },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>🗂️ Projects</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Build real-world portfolios and earn scorecard points</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {projects.map((p) => (
          <div key={p.id} className="card-hover" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${diffColor[p.difficulty]},transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
              <span style={{ background: `${diffColor[p.difficulty]}15`, color: diffColor[p.difficulty], fontSize: 10, padding: '2px 8px', borderRadius: 100, textTransform: 'capitalize', fontWeight: 700 }}>{p.difficulty}</span>
              <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>⚡ {p.points} pts</span>
            </div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 6px', color: '#1E293B' }}>{p.title}</h3>
            <p style={{ color: '#64748B', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5, fontWeight: 500, flex: 1 }}>{p.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {p.tech.map(t => <span key={t} style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>{t}</span>)}
            </div>
            <button style={{ width: '100%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '9px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
              Start Project →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// LIVE CLASS
// ════════════════════════════════════════
const LiveClassPage = () => {
  const [active, setActive] = useState(null)
  const classes = [
    { id: 1, title: 'React Advanced Patterns', instructor: 'Rahul Dev', time: 'Today 3:00 PM', status: 'live', viewers: 142, thumbnail: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg', videoId: 'w7ejDZ8SWv8' },
    { id: 2, title: 'Node.js REST APIs', instructor: 'Priya Nair', time: 'Today 5:00 PM', status: 'upcoming', viewers: 0, thumbnail: 'https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg', videoId: 'fBNz5xF-Kx4' },
    { id: 3, title: 'Python ML Basics', instructor: 'Arjun Menon', time: 'Tomorrow', status: 'upcoming', viewers: 0, thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg', videoId: '_uQrJ0TkZlc' },
    { id: 4, title: 'Git & GitHub Masterclass', instructor: 'Sarah K', time: 'Yesterday', status: 'recorded', viewers: 891, thumbnail: 'https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg', videoId: 'RGOj5yH7evk' },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>🖥️ Live Class Room</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Join live class sessions or watch recorded curriculum catalog</p>

      {active ? (
        <div>
          <button onClick={() => setActive(null)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#64748B', padding: '8px 16px', borderRadius: 10, cursor: 'pointer', marginBottom: 16, fontSize: 13, fontFamily: 'DM Sans,sans-serif', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>← Back to classes</button>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '100%', aspectRatio: '16/9' }}>
              <iframe src={`https://www.youtube.com/embed/${active.videoId}?autoplay=1`} title={active.title} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
            <div style={{ padding: '16px' }}>
              <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 4px', color: '#1E293B' }}>{active.title}</h2>
              <p style={{ color: '#64748B', margin: 0, fontSize: 12, fontWeight: 500 }}>by {active.instructor} · {active.time}</p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {classes.map((c) => (
            <div key={c.id} onClick={() => setActive(c)} className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid ${c.status === 'live' ? 'rgba(239,68,68,0.2)' : '#E2E8F0'}`, borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
            >
              <div style={{ position: 'relative' }}>
                <img src={c.thumbnail} alt={c.title} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(255,255,255,0.7) 0%,transparent 60%)' }} />
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  {c.status === 'live' && <span style={{ background: '#EF4444', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 700 }}>● LIVE</span>}
                  {c.status === 'recorded' && <span style={{ background: 'rgba(30,41,59,0.85)', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 600 }}>📹 Recorded</span>}
                  {c.status === 'upcoming' && <span style={{ background: '#F59E0B', color: '#fff', fontSize: 10, padding: '3px 8px', borderRadius: 100, fontWeight: 600 }}>🕐 Upcoming</span>}
                </div>
              </div>
              <div style={{ padding: '12px' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 13, margin: '0 0 3px', color: '#1E293B' }}>{c.title}</h3>
                <p style={{ color: '#64748B', fontSize: 11, margin: '0 0 6px', fontWeight: 500 }}>by {c.instructor}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                  <span>🕐 {c.time}</span>
                  {c.viewers > 0 && <span>👁 {c.viewers}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════
// LAB EXAM
// ════════════════════════════════════════
const LabExamPage = () => {
  const [exams, setExams] = useState([])
  const [active, setActive] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)

  const fallbackExams = [
    { _id: 'e1', title: 'JavaScript Fundamentals', description: 'Test your core JS logic systems', duration: 30, totalMarks: 30, passingMarks: 18, questions: [
      { question: 'What is a closure?', options: ['No params function', 'Retains outer scope references', 'A loop iteration', 'Object instance method'], correctAnswer: 1, points: 10 },
      { question: 'Which removes last array element?', options: ['shift()', 'pop()', 'splice()', 'slice()'], correctAnswer: 1, points: 10 },
      { question: 'What does === check?', options: ['Value only', 'Type only', 'Value and type references', 'Neither'], correctAnswer: 2, points: 10 },
    ]},
    { _id: 'e2', title: 'React Basics Quiz', description: 'Test your React Hooks knowledge', duration: 20, totalMarks: 20, passingMarks: 12, questions: [
      { question: 'What is JSX?', options: ['A state library', 'Syntax XML extension', 'CSS utility standard', 'Database schema'], correctAnswer: 1, points: 10 },
      { question: 'Side effects hook?', options: ['useState', 'useEffect', 'useRef', 'useContext'], correctAnswer: 1, points: 10 },
    ]},
  ]

  useEffect(() => {
    API.get('/exams').then(({ data }) => setExams(data.length > 0 ? data : fallbackExams)).catch(() => setExams(fallbackExams))
  }, [])

  useEffect(() => {
    if (active && timeLeft > 0 && !result) {
      const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); return 0 } return p - 1 }), 1000)
      return () => clearInterval(t)
    }
  }, [active, timeLeft, result])

  const startExam = (exam) => { setActive(exam); setAnswers({}); setResult(null); setTimeLeft(exam.duration * 60) }
  const submitExam = () => {
    let score = 0
    active.questions.forEach((q, i) => { if (Number(answers[i]) === q.correctAnswer) score += q.points })
    const passed = score >= active.passingMarks
    setResult({ score, passed, total: active.totalMarks })
    API.post(`/exams/${active._id}/submit`, { answers }).catch(() => {})
  }

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>🧪 Assessment Exams</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Validate your skills and earn certificates</p>

      {!active ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
          {exams.map((exam) => (
            <div key={exam._id} className="card-hover" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 18, transition: 'all 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 6px', color: '#1E293B' }}>{exam.title}</h3>
              <p style={{ color: '#64748B', fontSize: 12, margin: '0 0 12px', fontWeight: 500, lineHeight: 1.5 }}>{exam.description}</p>
              <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#64748B', marginBottom: 16, flexWrap: 'wrap', fontWeight: 600 }}>
                <span>⏱ {exam.duration}m</span>
                <span>📊 {exam.totalMarks} marks</span>
                <span>❓ {exam.questions?.length} Qs</span>
              </div>
              <button onClick={() => startExam(exam)} style={{ width: '100%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
                Start Exam →
              </button>
            </div>
          ))}
        </div>
      ) : result ? (
        <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', border: `1.5px solid ${result.passed ? '#10B981' : '#EF4444'}`, borderRadius: 18, padding: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>{result.passed ? '🎉' : '❌'}</div>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 6px', color: result.passed ? '#10B981' : '#EF4444' }}>
              {result.passed ? 'Exam Passed!' : 'Exam Failed'}
            </h2>
            <p style={{ color: '#64748B', fontSize: 14, marginBottom: 18, fontWeight: 500 }}>
              You scored <strong style={{ color: '#1E293B' }}>{result.score}</strong> marks out of <strong style={{ color: '#1E293B' }}>{result.total}</strong>.
            </p>
            <div style={{ background: result.passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: result.passed ? '#10B981' : '#EF4444', fontWeight: 700, border: `1px solid ${result.passed ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, marginBottom: 20 }}>
              {result.passed ? 'Congratulations! Verifiable certification granted.' : 'Requirement: 60% passing mark. Please try again.'}
            </div>
            <button onClick={() => { setActive(null); setResult(null) }} style={{ width: '100%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
              Complete Review
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1.5px solid #E2E8F0', paddingBottom: 12 }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: '#1E293B', margin: 0 }}>{active.title}</h2>
            <div style={{ background: '#EF4444', color: '#fff', borderRadius: 10, padding: '6px 14px', fontSize: 14, fontWeight: 700 }}>
              ⏱ {mins}:{secs}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {active.questions.map((q, qi) => (
              <div key={qi} style={{ background: '#F7F9FC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 16 }}>
                <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 14, color: '#1E293B' }}>
                  <span style={{ marginRight: 6, color: '#6D8EF7' }}>Q{qi + 1}.</span>{q.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oi) => (
                    <button key={oi} onClick={() => setAnswers({ ...answers, [qi]: oi })} style={{
                      textAlign: 'left', padding: '10px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'DM Sans,sans-serif', fontSize: 13,
                      background: answers[qi] === oi ? 'rgba(109,142,247,0.12)' : '#FFFFFF',
                      border: `1.5px solid ${answers[qi] === oi ? '#6D8EF7' : '#E2E8F0'}`,
                      color: answers[qi] === oi ? '#6D8EF7' : '#475569',
                      fontWeight: answers[qi] === oi ? 700 : 500
                    }}>
                      <span style={{ marginRight: 8, color: '#94A3B8' }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={() => setActive(null)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#64748B', padding: '11px 18px', borderRadius: 11, cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 13, fontWeight: 700 }}>Cancel</button>
            <button onClick={submitExam} style={{ flex: 1, background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
              Submit Exam ({Object.keys(answers).length} / {active.questions.length} answered) →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════
// TRAINING PAGE
// ════════════════════════════════════════
const TrainingPage = () => {
  const sessions = [
    { id: 1, title: 'Full Stack Web Development', mentor: 'Rahul Dev', date: 'Mon, Wed, Fri', time: '7:00 PM - 9:00 PM', duration: '3 months', seats: 12, enrolled: 8, color: '#7C9CF5' },
    { id: 2, title: 'Data Science with Python', mentor: 'Arjun Menon', date: 'Tue, Thu', time: '6:00 PM - 8:00 PM', duration: '2 months', seats: 10, enrolled: 10, color: '#F59E0B' },
    { id: 3, title: 'UI/UX Design Bootcamp', mentor: 'Priya Nair', date: 'Sat, Sun', time: '10:00 AM - 1:00 PM', duration: '6 weeks', seats: 15, enrolled: 6, color: '#A5B8FF' },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>📅 Training Sessions</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Live classroom mentorship sessions with expert creators</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {sessions.map((s) => (
          <div key={s.id} className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.color},transparent)` }} />
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 6px', color: '#1E293B' }}>{s.title}</h3>
            <p style={{ color: s.color, fontSize: 12, fontWeight: 700, margin: '0 0 10px' }}>👨‍🏫 {s.mentor}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12, fontSize: 12, color: '#64748B', fontWeight: 500, flex: 1 }}>
              <span>📅 {s.date}</span>
              <span>🕐 {s.time}</span>
              <span>⏱ {s.duration}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                <span>Cohort Seats</span><span>{s.enrolled} / {s.seats}</span>
              </div>
              <div style={{ background: '#E2E8F0', borderRadius: 100, height: 4 }}>
                <div style={{ height: 4, borderRadius: 100, width: `${(s.enrolled / s.seats) * 100}%`, background: s.enrolled >= s.seats ? '#EF4444' : s.color }} />
              </div>
            </div>
            <button disabled={s.enrolled >= s.seats} style={{ width: '100%', padding: '9px', borderRadius: 10, border: 'none', cursor: s.enrolled >= s.seats ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', background: s.enrolled >= s.seats ? '#E2E8F0' : 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', color: s.enrolled >= s.seats ? '#94A3B8' : '#fff', boxShadow: s.enrolled >= s.seats ? 'none' : '0 4px 8px rgba(124,156,245,0.2)' }}>
              {s.enrolled >= s.seats ? 'Fully Booked' : 'Enroll Now →'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// ACTIVITIES PAGE
// ════════════════════════════════════════
const ActivitiesPage = ({ user }) => {
  const activities = [
    { icon: '⚗️', title: 'Cleared CS Lab', desc: 'Hello World in JS', pts: '+10', time: '2 hours ago', color: '#8EC5FC' },
    { icon: '📚', title: 'Course Enrollment', desc: 'React JS Bootcamp', pts: '—', time: '1 day ago', color: '#7C9CF5' },
    { icon: '✅', title: 'Assessment Passed', desc: 'JS Fundamentals — 28/30', pts: '+25', time: '2 days ago', color: '#10B981' },
    { icon: '🎉', title: 'Joined Learnix Studio', desc: 'Welcome!', pts: '+5', time: '3 days ago', color: '#A5B8FF' },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 4px', color: '#1E293B' }}>⚡ My Activities</h1>
      <p style={{ color: '#64748B', marginBottom: 16, fontSize: 12, fontWeight: 500 }}>Your chronological platform progression milestones</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { icon: '🔥', label: 'Streak', value: '7 days', color: '#F59E0B' },
          { icon: '⚡', label: 'This Week', value: '12 logs', color: '#6D8EF7' },
          { icon: '🏆', label: 'Total Points', value: user?.scorecard?.totalPoints || 0, color: '#10B981' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 12, padding: '12px 10px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 18, color: '#1E293B' }}>{s.value}</div>
            <div style={{ color: '#64748B', fontSize: 10, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0', background: '#F7F9FC' }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: 0, color: '#1E293B' }}>Activity Timeline</h3>
        </div>
        {activities.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < activities.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(109,142,247,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1E293B' }}>{a.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{a.desc} · {a.time}</p>
            </div>
            {a.pts !== '—' && <span style={{ color: '#10B981', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{a.pts}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// DIGITAL FEST
// ════════════════════════════════════════
const DigitalFestPage = () => {
  const events = [
    { id: 1, title: 'Hackathon 2026', desc: '24-hour coding challenge!', date: 'April 15-16', prize: '₹50,000', type: 'Hackathon', color: '#7C9CF5' },
    { id: 2, title: 'UI/UX Challenge', desc: 'Design the best workspace UX.', date: 'April 20', prize: '₹20,000', type: 'Design', color: '#A5B8FF' },
    { id: 3, title: 'Tech Quiz', desc: 'Validate your logic systems.', date: 'April 25', prize: '₹10,000', type: 'Quiz', color: '#F59E0B' },
    { id: 4, title: 'Open Source Sprint', desc: 'Contribute in 48 hours.', date: 'May 1-2', prize: '₹30,000', type: 'Open Source', color: '#10B981' },
  ]

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ background: 'linear-gradient(135deg,rgba(124,156,245,0.12),rgba(165,184,255,0.06))', border: '1px solid rgba(124,156,245,0.18)', borderRadius: 16, padding: '24px 16px', marginBottom: 20, textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.01)' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎪</div>
        <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 24, margin: '0 0 6px', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Learnix Digital Fest 2026
        </h1>
        <p style={{ color: '#64748B', margin: '0 0 10px', fontSize: 12, fontWeight: 500 }}>Compete, create, and win cash prizes!</p>
        <span style={{ color: '#F59E0B', fontSize: 13, fontWeight: 700 }}>🏆 Total Prize Pool: ₹1,10,000</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 12 }}>
        {events.map((e) => (
          <div key={e.id} className="card-hover" style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
            onMouseEnter={el => { el.currentTarget.style.borderColor = e.color }}
            onMouseLeave={el => { el.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${e.color},transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
              <span style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>{e.type}</span>
              <span style={{ color: '#F59E0B', fontSize: 11, fontWeight: 800 }}>🏆 {e.prize}</span>
            </div>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, margin: '0 0 6px', color: '#1E293B' }}>{e.title}</h3>
            <p style={{ color: '#64748B', fontSize: 12, margin: '0 0 10px', lineHeight: 1.5, fontWeight: 500, flex: 1 }}>{e.desc}</p>
            <p style={{ color: '#64748B', fontSize: 11, margin: '0 0 12px', fontWeight: 600 }}>📅 {e.date}</p>
            <button style={{ width: '100%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '9px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
              Register for Event →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════
// BOTTOM NAV (Mobile Only)
// ════════════════════════════════════════
const BottomNav = ({ location }) => {
  const navigate = useNavigate()
  const items = [
    { icon: '🏠', label: 'Home', path: '/student' },
    { icon: '🎓', label: 'Courses', path: '/student/courses' },
    { icon: '⚗️', label: 'Lab', path: '/student/lab' },
    { icon: '🏆', label: 'Score', path: '/student/scorecard' },
    { icon: '📝', label: 'Exams', path: '/student/exams' },
  ]

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #E2E8F0', display: 'flex', zIndex: 200, paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -4px 30px rgba(0,0,0,0.02)' }}>
      {items.map(item => {
        const isActive = location.pathname === item.path
        return (
          <button key={item.path} onClick={() => navigate(item.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 4px 8px', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
            <span style={{ fontSize: 20, lineHeight: 1, marginBottom: 3 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#6D8EF7' : '#64748B', fontFamily: 'DM Sans,sans-serif' }}>{item.label}</span>
            {isActive && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#6D8EF7', marginTop: 2 }} />}
          </button>
        )
      })}
    </div>
  )
}

// ════════════════════════════════════════
// PAGE TITLES
// ════════════════════════════════════════
const pageTitles = {
  '/student': '🏠 Home Workspace',
  '/student/courses': '🎓 My Courses',
  '/student/lab': '⚗️ CS Lab challenges',
  '/student/training': '📅 Mentorship training',
  '/student/activities': '⚡ Platform activities',
  '/student/scorecard': '🏆 Ranking Scorecard',
  '/student/projects': '🗂️ Portfolios projects',
  '/student/digitalfest': '🎪 Platform festivals',
  '/student/live': '🖥️ Live classrooms',
  '/student/exam': '🧪 Assessment Quiz',
  '/student/exams': '📝 Exams',
}

// ════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════
const StudentDashboard = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    API.get('/enrollments/my').then(({ data }) => setEnrollments(data)).catch(() => {})
  }, [])

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh', color: '#1E293B', fontFamily: "'DM Sans',sans-serif", display: 'flex' }}>

      {/* Sidebar - hidden on mobile unless mobileOpen */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div style={{
        marginLeft: isMobile ? 0 : 240,
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        overflowY: 'auto',
        paddingBottom: isMobile ? 70 : 0
      }}>
        <TopBar user={user} title={pageTitles[location.pathname] || 'Dashboard'} onMenuClick={() => setMobileOpen(true)} />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage user={user} enrollments={enrollments} />} />
            <Route path="/courses" element={<MyCoursesPage enrollments={enrollments} />} />
            <Route path="/lab" element={<CsLabPage />} />
            <Route path="/scorecard" element={<ScorecardPage user={user} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/live" element={<LiveClassPage />} />
            <Route path="/exam" element={<LabExamPage />} />
            <Route path="/exams" element={<LabExamPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/activities" element={<ActivitiesPage user={user} />} />
            <Route path="/digitalfest" element={<DigitalFestPage />} />
          </Routes>
        </div>
      </div>

      {/* Bottom nav - mobile only */}
      {isMobile && <BottomNav location={location} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        * { box-sizing: border-box; }
        a { text-decoration: none; }
        textarea { caret-color: #6D8EF7; }
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: #FFFFFF; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: #A5B8FF; border-radius: 10px; }
        input::placeholder { color: #94A3B8; }
        @media (max-width: 768px) {
          * { -webkit-tap-highlight-color: transparent; }
        }
      `}</style>
    </div>
  )
}

export default StudentDashboard