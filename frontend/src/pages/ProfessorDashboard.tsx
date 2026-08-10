/** Professor dashboard: info, top students, stats, course control panel. */

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Settings2 } from 'lucide-react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import GlassCard from '../components/ui/GlassCard'
import ProfessorInfoCard from '../components/professor/ProfessorInfoCard'
import TopStudentsCard from '../components/professor/TopStudentsCard'
import CoursePanel from '../components/professor/CoursePanel'

interface DashboardData {
  professor: {
    first_name: string
    last_name: string
    personnel_code: string
    department: string
    id: string
  }
  courses: { course_number: string; title: string; student_count: number; capacity: number }[]
  top_students: { student_number: string; full_name: string; average_grade: number }[]
  total_students: number
}

export default function ProfessorDashboard() {
  const { sub, logout } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [showPanel, setShowPanel] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await api.get<DashboardData>(`/professors/${sub}/dashboard`)
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

  const courseCount = data.courses.length.toLocaleString('fa-IR')
  const studentCount = data.total_students.toLocaleString('fa-IR')

  return (
    <div className="min-h-screen pb-16">
      <header className="glass border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary dark:bg-accent text-white dark:text-surface-dark flex items-center justify-center font-black">
              {data.professor.first_name[0] ?? 'ا'}
            </div>
            <div>
              <div className="font-black text-lg">{data.professor.first_name} {data.professor.last_name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">استاد · {data.professor.department}</div>
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
        <ProfessorInfoCard personnelCode={data.professor.personnel_code} department={data.professor.department} />

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="text-center py-5">
            <div className="text-2xl font-black text-primary dark:text-accent">{courseCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">دروس تدریس‌شده</div>
          </GlassCard>
          <GlassCard className="text-center py-5">
            <div className="text-2xl font-black text-primary dark:text-accent">{studentCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">کل دانشجویان</div>
          </GlassCard>
        </div>

        <GlassCard>
          <h2 className="font-black text-lg mb-4">دانشجویان برتر</h2>
          <TopStudentsCard students={data.top_students} />
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg">کنترل دروس</h2>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPanel((s) => !s)}
              className="flex items-center gap-2 rounded-xl bg-primary dark:bg-accent text-white dark:text-surface-dark px-4 py-2.5 font-bold text-sm hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
            >
              <Settings2 className="h-4 w-4" />
              {showPanel ? 'بستن پنل' : 'پنل کنترل دروس'}
            </motion.button>
          </div>
          {showPanel && <CoursePanel personnelCode={data.professor.personnel_code} />}
        </GlassCard>
      </main>
    </div>
  )
}
