import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={{ 
      background: 'rgba(255,255,255,0.8)', 
      backdropFilter: 'blur(20px)', 
      borderBottom: '1px solid rgba(226,232,240,0.8)', 
      padding: '14px 28px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50, 
      fontFamily: "'DM Sans',sans-serif",
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#1E293B' }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: 8, 
          background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontWeight: 900, 
          fontSize: 16,
          color: '#fff',
          boxShadow: '0 4px 12px rgba(124, 156, 245, 0.3)'
        }}>L</div>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 19, tracking: '-0.5px' }}>
          Learn<span style={{ color: '#6D8EF7' }}>ix</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/courses" style={{ color: '#64748B', textDecoration: 'none', padding: '7px 14px', fontSize: 14, borderRadius: 8, fontWeight: 500, transition: 'all 0.2s' }}
          onMouseEnter={e => { e.target.style.color = '#1E293B'; e.target.style.background = 'rgba(109,142,247,0.06)' }}
          onMouseLeave={e => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent' }}>
          Courses
        </Link>

        {user && (
          <Link to="/dashboard" style={{ color: '#64748B', textDecoration: 'none', padding: '7px 14px', fontSize: 14, borderRadius: 8, fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.color = '#1E293B'; e.target.style.background = 'rgba(109,142,247,0.06)' }}
            onMouseLeave={e => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent' }}>
            Dashboard
          </Link>
        )}

        {user?.role === 'student' && (
          <Link to="/courses" style={{ color: '#64748B', textDecoration: 'none', padding: '7px 14px', fontSize: 14, borderRadius: 8, fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.color = '#1E293B'; e.target.style.background = 'rgba(109,142,247,0.06)' }}
            onMouseLeave={e => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent' }}>
            My Courses
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#64748B', textDecoration: 'none', padding: '7px 14px', fontSize: 14, borderRadius: 8, fontWeight: 500, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.color = '#1E293B'; e.target.style.background = 'rgba(109,142,247,0.06)' }}
            onMouseLeave={e => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent' }}>
            Admin
          </Link>
        )}

        {user && (
          <span style={{ 
            background: 'rgba(109,142,247,0.1)', 
            border: '1px solid rgba(109,142,247,0.2)', 
            color: '#6D8EF7', 
            fontSize: 11, 
            padding: '4px 12px', 
            borderRadius: 100, 
            fontWeight: 600, 
            textTransform: 'capitalize', 
            marginLeft: 4 
          }}>
            {user.role}
          </span>
        )}

        {user ? (
          <button onClick={handleLogout} style={{ 
            background: 'rgba(30,41,59,0.05)', 
            border: '1px solid rgba(30,41,59,0.08)', 
            color: '#64748B', 
            padding: '8px 16px', 
            borderRadius: 10, 
            cursor: 'pointer', 
            fontSize: 14, 
            marginLeft: 6, 
            transition: 'all 0.2s', 
            fontFamily: 'DM Sans,sans-serif',
            fontWeight: 500
          }}
            onMouseEnter={e => { e.target.style.background = 'rgba(239,68,68,0.08)'; e.target.style.borderColor = 'rgba(239,68,68,0.2)'; e.target.style.color = '#ef4444' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(30,41,59,0.05)'; e.target.style.borderColor = 'rgba(30,41,59,0.08)'; e.target.style.color = '#64748B' }}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" style={{ color: '#64748B', textDecoration: 'none', padding: '7px 14px', fontSize: 14, borderRadius: 8, fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.color = '#1E293B'; e.target.style.background = 'rgba(109,142,247,0.06)' }}
              onMouseLeave={e => { e.target.style.color = '#64748B'; e.target.style.background = 'transparent' }}>
              Login
            </Link>
            <Link to="/register" style={{ 
              background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', 
              color: '#fff', 
              textDecoration: 'none', 
              padding: '8px 18px', 
              borderRadius: 10, 
              fontSize: 14, 
              fontWeight: 600, 
              marginLeft: 4,
              boxShadow: '0 4px 12px rgba(124, 156, 245, 0.25)',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar