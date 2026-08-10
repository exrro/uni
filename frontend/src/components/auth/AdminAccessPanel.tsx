/** Admin access-grant panel shown after admin login. */

import { useCallback, useEffect, useState } from 'react'
import { KeyRound, Users, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'
import { api } from '../../api/client'
import RippleButton from '../ui/RippleButton'

interface AccessRow {
  student_number: string
  full_name: string
  major: string
  has_access: boolean
}

export default function AdminAccessPanel() {
  const [studentNumber, setStudentNumber] = useState('')
  const [rows, setRows] = useState<AccessRow[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await api.get<AccessRow[]>('/access/students')
      setRows(data)
    } catch (err: any) {
      setError(err?.message || 'خطا در دریافت وضعیت دسترسی')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const grantOne = async (number: string, hasAccess: boolean) => {
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await api.post(`/access/students/${number}`, { has_access: hasAccess })
      setMessage(hasAccess ? `دسترسی برای ${number} فعال شد` : `دسترسی ${number} غیرفعال شد`)
      setStudentNumber('')
      await load()
    } catch (err: any) {
      setError(err?.message || 'خطا در تغییر دسترسی')
    } finally {
      setLoading(false)
    }
  }

  const grantAll = async () => {
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const res = await api.post<{ message: string }>('/access/students/all')
      setMessage(res.message)
      await load()
    } catch (err: any) {
      setError(err?.message || 'خطا در فعال‌سازی دسترسی')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-2xl bg-primary/5 dark:bg-accent/5 border border-primary/10 dark:border-accent/10 p-4">
        <div className="flex items-center gap-2 font-bold text-primary dark:text-accent mb-3">
          <KeyRound className="h-5 w-5" />
          مدیریت دسترسی دانشجویان
        </div>

        {message && (
          <div className="mb-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-4 py-2.5">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-4 py-2.5">
            {error}
          </div>
        )}

        {/* Grant to a single student */}
        <div className="flex gap-2">
          <input
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            placeholder="شماره دانشجویی"
            autoComplete="off"
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-white/5 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-accent/40"
          />
          <RippleButton
            disabled={!studentNumber.trim() || loading}
            onClick={() => grantOne(studentNumber.trim(), true)}
            className="rounded-xl bg-primary dark:bg-accent text-white dark:text-surface-dark px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            دادن دسترسی
          </RippleButton>
        </div>

        {/* Grant to all */}
        <div className="mt-3 flex gap-2">
          <RippleButton
            disabled={loading}
            onClick={grantAll}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-bold hover:bg-emerald-700 disabled:opacity-40"
          >
            <Users className="h-4 w-4" />
            دادن دسترسی به همهٔ دانشجویان
          </RippleButton>
          <a
            href="/docs"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 dark:bg-slate-600 text-white px-4 py-2 text-sm font-bold hover:bg-slate-800"
          >
            <ExternalLink className="h-4 w-4" />
            رفتن به مستندات
          </a>
        </div>
      </div>

      {/* Access list */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="font-bold text-sm mb-3">وضعیت دسترسی دانشجویان</div>
        {rows.length === 0 ? (
          <div className="text-center text-sm text-slate-400 py-4">هنوز دانشجویی ثبت نشده است</div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {rows.map((r) => (
              <li key={r.student_number} className="flex items-center justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <span className="font-medium">{r.full_name}</span>
                  <span className="text-slate-400 mx-1" dir="ltr">{r.student_number}</span>
                  {r.has_access ? (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                      <CheckCircle2 className="h-3 w-3" /> فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 text-xs">
                      <XCircle className="h-3 w-3" /> غیرفعال
                    </span>
                  )}
                </div>
                <button
                  onClick={() => grantOne(r.student_number, !r.has_access)}
                  disabled={loading}
                  className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold hover:bg-slate-200 disabled:opacity-40"
                >
                  {r.has_access ? 'غیرفعال' : 'فعال'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
