/** Course control panel: pick a course, then manage its students' grades. */

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { api } from '../../api/client'
import LoadingSpinner from '../ui/LoadingSpinner'
import StudentGradeRow from './StudentGradeRow'

interface ProfessorCourse {
  course_number: string
  title: string
  student_count: number
  capacity: number
}

interface StudentData {
  first_name: string
  last_name: string
  student_number: string
}

export default function CoursePanel({ personnelCode }: { personnelCode: string }) {
  const [courses, setCourses] = useState<ProfessorCourse[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [grades, setGrades] = useState<Record<string, number | null>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<{ courses: ProfessorCourse[] }>(`/professors/${personnelCode}/dashboard`)
      .then((res) => setCourses(res.courses))
      .catch((err) => setError(err?.message || 'خطا در دریافت دروس'))
      .finally(() => setLoading(false))
  }, [personnelCode])

  const loadStudents = useCallback(async (courseCode: string) => {
    setError('')
    try {
      const studentsRes = await api.get<StudentData[]>(`/courses/${courseCode}/students`)
      setStudents(studentsRes)
      // Grades come from the same course the professor owns; fetch them, but if
      // the grades call fails, still show the student list (just no grades).
      try {
        const courseRes = await api.get<Record<string, any>>(`/courses/${courseCode}`)
        setGrades(courseRes.grades ?? {})
      } catch {
        setGrades({})
      }
    } catch (err: any) {
      setError(err?.message || 'خطا در دریافت دانشجویان')
    }
  }, [])

  const openCourse = async (code: string) => {
    setSelected(code)
    await loadStudents(code)
  }

  const blockStudent = async (studentNumber: string) => {
    if (!selected) return
    try {
      await api.delete(`/courses/${selected}/students/${studentNumber}`)
      setConfirm(null)
      await loadStudents(selected)
    } catch (err: any) {
      setError(err?.message || 'خطا در حذف دانشجو')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h3 className="font-black text-lg mb-3">دروس شما</h3>
            {!courses.length ? (
              <div className="text-center text-sm text-slate-400 py-8">درسی به شما اختصاص داده نشده است</div>
            ) : (
              <ul className="space-y-3">
                {courses.map((c) => (
                  <motion.li
                    key={c.course_number}
                    whileHover={{ y: -2 }}
                    onClick={() => openCourse(c.course_number)}
                    className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between hover:border-primary/40 dark:hover:border-accent/40 transition-colors"
                  >
                    <div>
                      <div className="font-bold">{c.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        کد: {c.course_number} · دانشجو: {c.student_count}/{c.capacity}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        ) : (
          <motion.div key={selected} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent mb-4"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به فهرست دروس
            </button>
            <h3 className="font-black text-lg mb-3">دانشجویان درس {selected}</h3>
            {!students.length ? (
              <div className="text-center text-sm text-slate-400 py-8">دانشجویی در این درس ثبت نشده است</div>
            ) : (
              <ul className="space-y-3">
                {students.map((s) => (
                  <StudentGradeRow
                    key={s.student_number}
                    student={s}
                    grade={grades[s.student_number] ?? null}
                    courseCode={selected}
                    onRefresh={() => loadStudents(selected)}
                    onBlock={(sn) => setConfirm(sn)}
                  />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm block dialog */}
      <AnimatePresence>
        {confirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl text-center"
            >
              <h4 className="font-black text-lg">آیا مطمئن هستید؟</h4>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                این دانشجو از درس حذف و دسترسی او برای انتخاب مجدد مسدود می‌شود.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <button
                  onClick={() => setConfirm(null)}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2 font-bold text-sm"
                >
                  انصراف
                </button>
                <button
                  onClick={() => blockStudent(confirm)}
                  className="rounded-xl bg-red-600 text-white px-5 py-2 font-bold text-sm hover:bg-red-700"
                >
                  بله، حذف کن
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
