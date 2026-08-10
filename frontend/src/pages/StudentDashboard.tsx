/** Student dashboard: info, grade chart, stats, enrolled courses, course selection. */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, PlusCircle, CalendarClock } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import GlassCard from '../components/ui/GlassCard'
import StudentInfoCard from '../components/student/StudentInfoCard'
import GradeChart from '../components/student/GradeChart'
import EnrolledCoursesList from '../components/student/EnrolledCoursesList'
import CourseSelectionModal from '../components/student/CourseSelectionModal'

interface DashboardData {
  student: {
    first_name: string
    last_name: string
    national_id: string
    major: string
    student_number: string
  }
  courses: {
    course_number: string
    title: string
    professor_name: string | null
    units: number
    grade: number | null
  }[]
  average_grade: number
  total_units: number
}

export default function StudentDashboard() {
  const { sub, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await api.get<DashboardData>(`/students/${sub}/dashboard`)
      setData(res)
    } catch (err: any) {
      setError(err?.message || 'خطا در دریافت اطلاعات')
    }
  }, [sub])

  useEffect(() => {
    load()
  }, [load])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold">{error}</p>
          <button onClick={handleLogout} className="mt-4 text-sm text-primary dark:text-accent">
            بازگشت به ورود
          </button>
        </div>
      </div>
    )
  }

  if (!data) return <LoadingSpinner />

  const avg = data.average_grade.toLocaleString('fa-IR')
  const units = data.total_units.toLocaleString('fa-IR')
  const count = data.courses.length.toLocaleString('fa-IR')

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="glass border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary dark:bg-accent text-white dark:text-surface-dark flex items-center justify-center font-black">
              {data.student.first_name[0] ?? 'د'}
            </div>
            <div>
              <div className="font-black text-lg">{data.student.first_name} {data.student.last_name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">دانشجو</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-2 text-sm font-bold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            خروج
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        <StudentInfoCard studentNumber={data.student.student_number} major={data.student.major} totalUnits={data.total_units} />

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'میانگین ترم', value: avg },
            { label: 'واحدهای اخذ شده', value: units },
            { label: 'تعداد دروس', value: count },
          ].map((s, i) => (
            <GlassCard key={i} className="text-center py-5">
              <div className="text-2xl font-black text-primary dark:text-accent">{s.value}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Grade chart */}
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">نمرات ترم جاری</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              میانگین: <span className="font-bold text-primary dark:text-accent">{avg}</span>
            </div>
          </div>
          <GradeChart data={data.courses} />
        </GlassCard>

        {/* Enrolled courses + actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2">
            <h2 className="font-black text-lg mb-4">دروس انتخاب‌شده</h2>
            <EnrolledCoursesList courses={data.courses} />
          </GlassCard>
          <div className="space-y-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary dark:bg-accent text-white dark:text-surface-dark py-4 font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              انتخاب واحد
            </motion.button>
            <GlassCard>
              <div className="flex items-center gap-2 font-bold text-sm mb-2">
                <CalendarClock className="h-4 w-4 text-primary dark:text-accent" />
                تقویم ترم
              </div>
              <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                شروع ترم: ۱ مهر · پایان حذف و اضافه: ۱۵ مهر · امتحانات: ۱۰ دی تا ۱۰ بهمن
              </p>
            </GlassCard>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {modalOpen && (
          <CourseSelectionModal
            studentNumber={data.student.student_number}
            onClose={() => setModalOpen(false)}
            onSelected={load}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
