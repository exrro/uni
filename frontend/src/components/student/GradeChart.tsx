/** Recharts bar chart of grades per course, animated on mount. */

import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ReferenceLine } from 'recharts'

export default function GradeChart({ data }: { data: { title: string; grade: number | null }[] }) {
  const chartData = useMemo(
    () =>
      data.map((d, i) => ({
        name: d.title.length > 12 ? d.title.slice(0, 12) + '…' : d.title,
        grade: d.grade ?? 0,
        graded: d.grade != null,
        fill: d.grade != null ? '#C9A227' : '#94a3b8',
        key: i,
      })),
    [data],
  )

  if (!chartData.length) {
    return (
      <div className="text-center text-sm text-slate-400 py-12">هنوز درسی انتخاب نکرده‌اید</div>
    )
  }

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(v: number) => [v, 'نمره']}
            contentStyle={{ direction: 'rtl', fontFamily: 'Vazirmatn' }}
          />
          <ReferenceLine y={10} stroke="#94a3b8" strokeDasharray="4 4" />
          <Bar dataKey="grade" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
            {chartData.map((d) => (
              <Cell key={d.key} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
