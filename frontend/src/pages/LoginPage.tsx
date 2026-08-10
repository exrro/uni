/** Login page: role selection then credentials, on animated gradient. */

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimatedGradientBackground from '../components/ui/AnimatedGradientBackground'
import GooeyBlob from '../components/ui/GooeyBlob'
import RoleSelector from '../components/auth/RoleSelector'
import LoginForm from '../components/auth/LoginForm'

export default function LoginPage() {
  const [role, setRole] = useState('student')
  const location = useLocation()
  const toast = (location.state as any)?.toast

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <AnimatedGradientBackground />
      <GooeyBlob className="absolute -top-20 -left-20 w-96 h-96 opacity-60" />
      <GooeyBlob className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <h1 className="text-2xl font-black text-center text-primary dark:text-white">
          ورود به سامانه
        </h1>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-1">
          سامانه انتخاب واحد دانشگاه لرستان
        </p>

        {toast && (
          <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm px-4 py-2.5">
            {toast}
          </div>
        )}

        <div className="mt-6">
          <p className="text-sm font-medium mb-2 text-slate-600 dark:text-slate-300">نقش خود را انتخاب کنید</p>
          <RoleSelector value={role} onSelect={setRole} />
        </div>

        <div className="mt-6">
          <LoginForm key={role} role={role} onBack={() => setRole('student')} />
        </div>

        <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary dark:hover:text-accent">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
