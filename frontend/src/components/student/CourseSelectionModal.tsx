/** Animated modal listing available courses for selection. */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { api } from '../../api/client'
import LoadingSpinner from '../ui/LoadingSpinner'
import RippleButton from '../ui/RippleButton'

interface Course {
  code: string
  title: string
  units: number
  capacity: number
  students: string[]
  blocked_students: string[]
  professor_id: string | null
}

interface Props {
  studentNumber: string
  onClose: () => void
  onSelected: () => void
}

export default function CourseSelectionModal({ studentNumber, onClose, onSelected }: Props) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyCode, setBusyCode] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let mounted = true
    api
      .get<Course[]>('/courses/')
      .then((data) => {
        if (mounted) setCourses(data)
      })
      .catch((err) => {
        if (mounted) setError(err?.message || 'خطا در دریافت دروس')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const isBlocked = (c: Course) => c.blocked_students.includes(studentNumber)
  const isEnrolled = (c: Course) => c.students.includes(studentNumber)
  const isFull = (c: Course) => c.students.length >= c.capacity

  const select = async (code: string) => {
    setBusyCode(code)
    setError('')
    setToast('')
    try {
      await api.post(`/selection/${studentNumber}/${code}`)
      setToast(`درس با موفقیت انتخاب شد`)
      onSelected()
    } catch (err: any) {
      setError(err?.message || 'انتخاب ناموفق بود')
    } finally {
      setBusyCode(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-primary dark:text-white">انتخاب واحد</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="بستن">
            <X className="h-5 w-5" />
          </button>
        </div>

        {toast && (
          <div className="mb-4 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-4 py-2.5">
            {toast}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-4 py-2.5">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <ul className="space-y-3">
            {courses.map((c) => {
              const blocked = isBlocked(c)
              const enrolled = isEnrolled(c)
              const full = isFull(c)
              const disabled = blocked || full || enrolled
              return (
                <li key={c.code} className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold">{c.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      کد: {c.code} · {c.units} واحد · ظرفیت: {c.students.length}/{c.capacity}
                    </div>
                    {blocked && (
                      <div className="text-xs text-red-500 mt-1">شما توسط استاد از این درس حذف شده‌اید</div>
                    )}
                    {full && !blocked && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">ظرفیت تکمیل است</div>
                    )}
                  </div>
                  <RippleButton
                    disabled={disabled || busyCode === c.code}
                    onClick={() => select(c.code)}
                    className="shrink-0 rounded-xl bg-primary dark:bg-accent text-white dark:text-surface-dark px-4 py-2 text-sm font-bold disabled:opacity-40 hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
                  >
                    {enrolled ? 'انتخاب شده' : busyCode === c.code ? '…' : 'انتخاب'}
                  </RippleButton>
                </li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </motion.div>
  )
}
