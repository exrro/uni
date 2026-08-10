/** Gallery grid with subtle tilt-on-hover (2.5D), using real university photos. */

import { motion } from 'framer-motion'

const ITEMS = [
  { src: '/images/campus.webp', alt: 'پردیس دانشگاه لرستان' },
  { src: '/images/library.webp', alt: 'کتابخانه دانشگاه لرستان' },
  { src: '/images/classroom.webp', alt: 'کلاس درس دانشگاه لرستان' },
  { src: '/images/lab.webp', alt: 'آزمایشگاه دانشگاه لرستان' },
  { src: '/images/gallery-1.webp', alt: 'فضای آموزشی دانشگاه لرستان' },
]

export default function GallerySection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-black text-center text-primary dark:text-white">گالری تصاویر</h2>
        <p className="mt-2 text-center text-slate-500 dark:text-slate-400">نمایی از فضاهای آموزشی و پژوهشی دانشگاه لرستان</p>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ rotateX: 6, rotateY: -6, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              style={{ transformStyle: 'preserve-3d', perspective: 800 }}
              className="rounded-2xl overflow-hidden shadow-lg group"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                width={400}
                height={300}
                className="aspect-[4/3] object-cover w-full group-hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
