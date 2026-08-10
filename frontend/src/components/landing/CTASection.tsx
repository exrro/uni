/** Second call-to-action with the same magnetic+ripple button. */

import { useNavigate } from 'react-router-dom'
import MagneticRippleButton from '../ui/MagneticRippleButton'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section id="contact" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="glass rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-black text-primary dark:text-white">
            آماده شروع هستید؟
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-8">
            وارد داشبورد شوید و انتخاب واحد، نمرات و مدیریت دروس را به‌صورت آنلاین انجام دهید.
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticRippleButton onClick={() => navigate('/login')}>
              ورود به داشبورد
            </MagneticRippleButton>
          </div>
        </div>
      </div>
    </section>
  )
}
