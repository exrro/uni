/** Friendly Persian 404 page. */

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent"
        >
          <Compass className="h-10 w-10" />
        </motion.div>
        <h1 className="mt-6 text-6xl font-black text-primary dark:text-accent">۴۰۴</h1>
        <p className="mt-2 text-lg font-bold">صفحه موردنظر پیدا نشد</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          به نظر می‌رسد به آدرس اشتباهی هدایت شده‌اید.
        </p>
        <Link
          to="/"
          className="mt-8 inline-block rounded-2xl bg-primary dark:bg-accent text-white dark:text-surface-dark px-6 py-3 font-bold hover:bg-primary-light dark:hover:bg-accent-light transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  )
}
