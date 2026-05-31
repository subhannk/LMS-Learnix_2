import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const AttendancePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ── Core States ──
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0])
  const [sessionName, setSessionName] = useState('Regular Class')
  const [students, setStudents] = useState([])
  const [records, setRecords] = useState([])
  const [history, setHistory] = useState([])
  const [view, setView] = useState('take') // 'take' or 'history'
  const [expandedId, setExpandedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // ── Loading & Modal States ──
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notifyingId, setNotifyingId] = useState(null)
  const [showEnrollModal, setShowEnrollModal] = useState(false)
  const [showCourseModal, setShowCourseModal] = useState(false)

  // ── Form States ──
  const [newStudent, setNewStudent] = useState({ name: '', email: '' })
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [enrollError, setEnrollError] = useState('')

  const [newCourse, setNewCourse] = useState({ title: '', description: '', category: '', price: 0, level: 'beginner' })
  const [courseLoading, setCourseLoading] = useState(false)
  const [courseError, setCourseError] = useState('')

  // ── Message States ──
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')

  // ── Responsive ──
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ── Load courses and history on mount ──
  const fetchInitialData = async () => {
    try {
      const coursesRes = await API.get('/courses/instructor/my-courses')
      setCourses(coursesRes.data)
    } catch {
      showMsg('Failed to load courses', 'error')
    }

    try {
      const historyRes = await API.get('/attendance/instructor')
      setHistory(historyRes.data)
    } catch {
      // History could be empty
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const showMsg = (text, type = 'success') => {
    setMsg(text)
    setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  // ── Load students when course is selected ──
  const loadStudents = async (courseId) => {
    if (!courseId) {
      setStudents([])
      setRecords([])
      return
    }
    setLoadingStudents(true)
    setStudents([])
    setRecords([])
    try {
      const { data } = await API.get(`/attendance/students/${courseId}`)
      setStudents(data)
      setRecords(data.map(s => ({
        student: s._id,
        status: 'present',
        name: s.name,
        email: s.email
      })))
    } catch {
      showMsg('Failed to load students roster. Please enroll students to start tracking.', 'error')
    }
    setLoadingStudents(false)
  }

  // ── Create and Enroll Student on the fly ──
  const handleQuickEnroll = async (e) => {
    e.preventDefault()
    if (!newStudent.name || !newStudent.email) {
      setEnrollError('Name and email are required')
      return
    }
    setEnrollLoading(true)
    setEnrollError('')
    try {
      const { data } = await API.post(`/attendance/students/${selectedCourse}/enroll`, newStudent)
      
      const updatedStudents = [...students, data]
      setStudents(updatedStudents)
      setRecords([...records, {
        student: data._id,
        status: 'present',
        name: data.name,
        email: data.email
      }])

      showMsg(`Successfully enrolled ${data.name}!`)
      setNewStudent({ name: '', email: '' })
      setShowEnrollModal(false)
    } catch (err) {
      setEnrollError(err.response?.data?.message || 'Failed to enroll student')
    }
    setEnrollLoading(false)
  }

  // ── Create Course on the fly ──
  const handleQuickCourse = async (e) => {
    e.preventDefault()
    if (!newCourse.title || !newCourse.description || !newCourse.category) {
      setCourseError('Title, description and category are required')
      return
    }
    setCourseLoading(true)
    setCourseError('')
    try {
      const { data } = await API.post('/courses', newCourse)
      setCourses([...courses, data])
      showMsg(`Course "${data.title}" created successfully!`)
      setSelectedCourse(data._id)
      loadStudents(data._id)
      setNewCourse({ title: '', description: '', category: '', price: 0, level: 'beginner' })
      setShowCourseModal(false)
    } catch (err) {
      setCourseError(err.response?.data?.message || 'Failed to create course')
    }
    setCourseLoading(false)
  }

  // ── Update single student status ──
  const updateStatus = (studentId, status) => {
    setRecords(prev => prev.map(r => r.student === studentId ? { ...r, status } : r))
  }

  // ── Mark all students with same status ──
  const markAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })))
  }

  // ── Save/Update attendance ──
  const saveAttendance = async () => {
    if (!selectedCourse) return showMsg('Please select a course!', 'error')
    if (records.length === 0) return showMsg('No students roster found!', 'error')
    setSaving(true)
    try {
      const { data } = await API.post('/attendance', {
        courseId: selectedCourse,
        date: attendanceDate,
        session: sessionName,
        records: records.map(r => ({ student: r.student, status: r.status }))
      })
      
      setHistory(prev => {
        const filtered = prev.filter(h => h._id !== data._id)
        return [data, ...filtered]
      })

      showMsg('✅ Attendance saved successfully!')
      setView('history')
      setExpandedId(data._id)
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to save attendance roster', 'error')
    }
    setSaving(false)
  }

  // ── Send email notifications ──
  const sendNotifications = async (attendanceId, notifyType) => {
    setNotifyingId(attendanceId + notifyType)
    try {
      const { data } = await API.post(`/attendance/${attendanceId}/notify`, { notifyType })
      
      setHistory(prev => prev.map(a => {
        if (a._id !== attendanceId) return a
        return {
          ...a,
          records: a.records.map(r => {
            if (notifyType === 'absent' && r.status === 'absent') return { ...r, notified: true }
            if (notifyType === 'late' && r.status === 'late') return { ...r, notified: true }
            if (notifyType === 'all' && (r.status === 'absent' || r.status === 'late')) return { ...r, notified: true }
            return r
          })
        }
      }))
      showMsg(data.message || 'Notification alerts dispatched successfully!')
    } catch (err) {
      showMsg(err.response?.data?.message || 'Failed to send alert emails', 'error')
    }
    setNotifyingId(null)
  }

  // ── Date shortcuts ──
  const setShortcutDate = (daysAgo) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    setAttendanceDate(d.toISOString().split('T')[0])
  }

  // ── Export attendance list to CSV ──
  const exportToCSV = (sessionRecord = null) => {
    let rows = []
    let filename = 'attendance_report.csv'

    if (sessionRecord) {
      const courseTitle = sessionRecord.course?.title || 'Course'
      const formattedDate = new Date(sessionRecord.date).toLocaleDateString('en-IN')
      filename = `${courseTitle.replace(/\s+/g, '_')}_${formattedDate.replace(/\//g, '-')}_attendance.csv`
      
      rows.push(['Student Name', 'Email Address', 'Attendance Status', 'Notified via Email'])
      sessionRecord.records.forEach(r => {
        rows.push([
          r.student?.name || 'Unknown',
          r.student?.email || '—',
          r.status.toUpperCase(),
          r.notified ? 'YES' : 'NO'
        ])
      })
    } else {
      if (records.length === 0) return showMsg('No roster records to export!', 'error')
      const activeCourse = courses.find(c => c._id === selectedCourse)
      const courseTitle = activeCourse?.title || 'Course'
      filename = `${courseTitle.replace(/\s+/g, '_')}_current_attendance.csv`
      
      rows.push(['Student Name', 'Email Address', 'Attendance Status'])
      records.forEach(r => {
        rows.push([r.name, r.email, r.status.toUpperCase()])
      })
    }

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(',')).join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showMsg('CSV file downloaded successfully!')
  }

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const presentCount = records.filter(r => r.status === 'present').length
  const absentCount = records.filter(r => r.status === 'absent').length
  const lateCount = records.filter(r => r.status === 'late').length

  const statusOptions = [
    { value: 'present', emoji: '✅', label: 'Present', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
    { value: 'late', emoji: '🕐', label: 'Late', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    { value: 'absent', emoji: '❌', label: 'Absent', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  ]

  return (
    <div style={{ background: '#F7F9FC', minHeight: '100vh', color: '#1E293B', fontFamily: "'DM Sans',sans-serif" }}>
      
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,156,245,0.06) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.05) 0%,transparent 70%)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: isMobile ? '16px 12px' : '28px 24px' }}>
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/instructor')} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#64748B', padding: '8px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s', fontWeight: 700, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6D8EF7'; e.currentTarget.style.color = '#6D8EF7' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.color = '#64748B' }}>
              ← Studio
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#7C9CF5,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff', boxShadow: '0 4px 12px rgba(124,156,245,0.2)' }}>📋</div>
              <div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: isMobile ? 20 : 26, margin: 0, letterSpacing: '-0.5px', color: '#1E293B' }}>Attendance Studio</h1>
                <p style={{ color: '#64748B', margin: 0, fontSize: 12, fontWeight: 500 }}>Track daily rosters · Dispatch alerts · Download CSV logs</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 10, padding: '8px 14px', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: '#6D8EF7', fontWeight: 700 }}>Instructor</p>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {msg && (
          <div style={{ background: msgType === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1.5px solid ${msgType === 'error' ? '#EF4444' : '#10B981'}`, borderRadius: 12, padding: '13px 18px', marginBottom: 20, fontSize: 14, color: msgType === 'error' ? '#EF4444' : '#10B981', display: 'flex', alignItems: 'center', gap: 8, animation: 'fadeUp 0.3s ease both', backdropFilter: 'blur(10px)', fontWeight: 600 }}>
            {msg}
          </div>
        )}

        {/* Top Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '📚', label: 'My Courses', value: courses.length, color: '#7C9CF5' },
            { icon: '📋', label: 'Sessions Logged', value: history.length, color: '#8EC5FC' },
            { icon: '✅', label: 'Average Ratios', value: history.length > 0 ? Math.round(history.reduce((a, h) => a + (h.totalPresent / (h.records?.length || 1)), 0) / history.length * 100) + '%' : '—', color: '#10B981' },
            { icon: '📧', label: 'Emails Dispatched', value: history.reduce((a, h) => a + (h.records?.filter(r => r.notified).length || 0), 0), color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#FFFFFF', border: `1.5px solid #E2E8F0`, borderRadius: 16, padding: '14px 16px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.color }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0' }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 22, color: '#1E293B' }}>{s.value}</div>
              <div style={{ color: '#64748B', fontSize: 11, marginTop: 2, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#FFFFFF', borderRadius: 14, padding: 5, border: '1.5px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
          {[
            { id: 'take', icon: '✏️', label: 'Track Daily Roster' },
            { id: 'history', icon: '📜', label: `Session History (${history.length})` }
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} style={{ flex: 1, padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, fontSize: isMobile ? 12 : 14, transition: 'all 0.25s', background: view === tab.id ? 'linear-gradient(135deg,#7C9CF5,#A5B8FF)' : 'transparent', color: view === tab.id ? '#fff' : '#64748B', boxShadow: view === tab.id ? '0 4px 12px rgba(124,156,245,0.3)' : 'none' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════
            TAKE ATTENDANCE VIEW
        ════════════════════════════════════ */}
        {view === 'take' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            
            {/* Session setup card */}
            <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 20, padding: isMobile ? 16 : 24, marginBottom: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 17, margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#1E293B' }}>
                  <span style={{ background: 'rgba(109,142,247,0.1)', border: '1.5px solid rgba(109,142,247,0.2)', width: 34, height: 34, borderRadius: 9, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚙️</span>
                  Session Configuration
                </h3>
                <button onClick={() => setShowCourseModal(true)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#6D8EF7', fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6D8EF7'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}>
                  + New Course
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 16 }}>
                {/* Select course */}
                <div>
                  <label style={{ fontSize: 11, color: '#64748B', display: 'block', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>📚 SELECT ACTIVE COURSE</label>
                  <select value={selectedCourse} onChange={e => { setSelectedCourse(e.target.value); loadStudents(e.target.value) }}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: selectedCourse ? '#1E293B' : '#94A3B8', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', cursor: 'pointer', fontWeight: 600 }}>
                    <option value="">-- Choose a cohort --</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id} style={{color: '#1E293B'}}>{c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Date select with shortcuts */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                    <label style={{ fontSize: 11, color: '#64748B', fontWeight: 700, letterSpacing: 0.5 }}>📅 DATE</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="button" onClick={() => setShortcutDate(0)} style={{ background: 'rgba(109,142,247,0.08)', border: 'none', color: '#6D8EF7', fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>Today</button>
                      <button type="button" onClick={() => setShortcutDate(1)} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', fontSize: 10, padding: '2px 8px', borderRadius: 4, cursor: 'pointer', fontWeight: 700 }}>Yesterday</button>
                    </div>
                  </div>
                  <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 600 }} />
                </div>

                {/* Session name */}
                <div>
                  <label style={{ fontSize: 11, color: '#64748B', display: 'block', marginBottom: 7, fontWeight: 700, letterSpacing: 0.5 }}>🏷️ SESSION NAME</label>
                  <input type="text" value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="e.g. Regular Session"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: 11, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 600 }} />
                </div>
              </div>
            </div>

            {/* Empty state: No course selected */}
            {!selectedCourse && !loadingStudents && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', border: '1.5px dashed #A5B8FF', borderRadius: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>📋</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 8px', color: '#1E293B' }}>Select active course to begin</h3>
                <p style={{ color: '#64748B', fontSize: 14, maxWidth: 400, margin: '0 auto', fontWeight: 500 }}>
                  Choose one of your assigned courses from the configuration builder, or create a new course to manage cohort roster registers
                </p>
              </div>
            )}

            {/* Loading students spinner */}
            {loadingStudents && (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: 42, marginBottom: 12, display: 'inline-block', animation: 'spin 2s linear infinite' }}>⏳</div>
                <p style={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>Loading student roster...</p>
              </div>
            )}

            {/* No students enrolled state */}
            {!loadingStudents && selectedCourse && students.length === 0 && (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: '#FFFFFF', border: '1.5px dashed #EF4444', borderRadius: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: '0 0 8px', color: '#1E293B' }}>No Enrolled Students</h3>
                <p style={{ color: '#64748B', fontSize: 14, marginBottom: 18, fontWeight: 500 }}>
                  There are no active student profiles enrolled in this course roster. Enroll a student to begin.
                </p>
                <button onClick={() => setShowEnrollModal(true)} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
                  + Enroll Roster Student
                </button>
              </div>
            )}

            {/* Active Student Attendance Taking Card */}
            {!loadingStudents && students.length > 0 && (
              <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}>
                
                {/* Table Header / Toolbar */}
                <div style={{ padding: '16px 20px', borderBottom: '1.5px solid #E2E8F0', background: '#F8FAFC' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                    <div>
                      <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8, color: '#1E293B' }}>
                        Cohort Roster Registry
                        <span style={{ background: 'rgba(109,142,247,0.1)', color: '#6D8EF7', fontSize: 12, padding: '2px 8px', borderRadius: 100, fontWeight: 700 }}>
                          {students.length} students
                        </span>
                      </h3>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 700 }}>
                        <span style={{ color: '#10B981' }}>✅ {presentCount} Present</span>
                        <span style={{ color: '#F59E0B' }}>🕐 {lateCount} Late</span>
                        <span style={{ color: '#EF4444' }}>❌ {absentCount} Absent</span>
                      </div>
                    </div>

                    {/* Toolbar buttons */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => setShowEnrollModal(true)} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#10B981', padding: '7px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                        onMouseEnter={e => e.target.style.borderColor = '#10B981'}
                        onMouseLeave={e => e.target.style.borderColor = '#E2E8F0'}>
                        + Add Student
                      </button>
                      <button onClick={() => exportToCSV()} style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#64748B', padding: '7px 12px', borderRadius: 9, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                        onMouseEnter={e => e.target.style.borderColor = '#6D8EF7'}
                        onMouseLeave={e => e.target.style.borderColor = '#E2E8F0'}>
                        📥 Download CSV
                      </button>
                    </div>
                  </div>

                  {/* Search and Bulk Actions row */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                    <input type="text" placeholder="Search roster by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                      style={{ flex: 1, minWidth: 200, padding: '9px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 13, outline: 'none', fontWeight: 500 }} />
                    
                    <div style={{ display: 'flex', gap: 6 }}>
                      {statusOptions.map(s => (
                        <button key={s.value} onClick={() => markAll(s.value)} style={{ background: '#FFFFFF', border: `1.5px solid ${s.color}`, color: s.color, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
                          {s.emoji} All {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Student rows */}
                <div style={{ maxHeight: 450, overflowY: 'auto' }}>
                  {filteredRecords.length === 0 ? (
                    <div style={{ padding: 40, textAlign: 'center', color: '#64748B', fontWeight: 500 }}>
                      No roster records match your query
                    </div>
                  ) : (
                    filteredRecords.map((record, i) => {
                      const current = statusOptions.find(s => s.value === record.status)

                      return (
                        <div key={record.student} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: isMobile ? '12px 14px' : '14px 20px', borderBottom: i < filteredRecords.length - 1 ? '1px solid #E2E8F0' : 'none', transition: 'background 0.2s', flexWrap: isMobile ? 'wrap' : 'nowrap' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span style={{ fontSize: 12, color: '#64748B', width: 20, textAlign: 'right', flexShrink: 0, fontFamily: 'monospace', fontWeight: 600 }}>{i + 1}</span>
                          
                          {/* Avatar */}
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: current.bg, border: `2.5px solid ${current.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0, color: current.color }}>
                            {record.name?.[0]?.toUpperCase() || '?'}
                          </div>

                          {/* Student Details */}
                          <div style={{ flex: 1, minWidth: isMobile ? '60%' : 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1E293B' }}>{record.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 500 }}>{record.email}</p>
                          </div>

                          {/* Status buttons */}
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0, width: isMobile ? '100%' : 'auto', marginTop: isMobile ? 6 : 0 }}>
                            {statusOptions.map(s => (
                              <button key={s.value} onClick={() => updateStatus(record.student, s.value)} style={{
                                flex: isMobile ? 1 : 'none',
                                padding: isMobile ? '8px 5px' : '6px 14px',
                                borderRadius: 8,
                                border: `1.5px solid ${record.status === s.value ? 'transparent' : s.color}`,
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 11,
                                transition: 'all 0.15s',
                                background: record.status === s.value ? s.color : '#FFFFFF',
                                color: record.status === s.value ? '#fff' : s.color,
                                boxShadow: record.status === s.value ? `0 4px 12px ${s.color}35` : 'none'
                              }}>
                                {s.emoji} {!isMobile && s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Footer Save Summary */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 20, color: '#10B981' }}>{presentCount}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#64748B', fontWeight: 600 }}>Present</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 20, color: '#F59E0B' }}>{lateCount}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#64748B', fontWeight: 600 }}>Late</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ margin: 0, fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 20, color: '#EF4444' }}>{absentCount}</p>
                      <p style={{ margin: 0, fontSize: 10, color: '#64748B', fontWeight: 600 }}>Absent</p>
                    </div>
                  </div>

                  <button onClick={saveAttendance} disabled={saving} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px 32px', borderRadius: 12, cursor: saving ? 'wait' : 'pointer', fontWeight: 800, fontSize: 14, boxShadow: '0 4px 12px rgba(124,156,245,0.3)', transition: 'all 0.2s' }}>
                    {saving ? '⏳ Saving logs...' : '💾 Save cohort log'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════
            ATTENDANCE HISTORY VIEW
        ════════════════════════════════════ */}
        {view === 'history' && (
          <div style={{ animation: 'fadeIn 0.4s ease both' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', border: '1.5px dashed #E2E8F0', borderRadius: 20 }}>
                <div style={{ fontSize: 56, marginBottom: 14 }}>📜</div>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, margin: '0 0 8px', color: '#1E293B' }}>No attendance registry logs</h3>
                <p style={{ color: '#64748B', fontSize: 14, marginBottom: 20, fontWeight: 500 }}>Take attendance for a course to registry log databases here.</p>
                <button onClick={() => setView('take')} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '11px 24px', borderRadius: 11, cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(124,156,245,0.3)' }}>✏️ Log Attendance Now</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {history.map((record) => {
                  const isExpanded = expandedId === record._id
                  const total = record.records?.length || 1
                  const pct = Math.round((record.totalPresent / total) * 100)

                  return (
                    <div key={record._id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                      
                      {/* History header bar (clickable) */}
                      <div onClick={() => setExpandedId(isExpanded ? null : record._id)} style={{ padding: '16px 20px', cursor: 'pointer', background: isExpanded ? '#F8FAFC' : 'transparent', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg,${pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444'},#A5B8FF)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, color: '#fff' }}>
                            📋
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 3px', fontWeight: 800, fontSize: 15, color: '#1E293B' }}>{record.course?.title || 'Cohort Course'}</h4>
                            <p style={{ margin: 0, fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                              📅 {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              {record.session ? ` · ${record.session}` : ''}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                          <div style={{ textAlign: 'center', background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '5px 10px', borderRadius: 8 }}>
                            <p style={{ margin: 0, fontWeight: 900, fontSize: 15, color: pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444' }}>{pct}%</p>
                            <p style={{ margin: 0, fontSize: 8, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Attend</p>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <span style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700, border: '1px solid rgba(16,185,129,0.15)' }}>Present: {record.totalPresent}</span>
                            <span style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontWeight: 700, border: '1px solid rgba(239,68,68,0.15)' }}>Absent: {record.totalAbsent}</span>
                          </div>

                          <span style={{ color: '#64748B', fontSize: 12, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                        </div>
                      </div>

                      {/* Expanded logs list */}
                      {isExpanded && (
                        <div style={{ borderTop: '1px solid #E2E8F0' }}>
                          
                          <div style={{ padding: '8px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', background: '#F8FAFC' }}>
                            <button onClick={(e) => { e.stopPropagation(); exportToCSV(record) }} style={{ background: 'transparent', border: 'none', color: '#6D8EF7', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                              📥 Download CSV Session Report
                            </button>
                          </div>

                          {/* Records */}
                          <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                            {record.records?.map((r, ri) => (
                              <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px', borderBottom: ri < record.records.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: r.status === 'present' ? 'rgba(16,185,129,0.08)' : r.status === 'late' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: r.status === 'present' ? '#10B981' : r.status === 'late' ? '#F59E0B' : '#EF4444' }}>
                                  {r.student?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1E293B' }}>{r.student?.name || 'Roster Student'}</p>
                                  <p style={{ margin: 0, fontSize: 10, color: '#64748B', fontWeight: 500 }}>{r.student?.email || '—'}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: r.status === 'present' ? 'rgba(16,185,129,0.08)' : r.status === 'late' ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)', color: r.status === 'present' ? '#10B981' : r.status === 'late' ? '#F59E0B' : '#EF4444', fontWeight: 700 }}>
                                    {r.status.toUpperCase()}
                                  </span>
                                  {r.notified && <span style={{ fontSize: 9, color: '#6D8EF7', background: 'rgba(109,142,247,0.1)', border: '1px solid rgba(109,142,247,0.2)', padding: '2px 6px', borderRadius: 100, fontWeight: 700 }}>📧 Emailed</span>}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Email alerts dispatch panel */}
                          {(record.totalAbsent > 0 || record.totalLate > 0) ? (
                            <div style={{ padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: 'linear-gradient(135deg,rgba(124,156,245,0.06),rgba(16,185,129,0.02))' }}>
                              <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>📧</span> Dispatch Attendance alerts to student emails
                              </p>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {record.totalAbsent > 0 && (
                                  <button onClick={() => sendNotifications(record._id, 'absent')} disabled={!!notifyingId}
                                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', padding: '8px 16px', borderRadius: 9, cursor: notifyingId ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700 }}>
                                    {notifyingId === record._id + 'absent' ? '⏳ Disptaching...' : `Alert Absents (${record.totalAbsent})`}
                                  </button>
                                )}

                                {record.totalLate > 0 && (
                                  <button onClick={() => sendNotifications(record._id, 'late')} disabled={!!notifyingId}
                                    style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', padding: '8px 16px', borderRadius: 9, cursor: notifyingId ? 'wait' : 'pointer', fontSize: 12, fontWeight: 700 }}>
                                    {notifyingId === record._id + 'late' ? '⏳ Dispatching...' : `Alert Lates (${record.totalLate})`}
                                  </button>
                                )}

                                <button onClick={() => sendNotifications(record._id, 'all')} disabled={!!notifyingId}
                                  style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: 9, cursor: notifyingId ? 'wait' : 'pointer', fontSize: 12, fontWeight: 800, boxShadow: '0 4px 8px rgba(124,156,245,0.2)' }}>
                                  {notifyingId === record._id + 'all' ? '⏳ Dispatching...' : `Send All Alerts (${(record.totalAbsent || 0) + (record.totalLate || 0)})`}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E8F0', background: 'rgba(16,185,129,0.04)', fontSize: 12, color: '#10B981', fontWeight: 700 }}>
                              🎉 Perfect attendance logged. No notifications dispatch required.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── MODAL: QUICK ENROLL STUDENT ── */}
      {showEnrollModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,41,59,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, backdropFilter: 'blur(8px)', animation: 'fadeIn 0.25s' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, animation: 'fadeUp 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, margin: 0, color: '#1E293B' }}>Enroll Student Profile</h3>
              <button onClick={() => { setShowEnrollModal(false); setEnrollError('') }} style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: 22, cursor: 'pointer', fontWeight: 'bold' }}>×</button>
            </div>
            {enrollError && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#EF4444', fontSize: 13, fontWeight: 600 }}>
                {enrollError}
              </div>
            )}
            <form onSubmit={handleQuickEnroll} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Student Full Name</label>
                <input type="text" placeholder="e.g. Rahul Nair" value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Student Email Address</label>
                <input type="email" placeholder="rahul@gmail.com" value={newStudent.email} onChange={e => setNewStudent({ ...newStudent, email: e.target.value })} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <button type="submit" disabled={enrollLoading} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '12px', borderRadius: 11, cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)', transition: 'all 0.2s', marginTop: 6 }}>
                {enrollLoading ? '⏳ Enrolling...' : '➕ Enroll Student Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: QUICK COURSE BUILDER ── */}
      {showCourseModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,41,59,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16, backdropFilter: 'blur(8px)', animation: 'fadeIn 0.25s' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 24, width: '100%', maxWidth: 440, animation: 'fadeUp 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18, color: '#1E293B', margin: 0 }}>Create Cohort Course</h3>
              <button onClick={() => { setShowCourseModal(false); setCourseError('') }} style={{ background: 'transparent', border: 'none', color: '#64748B', fontSize: 22, cursor: 'pointer', fontWeight: 'bold' }}>×</button>
            </div>
            {courseError && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#EF4444', fontSize: 13, fontWeight: 600 }}>
                {courseError}
              </div>
            )}
            <form onSubmit={handleQuickCourse} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Course Title</label>
                <input type="text" placeholder="e.g. Next.js Fullstack Bootcamp" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Category</label>
                  <input type="text" placeholder="e.g. Web Dev" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} required
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', fontWeight: 500 }}
                    onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                    onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Difficulty Level</label>
                  <select value={newCourse.level} onChange={e => setNewCourse({ ...newCourse, level: e.target.value })}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', fontFamily: 'DM Sans,sans-serif', fontWeight: 700, cursor: 'pointer' }}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 5, fontWeight: 700 }}>Description</label>
                <textarea placeholder="Cohort syllabus and topics details..." value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} rows={2} required
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#FFFFFF', border: '1.5px solid #E2E8F0', color: '#1E293B', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans,sans-serif', boxSizing: 'border-box', fontWeight: 500 }}
                  onFocus={e => e.target.style.borderColor = '#7C9CF5'}
                  onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <button type="submit" disabled={courseLoading} style={{ background: 'linear-gradient(135deg,#7C9CF5,#A5B8FF)', border: 'none', color: '#fff', padding: '12px', borderRadius: 11, cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'DM Sans,sans-serif', boxShadow: '0 4px 8px rgba(124,156,245,0.2)', transition: 'all 0.2s', marginTop: 4 }}>
                {courseLoading ? '⏳ Creating...' : '➕ Create Cohort Course'}
              </button>
            </form>
          </div>
        </div>
      )}

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

export default AttendancePage