import React, { useMemo, useState } from 'react'
import { IncidentData } from '../types/incident'

interface AnalyticsDashboardProps {
  incidents: IncidentData[]
}

const palette = {
  bgFrom: 'from-indigo-600',
  bgTo: 'to-fuchsia-600',
  card: 'bg-white',
  textSubtle: 'text-slate-500',
}

const Card: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div className={`${palette.card} rounded-xl shadow-sm border border-slate-200 p-5`}> 
    <div className="mb-4">
      <h3 className="text-slate-800 font-semibold">{title}</h3>
      {subtitle && <p className={`text-sm ${palette.textSubtle}`}>{subtitle}</p>}
    </div>
    {children}
  </div>
)

function Donut({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const pct = total > 0 ? value / Math.max(total, 1) : 0
  const dash = Math.max(0, Math.min(circumference, circumference * pct))
  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#e2e8f0" strokeWidth="16" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={color}
          strokeWidth="16"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="64" textAnchor="middle" className="fill-slate-800" fontSize="18" fontWeight={700}>
          {total === 0 ? '0%' : `${Math.round(pct * 100)}%`}
        </text>
      </svg>
      <div>
        <div className="text-slate-800 font-medium">{label}</div>
        <div className="text-sm text-slate-500">{value} of {total}</div>
      </div>
    </div>
  )
}

function Bars({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...data.map(d => d.value))
  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label} className="grid grid-cols-5 items-center gap-3">
          <div className="col-span-1 text-sm text-slate-600 truncate" title={d.label}>{d.label}</div>
          <div className="col-span-4">
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                data-width={`${(d.value / max) * 100}%`}
                data-color={d.color}
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LineMini({ points, color }: { points: number[]; color: string }) {
  const width = 260
  const height = 80
  const max = Math.max(1, ...points)
  const step = points.length > 1 ? width / (points.length - 1) : width
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (p / max) * height}`).join(' ')
  const area = `M 0 ${height} ${d} L ${width} ${height} Z`
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={area} fill={`${color}20`} />
      <path d={d} stroke={color} strokeWidth={2} fill="none" />
    </svg>
  )
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ incidents }) => {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'low'>('all')
  const [deptFilter, setDeptFilter] = useState<string[]>([])

  const allDepartments = useMemo(() => {
    const set = new Set<string>()
    incidents.forEach(i => {
      (i.responsibleDepartment || '').split(',').map(s => s.trim()).filter(Boolean).forEach(d => set.add(d))
    })
    return Array.from(set).sort()
  }, [incidents])

  const filtered = useMemo(() => {
    return incidents.filter(i => {
      if (priorityFilter !== 'all' && i.priority !== priorityFilter) return false
      if (startDate) {
        const d = new Date(i.dateTime || i.createdAt).getTime()
        if (isFinite(d) && d < new Date(startDate).getTime()) return false
      }
      if (endDate) {
        const d = new Date(i.dateTime || i.createdAt).getTime()
        if (isFinite(d) && d > new Date(endDate + 'T23:59:59').getTime()) return false
      }
      if (deptFilter.length) {
        const list = (i.responsibleDepartment || '').split(',').map(s => s.trim()).filter(Boolean)
        if (!deptFilter.some(d => list.includes(d))) return false
      }
      return true
    })
  }, [incidents, startDate, endDate, priorityFilter, deptFilter])

  const totals = useMemo(() => ({
    count: filtered.length,
    high: filtered.filter(i => i.priority === 'high').length,
    low: filtered.filter(i => i.priority === 'low').length,
  }), [filtered])

  const byDepartment = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(i => {
      const list = (i.responsibleDepartment || '').split(',').map(s => s.trim()).filter(Boolean)
      list.forEach(dep => map.set(dep, (map.get(dep) || 0) + 1))
    })
    const entries = Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0,8)
    const colors = ['#6366f1','#22d3ee','#a78bfa','#34d399','#f472b6','#f59e0b','#60a5fa','#10b981']
    return entries.map(([label, value], idx) => ({ label, value, color: colors[idx % colors.length] }))
  }, [filtered])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(i => {
      const cat = (i.category || i.subject || '').trim()
      if (!cat) return
      map.set(cat, (map.get(cat) || 0) + 1)
    })
    const entries = Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0,10)
    const colors = ['#0ea5e9','#8b5cf6','#06b6d4','#22c55e','#f97316','#ef4444','#14b8a6','#a3e635','#eab308','#f43f5e']
    return entries.map(([label, value], idx) => ({ label, value, color: colors[idx % colors.length] }))
  }, [filtered])

  const byDay = useMemo(() => {
    const map = new Map<string, number>()
    filtered.forEach(i => {
      if (!i.dateTime) return
      const day = new Date(i.dateTime).toISOString().slice(0,10)
      map.set(day, (map.get(day) || 0) + 1)
    })
    const days = Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]))
    return {
      labels: days.map(d => d[0].slice(5)),
      points: days.map(d => d[1])
    }
  }, [filtered])

  return (
    <div className="space-y-8">
      <div className={`rounded-xl p-6 bg-gradient-to-r ${palette.bgFrom} ${palette.bgTo} text-white shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-white/80">Insights from your security reports</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{totals.count}</div>
              <div className="text-sm opacity-80">Total Reports</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totals.high}</div>
              <div className="text-sm opacity-80">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{totals.low}</div>
              <div className="text-sm opacity-80">Low Priority</div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-white/80 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full rounded-md px-3 py-2 text-slate-900" aria-label="Start date" />
          </div>
          <div>
            <label className="block text-xs text-white/80 mb-1">End Date</label>
            <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="w-full rounded-md px-3 py-2 text-slate-900" aria-label="End date" />
          </div>
          <div>
            <label className="block text-xs text-white/80 mb-1">Priority</label>
            <select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value as any)} className="w-full rounded-md px-3 py-2 text-slate-900" aria-label="Priority filter">
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/80 mb-1">Departments</label>
            <div className="flex flex-wrap gap-2 bg-white rounded-md p-2">
              {allDepartments.length === 0 && <span className="text-slate-500 text-sm">No departments</span>}
              {allDepartments.map(dep => {
                const active = deptFilter.includes(dep)
                return (
                  <button key={dep} type="button" onClick={()=>setDeptFilter(p=> active ? p.filter(d=>d!==dep) : [...p, dep])} className={`px-2 py-1 rounded border text-sm ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300 text-slate-700'}`} aria-label={`Toggle ${dep}`}>
                    {dep}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Priority Split" subtitle="Share of high vs low">
          <div className="flex gap-8">
            <Donut value={totals.high} total={totals.count} color="#ef4444" label="High" />
            <Donut value={totals.low} total={totals.count} color="#10b981" label="Low" />
          </div>
        </Card>

        <Card title="Top Departments" subtitle="Most assigned departments">
          <Bars data={byDepartment} />
        </Card>

        <Card title="Reports by Day" subtitle="Activity over time">
          {byDay.points.length > 0 ? (
            <div className="flex items-end justify-between">
              <LineMini points={byDay.points} color="#06b6d4" />
            </div>
          ) : (
            <div className="text-sm text-slate-500">No dated reports yet</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Top Categories" subtitle="Most frequent subjects/categories">
          <Bars data={byCategory} />
        </Card>
        <Card title="Category Share" subtitle="Distribution of top categories">
          {byCategory.length > 0 ? (
            <div className="flex flex-wrap gap-6">
              {byCategory.slice(0,4).map(c => (
                <Donut key={c.label} value={c.value} total={byCategory.reduce((s,x)=>s+x.value,0)} color={c.color} label={c.label} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">No category data yet</div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsDashboard


