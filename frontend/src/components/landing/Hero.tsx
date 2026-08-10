/** Full-viewport hero with gooey blob background and staggered text animation. */

import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import GooeyBlob from '../ui/GooeyBlob'
import MagneticRippleButton from '../ui/MagneticRippleButton'

export default function Hero() {
  const navigate = useNavigate()

  const title = 'به دانشگاه لرستان خوش آمدید'

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GooeyBlob className="absolute inset-0 w-full h-full opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface dark:to-surface-dark" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pt-24">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-primary dark:text-white leading-tight"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {title.split(' ').map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
            >
              {word}
              {i < title.split(' ').length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          سامانه جامع انتخاب واحد، مشاهده نمرات و مدیریت دوره‌های آموزشی دانشگاه لرستان
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <MagneticRippleButton onClick={() => navigate('/login')}>
            ورود به داشبورد
          </MagneticRippleButton>
        </motion.div>
      </div>
    </section>
  )
}
