/** Footer with university info and decorative social links. */

import { GraduationCap, Instagram, Send, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-primary dark:text-accent">
              <GraduationCap className="h-6 w-6" />
              دانشگاه لرستان
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              سامانه انتخاب واحد آنلاین دانشگاه لرستان — خرم‌آباد، ایران
            </p>
          </div>
          <div className="text-sm">
            <div className="font-bold mb-2">دسترسی سریع</div>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li><a href="#home" className="hover:text-primary dark:hover:text-accent">صفحه اصلی</a></li>
              <li><a href="#about" className="hover:text-primary dark:hover:text-accent">درباره دانشگاه</a></li>
              <li><a href="#features" className="hover:text-primary dark:hover:text-accent">امکانات</a></li>
              <li><a href="#contact" className="hover:text-primary dark:hover:text-accent">تماس با ما</a></li>
            </ul>
          </div>
          <div className="flex items-center gap-3">
            <span className="sr-only">شبکه‌های اجتماعی</span>
            <a href="#" aria-label="اینستاگرام" className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="تلگرام" className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60">
              <Send className="h-5 w-5" />
            </a>
            <a href="#" aria-label="توییتر" className="p-2 rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-700/60">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          © {new Date().getFullYear().toLocaleString('fa-IR')} دانشگاه لرستان — تمامی حقوق محفوظ است
        </div>
      </div>
    </footer>
  )
}
