/** Feature cards with animated Lucide icons on hover. */

import { motion } from 'framer-motion'
import { BookOpenCheck, BarChart3, MessagesSquare, CalendarClock } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

const FEATURES = [
  {
    icon: BookOpenCheck,
    title: 'انتخاب واحد آنلاین',
    desc: 'در هر ساعت از شبانه‌روز، دروس موردنظر خود را انتخاب و مدیریت کنید.',
  },
  {
    icon: BarChart3,
    title: 'مشاهده نمرات لحظه‌ای',
    desc: 'به محض ثبت نمره توسط استاد، میانگین و کارنامه ترم شما به‌روزرسانی می‌شود.',
  },
  {
    icon: MessagesSquare,
    title: 'ارتباط مستقیم با استاد',
    desc: 'اساتید با پنل اختصاصی خود، مدیریت دانشجویان و نمرات را به‌سادگی انجام می‌دهند.',
  },
  {
    icon: CalendarClock,
    title: 'مدیریت زمان',
    desc: 'تقویم ترم و برنامه درسی خود را در یک نگاه ببینید و مدیریت کنید.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-black text-center text-primary dark:text-white">
          امکانات سامانه انتخاب واحد
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          تجربه‌ای مدرن و یکپارچه برای دانشجویان و اساتید
        </p>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <GlassCard key={i} className="text-center">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 250, damping: 12 }}
                className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 dark:bg-accent/10 flex items-center justify-center text-primary dark:text-accent"
              >
                <f.icon className="h-7 w-7" />
              </motion.div>
              <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500 dark:text-slate-400">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
