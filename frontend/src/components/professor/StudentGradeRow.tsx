/** Single student row: set grade + block, with success checkmark animation. */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Check } from 'lucide-react'
import { api } from '../../api/client'

interface Props {
  student: { first_name: string; last_name: string; student_number: string }
  grade: number | null
  courseCode: string
  onRefresh: () => void
  onBlock: (studentNumber: string) => void
}

export default function StudentGradeRow({ student, grade, courseCode, onRefresh, onBlock }: Props) {
  const [value, setValue] = useState(grade != null ? String(grade) : '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    const g = parseFloat(value)
    if (Number.isNaN(g) || g < 0 || g > 20) {
      setError('نمره باید بین ۰ تا ۲۰ باشد')
      return
    }
    setError('')
    setSaving(true)
    try {
      await api.post(`/courses/${courseCode}/grades/${student.student_number}`, { grade: g })
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
      onRefresh()
    } catch (err: any) {
      setError(err?.message || 'خطا در ثبت نمره')
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="font-bold">{student.first_name} {student.last_name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">{student.student_number}</div>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save()
            }}
            inputMode="decimal"
            placeholder="نمره ۰–۲۰"
            className="w-24 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-white/5 px-3 py-2 text-center outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-accent/40"
          />
          {saved ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center"
            >
              <Check className="h-5 w-5" />
            </motion.span>
          ) : (
            <button
              onClick={save}
              disabled={saving}
              className="rounded-xl bg-primary/10 dark:bg-accent/10 text-primary dark:text-accent px-3 py-2 text-sm font-bold disabled:opacity-50"
            >
              {saving ? '…' : 'ذخیره'}
            </button>
          )}
          <button
            onClick={() => onBlock(student.student_number)}
            className="rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 p-2 hover:bg-red-500/20 transition-colors"
            title="حذف دانشجو از درس"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {error && <div className="mt-2 text-xs text-red-500">{error}</div>}
    </li>
  )
}
