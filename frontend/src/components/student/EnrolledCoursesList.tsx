/** List of selected courses with grades, memoized rows. */

import { memo } from 'react'

interface CourseRow {
  course_number: string
  title: string
  professor_name: string | null
  units: number
  grade: number | null
}

const Row = memo(function Row({ c }: { c: CourseRow }) {
  return (
    <li className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-3">
      <div>
        <div className="font-bold">{c.title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          استاد: {c.professor_name ?? 'نامشخص'} · {c.units} واحد
        </div>
      </div>
      <div
        className={`shrink-0 text-sm font-bold rounded-xl px-3 py-1.5 ${
          c.grade != null
            ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
        }`}
      >
        {c.grade != null ? `${c.grade.toLocaleString('fa-IR')}` : 'هنوز نمره‌ای ثبت نشده'}
      </div>
    </li>
  )
})

export default function EnrolledCoursesList({ courses }: { courses: CourseRow[] }) {
  if (!courses.length) {
    return (
      <div className="text-center text-sm text-slate-400 py-10">
        هنوز درسی انتخاب نکرده‌اید — از دکمه «انتخاب واحد» استفاده کنید.
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {courses.map((c) => (
        <Row key={c.course_number} c={c} />
      ))}
    </ul>
  )
}
