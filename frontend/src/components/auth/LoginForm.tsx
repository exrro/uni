/** Step 2: credentials form that changes fields based on role. */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import RippleButton from '../ui/RippleButton'
import AdminAccessPanel from './AdminAccessPanel'

interface Props {
  role: string
  onBack: () => void
}

const FIELD_DEFS: Record<string, { a: string; aLabel: string; b: string; bLabel: string }> = {
  student: {
    a: 'national',
    aLabel: 'کد ملی',
    b: 'studentNumber',
    bLabel: 'شماره دانشجویی',
  },
  professor: {
    a: 'personnel',
    aLabel: 'کد استادی',
    b: 'unused',
    bLabel: '',
  },
  admin: {
    a: 'username',
    aLabel: 'نام کاربری',
    b: 'password',
    bLabel: 'رمز عبور',
  },
}

export default function LoginForm({ role, onBack }: Props) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const def = FIELD_DEFS[role]

  const isProfessor = role === 'professor'

  const validate = (): boolean => {
    if (!a.trim() || (!isProfessor && !b.trim())) {
      setError('لطفاً همه فیلدها را پر کنید')
      return false
    }
    if ((role === 'student' || role === 'professor') && a.length < 3) {
      setError('مقدار وارد شده معتبر نیست')
      return false
    }
    if (role === 'student' && b.length < 3) {
      setError('شماره دانشجویی معتبر نیست')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post<{ access_token: string; role: string; sub: string }>(
        '/auth/login',
        { role, identifier: a.trim(), secondary: isProfessor ? a.trim() : b.trim() },
      )
      login(res.access_token, res.role, res.sub)
      if (res.role === 'student') {
        navigate('/dashboard/student')
      } else if (res.role === 'professor') {
        navigate('/dashboard/professor')
      } else if (res.role === 'admin') {
        setAdminLoggedIn(true)
      }
    } catch (err: any) {
      setError(err?.message || 'خطایی رخ داد')
    } finally {
      setLoading(false)
    }
  }

  if (adminLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm px-4 py-2.5 text-center">
          خوش آمدید، ادمین
        </div>
        <AdminAccessPanel />
        <RippleButton
          onClick={() => setAdminLoggedIn(false)}
          className="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-sm font-bold"
        >
          بازگشت به فرم ورود
        </RippleButton>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-accent"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به انتخاب نقش
      </button>

      <div>
        <label className="block text-sm font-medium mb-1">{def.aLabel}</label>
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          type={role === 'admin' ? 'text' : 'text'}
          autoComplete="off"
          inputMode={role === 'student' ? 'numeric' : 'text'}
          placeholder={def.aLabel}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-white/5 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-accent/40"
        />
      </div>
      {!isProfessor && (
        <div>
          <label className="block text-sm font-medium mb-1">{def.bLabel}</label>
          <input
            value={b}
            onChange={(e) => setB(e.target.value)}
            type={role === 'admin' ? 'password' : 'text'}
            autoComplete={role === 'admin' ? 'current-password' : 'off'}
            inputMode={role === 'student' ? 'numeric' : 'text'}
            placeholder={def.bLabel}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-white/5 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-accent/40"
          />
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      <RippleButton
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-primary dark:bg-accent text-white dark:text-surface-dark py-3 font-bold hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
      >
        {loading ? 'در حال ورود…' : 'ورود'}
      </RippleButton>
    </motion.form>
  )
}
