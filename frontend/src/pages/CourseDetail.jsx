import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const CourseDetail = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const course = state?.course
  const [activeLesson, setActiveLesson] = useState(null)
  const [enrolled, setEnrolled] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [openSection, setOpenSection] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user && course) {
      API.get('/enrollments/my').then(({ data }) => {
        const found = data.find(e => e.course?._id === course._id || e.course === course._id)
        if (found) { setEnrolled(true); setCompletedLessons(found.completedLessons || []) }
      }).catch(() => {})
    }
  }, [user, course])

  if (!course) return (
    <div style={{ minHeight: '100vh', background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 56 }}>📚</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>Course not found</p>
      <button onClick={() => navigate('/courses')} style={{ background: 'linear-gradient(135deg,#6c47ff,#9c47ff)', border: 'none', color: '#fff', padding: '11px 24px', borderRadius: 11, cursor: 'pointer', fontWeight: 700, fontFamily: 'DM Sans,sans-serif', fontSize: 15 }}>
        Back to Courses
      </button>
    </div>
  )

  const totalLessons = course.sections?.reduce((a, s) => a + s.lessons.length, 0) || 0
  const progress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return }
    setEnrolling(true)
    try {
      await API.post(`/enrollments/${course._id}`)
      setEnrolled(true)
      setMessage('✅ Enrolled successfully!')
      setActiveLesson(course.sections[0]?.lessons[0])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Enrollment failed'
      if (msg.includes('Already')) { setEnrolled(true); setMessage('Already enrolled!') }
      else setMessage('❌ ' + msg)
    }
    setEnrolling(false)
    setTimeout(() => setMessage(''), 3000)
  }

  const markComplete = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId]
      setCompletedLessons(updated)
      API.put(`/enrollments/${course._id}/progress`, { lessonId }).catch(() => {})
    }
  }

  return (
    <div style={{ background: 'var(--bg-color, #F7F9FC)', minHeight: '100vh', color: 'var(--text-primary, #1E293B)', fontFamily: "'DM Sans',sans-serif" }}>

      {activeLesson ? (
        /* VIDEO PLAYER VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color, #F7F9FC)' }}>
          {/* Top bar */}
          <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-color, #E2E8F0)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.01)' }}>
            <button onClick={() => setActiveLesson(null)} style={{ background: 'rgba(30,41,59,0.05)', border: '1px solid var(--border-color, #E2E8F0)', color: 'var(--text-secondary, #64748B)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s', fontWeight: 500 }}
              onMouseEnter={e => e.target.style.background = 'rgba(109,142,247,0.08)'}
              onMouseLeave={e => e.target.style.background = 'rgba(30,41,59,0.05)'}>
              ← Back
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary, #1E293B)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'Syne,sans-serif' }}>{activeLesson.title}</p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary, #64748B)' }}>{course.title}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: 'rgba(109, 142, 247, 0.1)', borderRadius: 100, height: 6, width: 120 }}>
                <div style={{ height: 6, borderRadius: 100, width: `${progress}%`, background: 'linear-gradient(90deg, #7C9CF5, #A5B8FF)', transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 12, color: '#6D8EF7', fontWeight: 700 }}>{progress}% Done</span>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Video */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ background: '#000', aspectRatio: '16/9', maxHeight: '65vh', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <iframe src={activeLesson.videoUrl} title={activeLesson.title} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', background: '#FFFFFF', borderRight: '1px solid var(--border-color, #E2E8F0)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border-color, #E2E8F0)', paddingBottom: 20 }}>
                  <div>
                    <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 24, margin: '0 0 6px', color: 'var(--text-primary, #1E293B)' }}>{activeLesson.title}</h2>
                    <p style={{ color: 'var(--text-secondary, #64748B)', margin: 0, fontSize: 13, fontWeight: 500 }}>⏱ Lesson Duration: {activeLesson.duration}</p>
                  </div>
                  <button onClick={() => markComplete(activeLesson._id)} style={{
                    padding: '10px 24px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s',
                    background: completedLessons.includes(activeLesson._id) ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg, #7C9CF5, #A5B8FF)',
                    color: completedLessons.includes(activeLesson._id) ? '#10B981' : '#fff',
                    border: completedLessons.includes(activeLesson._id) ? '1px solid rgba(16,185,129,0.3)' : 'none',
                    boxShadow: completedLessons.includes(activeLesson._id) ? 'none' : '0 4px 12px rgba(124, 156, 245, 0.25)'
                  }}>
                    {completedLessons.includes(activeLesson._id) ? '✓ Completed' : 'Mark Complete'}
                  </button>
                </div>
                <div style={{ marginTop: 20 }}>
                  <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary, #1E293B)', marginBottom: 10 }}>About this Lesson</h3>
                  <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 14, lineHeight: 1.6 }}>
                    In this lecture, we explore the core concepts and fundamental mechanics. Follow along carefully, practice with the workspace compiler, and feel free to review key sections of the video to reinforce your learning experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar playlist */}
            <div style={{ width: 320, background: '#FFFFFF', borderLeft: '1px solid var(--border-color, #E2E8F0)', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color, #E2E8F0)', background: 'var(--bg-color, #F7F9FC)' }}>
                <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, margin: '0 0 4px', color: 'var(--text-primary, #1E293B)' }}>Course Content</h3>
                <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 12, margin: 0, fontWeight: 500 }}>{completedLessons.length}/{totalLessons} completed</p>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {course.sections?.map((section, si) => (
                  <div key={si} style={{ borderBottom: '1px solid var(--border-color, #E2E8F0)' }}>
                    <button onClick={() => setOpenSection(openSection === si ? -1 : si)} style={{ 
                      width: '100%', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 18px', 
                      background: 'rgba(109, 142, 247, 0.02)', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text-primary, #1E293B)', 
                      fontSize: 13, 
                      fontFamily: 'DM Sans,sans-serif', 
                      textAlign: 'left',
                      fontWeight: 600
                    }}>
                      <span>{section.title}</span>
                      <span style={{ fontSize: 10, color: '#6D8EF7' }}>{openSection === si ? '▲' : '▼'}</span>
                    </button>
                    {openSection === si && section.lessons.map((lesson, li) => (
                      <button key={li} onClick={() => { setActiveLesson(lesson); window.scrollTo({ top: 0 }) }} style={{
                        width: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 10, 
                        padding: '12px 18px', 
                        background: activeLesson?._id === lesson._id ? 'rgba(109, 142, 247, 0.08)' : 'transparent', 
                        border: 'none', 
                        borderBottom: '1px solid var(--border-color, #E2E8F0)', 
                        cursor: 'pointer', 
                        textAlign: 'left', 
                        transition: 'background 0.2s',
                        borderLeft: activeLesson?._id === lesson._id ? '3px solid #6D8EF7' : '3px solid transparent'
                      }}>
                        <span style={{ 
                          width: 22, 
                          height: 22, 
                          borderRadius: '50%', 
                          background: completedLessons.includes(lesson._id) ? '#10B981' : activeLesson?._id === lesson._id ? '#6D8EF7' : 'rgba(30,41,59,0.08)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: 10, 
                          color: completedLessons.includes(lesson._id) || activeLesson?._id === lesson._id ? '#fff' : 'var(--text-secondary, #64748B)', 
                          flexShrink: 0, 
                          fontWeight: 700 
                        }}>
                          {completedLessons.includes(lesson._id) ? '✓' : li + 1}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, color: activeLesson?._id === lesson._id ? 'var(--text-primary, #1E293B)' : 'var(--text-secondary, #64748B)', fontWeight: activeLesson?._id === lesson._id ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lesson.title}</p>
                          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary, #64748B)', opacity: 0.8 }}>{lesson.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      ) : (
        /* COURSE INFO VIEW */
        <div>
          {/* Hero */}
          <div style={{ 
            background: 'linear-gradient(180deg, #EBF0FF 0%, var(--bg-color, #F7F9FC) 100%)', 
            borderBottom: '1px solid var(--border-color, #E2E8F0)', 
            padding: '60px 24px 40px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '-10%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 156, 245, 0.08) 0%, transparent 70%)' }} />
            </div>
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-start', position: 'relative' }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <button onClick={() => navigate('/courses')} style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid var(--border-color, #E2E8F0)', 
                  color: 'var(--text-secondary, #64748B)', 
                  padding: '8px 16px', 
                  borderRadius: 10, 
                  cursor: 'pointer', 
                  fontSize: 13, 
                  marginBottom: 20, 
                  fontFamily: 'DM Sans,sans-serif',
                  fontWeight: 500,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.target.style.background = 'rgba(109,142,247,0.06)'}
                  onMouseLeave={e => e.target.style.background = '#FFFFFF'}>
                  ← All Courses
                </button>
                <div>
                  <span style={{ 
                    background: 'rgba(109, 142, 247, 0.1)', 
                    border: '1px solid rgba(109, 142, 247, 0.2)', 
                    color: '#6D8EF7', 
                    fontSize: 11, 
                    padding: '4px 12px', 
                    borderRadius: 100, 
                    display: 'inline-block', 
                    marginBottom: 14,
                    fontWeight: 600
                  }}>{course.category}</span>
                </div>
                <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(28px,4vw,42px)', margin: '0 0 12px', lineHeight: 1.2, color: 'var(--text-primary, #1E293B)', letterSpacing: '-1px' }}>{course.title}</h1>
                <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 16, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 560 }}>{course.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--text-secondary, #64748B)', marginBottom: 16, fontWeight: 500 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>⭐ {course.averageRating}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>👥 {course.totalStudents?.toLocaleString()} students</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>🎬 {totalLessons} lessons</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>⏱ {course.duration}</span>
                  <span style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 3 }}>📊 {course.level}</span>
                </div>
                <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 13, margin: 0 }}>Course instructed by <strong style={{ color: 'var(--text-primary, #1E293B)', fontWeight: 600 }}>{course.instructor?.name}</strong></p>

                {message && (
                  <div style={{ 
                    marginTop: 16, 
                    background: message.includes('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', 
                    border: `1px solid ${message.includes('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, 
                    borderRadius: 12, 
                    padding: '12px 16px', 
                    fontSize: 14, 
                    color: message.includes('✅') ? '#10B981' : '#ef4444',
                    fontWeight: 500
                  }}>
                    {message}
                  </div>
                )}
              </div>

              {/* Enroll card */}
              <div style={{ 
                width: 320, 
                background: '#FFFFFF', 
                border: '1px solid var(--border-color, #E2E8F0)', 
                borderRadius: 20, 
                overflow: 'hidden', 
                flexShrink: 0,
                boxShadow: '0 20px 40px rgba(124, 156, 245, 0.08)',
                zIndex: 10
              }}>
                <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: 170, objectFit: 'cover' }} />
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                    <p style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 32, color: '#10B981', margin: 0 }}>FREE</p>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary, #64748B)', textDecoration: 'line-through' }}>$199.99</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 13, margin: '0 0 18px', fontWeight: 500 }}>Full lifetime access & preview</p>

                  {enrolled ? (
                    <button onClick={() => { setActiveLesson(course.sections[0]?.lessons[0]); window.scrollTo({ top: 0 }) }} style={{ 
                      width: '100%', 
                      background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
                      border: 'none', 
                      color: '#fff', 
                      padding: '14px', 
                      borderRadius: 12, 
                      cursor: 'pointer', 
                      fontWeight: 700, 
                      fontSize: 15, 
                      fontFamily: 'DM Sans,sans-serif', 
                      boxShadow: '0 4px 15px rgba(124, 156, 245, 0.3)', 
                      marginBottom: 16,
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
                      onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}>
                      Continue Learning →
                    </button>
                  ) : (
                    <button onClick={handleEnroll} disabled={enrolling} style={{ 
                      width: '100%', 
                      background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
                      border: 'none', 
                      color: '#fff', 
                      padding: '14px', 
                      borderRadius: 12, 
                      cursor: enrolling ? 'wait' : 'pointer', 
                      fontWeight: 700, 
                      fontSize: 15, 
                      fontFamily: 'DM Sans,sans-serif', 
                      boxShadow: '0 4px 15px rgba(124, 156, 245, 0.3)', 
                      marginBottom: 16, 
                      opacity: enrolling ? 0.7 : 1,
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => { if(!enrolling){ e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' } }}
                      onMouseLeave={e => { if(!enrolling){ e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' } }}>
                      {enrolling ? 'Enrolling...' : user ? 'Enroll Now — Free' : 'Login to Enroll'}
                    </button>
                  )}

                  {enrolled && (
                    <div style={{ marginBottom: 18, background: 'rgba(109, 142, 247, 0.04)', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(109,142,247,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary, #64748B)', marginBottom: 6, fontWeight: 600 }}>
                        <span>Progress</span><span style={{ color: '#6D8EF7' }}>{progress}%</span>
                      </div>
                      <div style={{ background: 'rgba(109, 142, 247, 0.1)', borderRadius: 100, height: 6 }}>
                        <div style={{ height: 6, borderRadius: 100, width: `${progress}%`, background: 'linear-gradient(90deg, #7C9CF5, #A5B8FF)' }} />
                      </div>
                    </div>
                  )}

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--border-color, #E2E8F0)', paddingTop: 16 }}>
                    {[`🎬 ${totalLessons} interactive lessons`, `⏱ ${course.duration} on-demand video`, '📱 Access on mobile and desktop', '🏆 Certificate of completion', '♾️ Lifetime offline access'].map((item, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary, #64748B)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}>
                        <span style={{ color: '#10B981' }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum */}
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 24px 80px' }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 26, margin: '0 0 8px', color: 'var(--text-primary, #1E293B)', letterSpacing: '-0.5px' }}>📋 Course Curriculum</h2>
            <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 14, margin: '0 0 24px', fontWeight: 500 }}>{course.sections?.length} sections · {totalLessons} lessons</p>

            {course.sections?.map((section, si) => (
              <div key={si} style={{ 
                background: '#FFFFFF', 
                border: '1px solid var(--border-color, #E2E8F0)', 
                borderRadius: 16, 
                marginBottom: 16, 
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.01)'
              }}>
                <button onClick={() => setOpenSection(openSection === si ? -1 : si)} style={{ 
                  width: '100%', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px 20px', 
                  background: 'rgba(109, 142, 247, 0.01)', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: 'var(--text-primary, #1E293B)', 
                  fontFamily: 'DM Sans,sans-serif' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text-primary, #1E293B)' }}>{section.title}</span>
                    <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: 13, fontWeight: 500 }}>({section.lessons.length} lessons)</span>
                  </div>
                  <span style={{ color: '#6D8EF7', fontSize: 13 }}>{openSection === si ? '▲' : '▼'}</span>
                </button>
                {openSection === si && (
                  <div style={{ borderTop: '1px solid var(--border-color, #E2E8F0)' }}>
                    {section.lessons.map((lesson, li) => (
                      <div key={li} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: li < section.lessons.length - 1 ? '1px solid var(--border-color, #E2E8F0)' : 'none', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(109, 142, 247, 0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ 
                          width: 26, 
                          height: 26, 
                          borderRadius: '50%', 
                          background: completedLessons.includes(lesson._id) ? '#10B981' : 'rgba(109, 142, 247, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: 11, 
                          color: completedLessons.includes(lesson._id) ? '#fff' : '#6D8EF7', 
                          flexShrink: 0, 
                          fontWeight: 700 
                        }}>
                          {completedLessons.includes(lesson._id) ? '✓' : li + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 2px', fontSize: 14, color: 'var(--text-primary, #1E293B)', fontWeight: 500 }}>{lesson.title}</p>
                          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary, #64748B)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>🎬 Video Lecture</span>
                            <span>•</span>
                            <span>⏱ {lesson.duration}</span>
                          </p>
                        </div>
                        {enrolled ? (
                          <button onClick={() => { setActiveLesson(lesson); window.scrollTo({ top: 0 }) }} style={{ 
                            background: 'rgba(109, 142, 247, 0.08)', 
                            border: '1px solid rgba(109, 142, 247, 0.2)', 
                            color: '#6D8EF7', 
                            padding: '6px 14px', 
                            borderRadius: 8, 
                            cursor: 'pointer', 
                            fontSize: 12, 
                            fontFamily: 'DM Sans,sans-serif',
                            fontWeight: 600,
                            transition: 'all 0.2s'
                          }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(109, 142, 247, 0.15)'; e.target.style.color = '#5A7CF0' }}
                            onMouseLeave={e => { e.target.style.background = 'rgba(109, 142, 247, 0.08)'; e.target.style.color = '#6D8EF7' }}>
                            Watch
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: 14, opacity: 0.5 }}>🔒</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg-color, #F7F9FC); }
        ::-webkit-scrollbar-thumb { background: #A5B8FF; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #7C9CF5; }
      `}</style>
    </div>
  )
}

export default CourseDetail