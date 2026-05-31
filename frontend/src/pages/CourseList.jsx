import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const courses = [
  {
    _id: '1', title: 'Complete Web Development Bootcamp', instructor: { name: 'Angela Yu' },
    category: 'Web Dev', level: 'beginner', price: 0, averageRating: 4.8,
    totalStudents: 125000, duration: '63 hours', lessons: 28, color: '#6c47ff',
    thumbnail: 'https://img.youtube.com/vi/mU6anWqZJcc/hqdefault.jpg',
    description: 'Become a full-stack web developer with HTML, CSS, JS, Node, React, MongoDB and more!',
    sections: [
      { title: 'HTML Fundamentals', lessons: [
        { _id: 'l1', title: 'Intro to HTML', videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', duration: '12 min' },
        { _id: 'l2', title: 'HTML Elements', videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', duration: '18 min' },
        { _id: 'l3', title: 'HTML Forms', videoUrl: 'https://www.youtube.com/embed/fNcJuPIZ2WE', duration: '15 min' },
      ]},
      { title: 'CSS Styling', lessons: [
        { _id: 'l4', title: 'Intro to CSS', videoUrl: 'https://www.youtube.com/embed/yfoY53QXEnI', duration: '20 min' },
        { _id: 'l5', title: 'CSS Flexbox', videoUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc', duration: '25 min' },
      ]},
      { title: 'JavaScript', lessons: [
        { _id: 'l6', title: 'JS Intro', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: '30 min' },
        { _id: 'l7', title: 'JS Functions', videoUrl: 'https://www.youtube.com/embed/xUI5Tsl2JpY', duration: '22 min' },
      ]},
    ]
  },
  {
    _id: '2', title: 'React JS Full Course 2024', instructor: { name: 'Traversy Media' },
    category: 'Frontend', level: 'intermediate', price: 0, averageRating: 4.9,
    totalStudents: 98000, duration: '32 hours', lessons: 20, color: '#00d2ff',
    thumbnail: 'https://img.youtube.com/vi/w7ejDZ8SWv8/hqdefault.jpg',
    description: 'Learn React JS from scratch with hooks, context API, and React Router.',
    sections: [
      { title: 'React Fundamentals', lessons: [
        { _id: 'l8', title: 'React Intro', videoUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8', duration: '45 min' },
        { _id: 'l9', title: 'Components', videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM', duration: '35 min' },
        { _id: 'l10', title: 'React Hooks', videoUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', duration: '40 min' },
      ]},
      { title: 'Advanced React', lessons: [
        { _id: 'l11', title: 'Context API', videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc', duration: '28 min' },
        { _id: 'l12', title: 'React Router', videoUrl: 'https://www.youtube.com/embed/Law7wfdg_ls', duration: '32 min' },
      ]},
    ]
  },
  {
    _id: '3', title: 'Node.js & Express Masterclass', instructor: { name: 'Traversy Media' },
    category: 'Backend', level: 'intermediate', price: 0, averageRating: 4.7,
    totalStudents: 76000, duration: '28 hours', lessons: 18, color: '#00c851',
    thumbnail: 'https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg',
    description: 'Learn Node.js and Express. Build REST APIs and web applications.',
    sections: [
      { title: 'Node.js Basics', lessons: [
        { _id: 'l13', title: 'Node Intro', videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4', duration: '30 min' },
        { _id: 'l14', title: 'NPM & Modules', videoUrl: 'https://www.youtube.com/embed/jHyfbLtpLrs', duration: '20 min' },
      ]},
      { title: 'Express Framework', lessons: [
        { _id: 'l15', title: 'Express Setup', videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE', duration: '25 min' },
        { _id: 'l16', title: 'REST API', videoUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48', duration: '35 min' },
      ]},
    ]
  },
  {
    _id: '4', title: 'Python for Beginners', instructor: { name: 'Mosh Hamedani' },
    category: 'Python', level: 'beginner', price: 0, averageRating: 4.9,
    totalStudents: 210000, duration: '45 hours', lessons: 32, color: '#ff9500',
    thumbnail: 'https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg',
    description: 'Learn Python from scratch. Perfect for beginners with no coding experience.',
    sections: [
      { title: 'Python Basics', lessons: [
        { _id: 'l17', title: 'Python Intro', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: '60 min' },
        { _id: 'l18', title: 'Variables', videoUrl: 'https://www.youtube.com/embed/khKv-8q7YmY', duration: '40 min' },
      ]},
      { title: 'Python OOP', lessons: [
        { _id: 'l19', title: 'Functions', videoUrl: 'https://www.youtube.com/embed/9Os0o3wzS_I', duration: '35 min' },
        { _id: 'l20', title: 'Classes', videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0', duration: '45 min' },
      ]},
    ]
  },
  {
    _id: '5', title: 'MongoDB Complete Guide', instructor: { name: 'Academind' },
    category: 'Database', level: 'intermediate', price: 0, averageRating: 4.6,
    totalStudents: 54000, duration: '20 hours', lessons: 14, color: '#00c851',
    thumbnail: 'https://img.youtube.com/vi/ExcRbA7fy_A/hqdefault.jpg',
    description: 'Master MongoDB — CRUD, aggregation, indexes and more.',
    sections: [
      { title: 'MongoDB Basics', lessons: [
        { _id: 'l21', title: 'MongoDB Intro', videoUrl: 'https://www.youtube.com/embed/ExcRbA7fy_A', duration: '30 min' },
        { _id: 'l22', title: 'CRUD Ops', videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU', duration: '25 min' },
      ]},
    ]
  },
  {
    _id: '6', title: 'Tailwind CSS Full Course', instructor: { name: 'Dave Gray' },
    category: 'CSS', level: 'beginner', price: 0, averageRating: 4.8,
    totalStudents: 67000, duration: '16 hours', lessons: 12, color: '#00d2ff',
    thumbnail: 'https://img.youtube.com/vi/lCxcTsOHrjo/hqdefault.jpg',
    description: 'Build beautiful websites faster with Tailwind CSS utility classes.',
    sections: [
      { title: 'Tailwind Basics', lessons: [
        { _id: 'l23', title: 'Tailwind Intro', videoUrl: 'https://www.youtube.com/embed/lCxcTsOHrjo', duration: '35 min' },
        { _id: 'l24', title: 'Components', videoUrl: 'https://www.youtube.com/embed/mchKIecfFGI', duration: '28 min' },
      ]},
    ]
  },
  {
    _id: '7', title: 'TypeScript Crash Course', instructor: { name: 'Traversy Media' },
    category: 'TypeScript', level: 'intermediate', price: 0, averageRating: 4.7,
    totalStudents: 43000, duration: '12 hours', lessons: 10, color: '#6c47ff',
    thumbnail: 'https://img.youtube.com/vi/BCg4U1FzODs/hqdefault.jpg',
    description: 'Get up and running with TypeScript — types, interfaces, generics.',
    sections: [
      { title: 'TypeScript Basics', lessons: [
        { _id: 'l25', title: 'TS Intro', videoUrl: 'https://www.youtube.com/embed/BCg4U1FzODs', duration: '40 min' },
        { _id: 'l26', title: 'Interfaces', videoUrl: 'https://www.youtube.com/embed/ahCwqrYpIuM', duration: '30 min' },
      ]},
    ]
  },
  {
    _id: '8', title: 'Git & GitHub Full Course', instructor: { name: 'freeCodeCamp' },
    category: 'DevOps', level: 'beginner', price: 0, averageRating: 4.9,
    totalStudents: 189000, duration: '18 hours', lessons: 15, color: '#ff6b6b',
    thumbnail: 'https://img.youtube.com/vi/RGOj5yH7evk/hqdefault.jpg',
    description: 'Master Git and GitHub for version control.',
    sections: [
      { title: 'Git Basics', lessons: [
        { _id: 'l27', title: 'Git Intro', videoUrl: 'https://www.youtube.com/embed/RGOj5yH7evk', duration: '50 min' },
        { _id: 'l28', title: 'Branching', videoUrl: 'https://www.youtube.com/embed/e2IbNHi4uCI', duration: '35 min' },
      ]},
    ]
  },
  {
    _id: '9', title: 'Cybersecurity Fundamentals', instructor: { name: 'NetworkChuck' },
    category: 'Security', level: 'beginner', price: 0, averageRating: 4.8,
    totalStudents: 91000, duration: '22 hours', lessons: 16, color: '#ff3cac',
    thumbnail: 'https://img.youtube.com/vi/hXSFdwIIfkc/hqdefault.jpg',
    description: 'Learn ethical hacking, network security fundamentals.',
    sections: [
      { title: 'Security Basics', lessons: [
        { _id: 'l29', title: 'Cybersecurity Intro', videoUrl: 'https://www.youtube.com/embed/hXSFdwIIfkc', duration: '40 min' },
        { _id: 'l30', title: 'Network Security', videoUrl: 'https://www.youtube.com/embed/qiQR5rTSshw', duration: '35 min' },
      ]},
    ]
  },
  {
    _id: '10', title: 'Flutter Mobile App Dev', instructor: { name: 'Flutter Dev' },
    category: 'Mobile', level: 'intermediate', price: 0, averageRating: 4.7,
    totalStudents: 38000, duration: '24 hours', lessons: 18, color: '#00d2ff',
    thumbnail: 'https://img.youtube.com/vi/VPvVD8t02U8/hqdefault.jpg',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart.',
    sections: [
      { title: 'Flutter Basics', lessons: [
        { _id: 'l31', title: 'Flutter Intro', videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8', duration: '45 min' },
        { _id: 'l32', title: 'Widgets', videoUrl: 'https://www.youtube.com/embed/b_sQ9bMltGU', duration: '38 min' },
      ]},
    ]
  },
  {
    _id: '11', title: 'AWS Cloud Practitioner', instructor: { name: 'freeCodeCamp' },
    category: 'Cloud', level: 'beginner', price: 0, averageRating: 4.8,
    totalStudents: 72000, duration: '26 hours', lessons: 20, color: '#ff9500',
    thumbnail: 'https://img.youtube.com/vi/3hLmDS179YE/hqdefault.jpg',
    description: 'Pass the AWS Cloud Practitioner exam and start your cloud career.',
    sections: [
      { title: 'AWS Fundamentals', lessons: [
        { _id: 'l33', title: 'AWS Intro', videoUrl: 'https://www.youtube.com/embed/3hLmDS179YE', duration: '55 min' },
        { _id: 'l34', title: 'Core Services', videoUrl: 'https://www.youtube.com/embed/ulprqHHWlng', duration: '42 min' },
      ]},
    ]
  },
  {
    _id: '12', title: 'Machine Learning with Python', instructor: { name: 'Sentdex' },
    category: 'AI/ML', level: 'advanced', price: 0, averageRating: 4.9,
    totalStudents: 115000, duration: '40 hours', lessons: 30, color: '#ff6b6b',
    thumbnail: 'https://img.youtube.com/vi/OGxgnH8y2NM/hqdefault.jpg',
    description: 'Master machine learning algorithms with Python and TensorFlow.',
    sections: [
      { title: 'ML Fundamentals', lessons: [
        { _id: 'l35', title: 'ML Intro', videoUrl: 'https://www.youtube.com/embed/OGxgnH8y2NM', duration: '50 min' },
        { _id: 'l36', title: 'Regression', videoUrl: 'https://www.youtube.com/embed/R15LjD8aCzc', duration: '44 min' },
      ]},
    ]
  },
]

const categories = ['All', 'Web Dev', 'Frontend', 'Backend', 'Python', 'Database', 'CSS', 'TypeScript', 'DevOps', 'Security', 'Mobile', 'Cloud', 'AI/ML']

const CourseList = () => {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || c.category === category
    return matchSearch && matchCat
  })

  return (
    <div style={{ background: 'var(--bg-color, #F7F9FC)', minHeight: '100vh', color: 'var(--text-primary, #1E293B)', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Visitor Navbar */}
      {!user && (
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 32px', 
          borderBottom: '1px solid var(--border-color, #E2E8F0)', 
          position: 'sticky', 
          top: 0, 
          zIndex: 50, 
          background: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)'
        }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--text-primary, #1E293B)' }}>
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
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 18 }}>
              Learn<span style={{ color: '#6D8EF7' }}>ix</span>
            </span>
          </Link>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary, #64748B)', textDecoration: 'none', padding: '8px 18px', fontSize: 14, borderRadius: 10, border: '1px solid var(--border-color, #E2E8F0)', background: 'transparent', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'rgba(109,142,247,0.06)'; e.target.style.color = '#1E293B' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-secondary, #64748B)' }}>
              Sign In
            </Link>
            <Link to="/register" style={{ 
              background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
              color: '#fff', 
              textDecoration: 'none', 
              padding: '8px 18px', 
              fontSize: 14, 
              borderRadius: 10, 
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(124, 156, 245, 0.25)',
              transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}>
              Get Started Free
            </Link>
          </div>
        </nav>
      )}

      {/* Hero */}
      <div style={{ position: 'relative', textAlign: 'center', padding: '60px 24px 36px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 156, 245, 0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'absolute', top: 0, right: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(165, 184, 255, 0.08) 0%, transparent 70%)' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            display: 'inline-block', 
            background: 'rgba(109, 142, 247, 0.1)', 
            border: '1px solid rgba(109, 142, 247, 0.2)', 
            borderRadius: 100, 
            padding: '6px 16px', 
            fontSize: 12, 
            color: '#6D8EF7', 
            fontWeight: 600, 
            letterSpacing: 1, 
            textTransform: 'uppercase', 
            marginBottom: 18 
          }}>
            {courses.length}+ Expert Courses
          </span>
          <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 'clamp(32px,6vw,64px)', marginBottom: 14, letterSpacing: '-2px', lineHeight: 1.1, color: 'var(--text-primary, #1E293B)' }}>
            Explore Our <span style={{ background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Courses</span>
          </h1>
          <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 16, marginBottom: 28 }}>
            {courses.length} world-class courses · All completely free to preview
          </p>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#6D8EF7' }}>🔍</span>
            <input type="text" placeholder="Search courses or instructors..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '13px 20px 13px 44px', 
                borderRadius: 16, 
                fontSize: 14, 
                outline: 'none', 
                background: '#FFFFFF', 
                border: '1px solid var(--border-color, #E2E8F0)', 
                color: 'var(--text-primary, #1E293B)', 
                transition: 'all 0.2s', 
                boxSizing: 'border-box',
                boxShadow: '0 4px 20px rgba(109, 142, 247, 0.04)'
              }}
              onFocus={e => { e.target.style.borderColor = '#7C9CF5'; e.target.style.boxShadow = '0 4px 20px rgba(109, 142, 247, 0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-color, #E2E8F0)'; e.target.style.boxShadow = '0 4px 20px rgba(109, 142, 247, 0.04)' }} />
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, padding: '0 24px 28px' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '8px 18px', 
            borderRadius: 100, 
            fontSize: 12, 
            fontWeight: 500, 
            cursor: 'pointer', 
            transition: 'all 0.25s', 
            border: 'none',
            background: category === c ? 'linear-gradient(135deg, #7C9CF5, #A5B8FF)' : '#FFFFFF',
            color: category === c ? '#fff' : 'var(--text-secondary, #64748B)',
            boxShadow: category === c ? '0 8px 20px rgba(124, 156, 245, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.02)',
            transform: category === c ? 'scale(1.05)' : 'scale(1)',
            border: category === c ? 'none' : '1px solid var(--border-color, #E2E8F0)'
          }}>
            {c}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
        <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 13, marginBottom: 20 }}>{filtered.length} courses found</p>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 14 }}>🔍</div>
            <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 20 }}>No courses found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 18 }}>
            {filtered.map((course, i) => (
              <Link to={`/courses/${course._id}`} state={{ course }} key={course._id} style={{ textDecoration: 'none' }}>
                <div style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid var(--border-color, #E2E8F0)', 
                  borderRadius: 18, 
                  overflow: 'hidden', 
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
                  cursor: 'pointer', 
                  height: '100%', 
                  animation: `fadeUp 0.5s ease ${(i % 8) * 0.06}s both`,
                  boxShadow: '0 10px 30px rgba(109, 142, 247, 0.03)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-7px)'; e.currentTarget.style.borderColor = '#7C9CF5'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(124, 156, 245, 0.15)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-color, #E2E8F0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(109, 142, 247, 0.03)' }}
                >
                  <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
                    <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(255,255,255,0.4) 0%, transparent 50%)` }} />
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={{ 
                        background: 'rgba(255,255,255,0.9)', 
                        backdropFilter: 'blur(10px)', 
                        border: `1px solid ${course.color}30`, 
                        color: course.color, 
                        fontSize: 10, 
                        padding: '3px 9px', 
                        borderRadius: 100, 
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                      }}>{course.category}</span>
                    </div>
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 10, padding: '3px 9px', borderRadius: 100, fontWeight: 700 }}>FREE</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, margin: '0 0 6px', color: 'var(--text-primary, #1E293B)', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 12, margin: '0 0 12px' }}>by {course.instructor.name}</p>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-secondary, #64748B)', marginBottom: 12 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>⭐ {course.averageRating}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>🎬 {course.lessons} lessons</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>⏱ {course.duration}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color, #E2E8F0)', paddingTop: 12 }}>
                      <span style={{ 
                        fontSize: 11, 
                        padding: '3px 9px', 
                        borderRadius: 100, 
                        fontWeight: 600, 
                        textTransform: 'capitalize', 
                        background: course.level === 'beginner' ? 'rgba(16,185,129,0.1)' : course.level === 'intermediate' ? 'rgba(255,149,0,0.1)' : 'rgba(239,68,68,0.1)', 
                        color: course.level === 'beginner' ? '#10B981' : course.level === 'intermediate' ? '#ff9500' : '#ff3b3b' 
                      }}>
                        {course.level}
                      </span>
                      <span style={{ color: 'var(--text-secondary, #64748B)', fontSize: 11 }}>{course.totalStudents.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div style={{ height: 4, background: `linear-gradient(90deg, #7C9CF5, #A5B8FF)` }} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA for visitors */}
        {!user && (
          <div style={{ 
            marginTop: 56, 
            textAlign: 'center', 
            background: 'linear-gradient(135deg, rgba(124, 156, 245, 0.05), rgba(165, 184, 255, 0.05))', 
            border: '1px solid var(--border-color, #E2E8F0)', 
            borderRadius: 22, 
            padding: '48px 32px',
            boxShadow: '0 10px 40px rgba(124, 156, 245, 0.02)'
          }}>
            <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 900, fontSize: 32, marginBottom: 12, color: 'var(--text-primary, #1E293B)', letterSpacing: '-0.5px' }}>Ready to Start Learning?</h2>
            <p style={{ color: 'var(--text-secondary, #64748B)', fontSize: 15, marginBottom: 28, maxWidth: 500, margin: '0 auto 28px' }}>Join 50,000+ students at Learnix. Create your free account today.</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ 
                background: 'linear-gradient(135deg, #7C9CF5, #A5B8FF)', 
                color: '#fff', 
                textDecoration: 'none', 
                padding: '13px 32px', 
                borderRadius: 13, 
                fontWeight: 700, 
                fontSize: 15, 
                boxShadow: '0 4px 15px rgba(124, 156, 245, 0.3)',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}>
                Create Free Account →
              </Link>
              <Link to="/login" style={{ 
                background: '#FFFFFF', 
                border: '1px solid var(--border-color, #E2E8F0)', 
                color: 'var(--text-primary, #1E293B)', 
                textDecoration: 'none', 
                padding: '13px 32px', 
                borderRadius: 13, 
                fontWeight: 600, 
                fontSize: 15,
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
                onMouseEnter={e => { e.target.style.background = 'rgba(109,142,247,0.06)'; e.target.style.borderColor = '#7C9CF5' }}
                onMouseLeave={e => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = 'var(--border-color, #E2E8F0)' }}>
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        input::placeholder { color: var(--text-secondary, #64748B); opacity: 0.6; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--bg-color, #F7F9FC); }
        ::-webkit-scrollbar-thumb { background: #A5B8FF; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #7C9CF5; }
      `}</style>
    </div>
  )
}

export default CourseList