/** Scrollytelling section: pinned image with paragraphs fading in via GSAP ScrollTrigger (lazy-loaded). */

import { useEffect, useRef } from 'react'

const PARAGRAPHS = [
  'دانشگاه لرستان به عنوان یکی از معتبرترین مراکز آموزش عالی غرب کشور، در سال ۱۳۶۹ فعالیت خود را آغاز کرد. این دانشگاه با بهره‌گیری از اساتید برجسته و زیرساخت‌های آموزشی مدرن، هر ساله پذیرای هزاران دانشجوی مستعد از سراسر کشور است.',
  'دانشکده‌های این دانشگاه شامل علوم پایه، مهندسی، علوم کشاورزی، ادبیات و علوم انسانی، علوم اداری و اقتصاد، و تربیت بدنی هستند که بیش از ۸۰ رشته در مقاطع کارشناسی و تحصیلات تکمیلی را پوشش می‌دهند.',
  'رسالت دانشگاه لرستان، تربیت نیروی متخصص، کارآفرین و متعهد در راستای توسعه پایدار منطقه و کشور است. پژوهش‌های کاربردی، ارتباط با صنعت و گسترش مرزهای دانش، از اولویت‌های اصلی این دانشگاه محسوب می‌شود.',
  'سامانه انتخاب واحد آنلاین دانشگاه لرستان با هدف تسهیل فرآیندهای آموزشی، امکان انتخاب واحد، مشاهده نمرات و ارتباط مستقیم دانشجویان با اساتید را به صورت یکپارچه و در هر زمان فراهم کرده است.',
  'با افتخار، بیش از ۱۵ هزار دانشجو در مقاطع مختلف تحصیلی در این دانشگاه مشغول به تحصیل هستند و سالانه صدها مقاله علمی از سوی اعضای هیأت علمی و دانشجویان تحصیلات تکمیلی به چاپ می‌رسد.',
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let gsap: any = null
    let ScrollTrigger: any = null
    let ctx: any = null
    let cancelled = false

    const load = async () => {
      try {
        const mods = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
        if (cancelled) return
        gsap = mods[0].gsap
        ScrollTrigger = mods[1].ScrollTrigger
        gsap.registerPlugin(ScrollTrigger)

        ctx = gsap.context(() => {
          gsap.to(imageRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
            yPercent: 15,
            ease: 'none',
          })

          gsap.utils.toArray('.about-para').forEach((para: HTMLElement) => {
            gsap.fromTo(
              para,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: { trigger: para, start: 'top 85%' },
              },
            )
          })
        }, sectionRef)
      } catch {
        // GSAP failed to load — content remains visible (no fade-in).
      }
    }

    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(el)

    return () => {
      cancelled = true
      io.disconnect()
      if (ctx) ctx.revert()
      if (ScrollTrigger) ScrollTrigger.killAll()
    }
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-black text-center text-primary dark:text-white">
          درباره دانشگاه لرستان
        </h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">
          پیشگام آموزش عالی در غرب کشور
        </p>

        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <div
            ref={imageRef}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] will-change-transform"
          >
            <img
              src="/images/campus.webp"
              alt="پردیس دانشگاه لرستان"
              loading="lazy"
              width={800}
              height={600}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="space-y-5">
            {PARAGRAPHS.map((p, i) => (
              <p
                key={i}
                className="about-para leading-8 text-slate-600 dark:text-slate-300 text-[15px] opacity-0"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
