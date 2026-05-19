import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WhisperCard from '../shared/WhisperCard'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const grid = []
  for (let i = 0; i < firstDay; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)
  return grid
}

export default function WhisperCalendar({ whispers, onWhisperClick }) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [expandedDay, setExpandedDay] = useState(null)

  const grid = buildCalendarGrid(viewYear, viewMonth)
  const todayDay = now.getDate()
  const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth()

  // Index whispers by day number for this month/year
  const byDay = {}
  whispers.forEach(w => {
    const d = new Date(w.sent_at || w.created_at)
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate()
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(w)
    }
  })

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
    setExpandedDay(null)
  }
  function nextMonth() {
    // Don't go past current month
    if (viewYear === now.getFullYear() && viewMonth === now.getMonth()) return
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
    setExpandedDay(null)
  }

  const isFutureMonth = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth())
  const expandedWhispers = expandedDay ? (byDay[expandedDay] || []) : []

  return (
    <div style={{ padding: '0 20px 40px' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button className="btn-ghost" onClick={prevMonth} style={{ padding: '8px 14px' }}>←</button>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--charcoal)' }}>
          {MONTHS[viewMonth]} {viewYear}
        </h3>
        <button className="btn-ghost" onClick={nextMonth} disabled={isCurrentMonth} style={{ padding: '8px 14px', opacity: isCurrentMonth ? 0.3 : 1 }}>→</button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '4px' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 500, color: 'rgba(44,44,44,0.35)', padding: '4px 0', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {grid.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const dayWhispers = byDay[day] || []
          const hasWhispers = dayWhispers.length > 0
          const isToday = isCurrentMonth && day === todayDay
          const isFuture = isCurrentMonth && day > todayDay
          const isExpanded = expandedDay === day

          return (
            <motion.div
              key={day}
              className={`calendar-day ${hasWhispers ? 'has-whispers' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => hasWhispers ? setExpandedDay(isExpanded ? null : day) : null}
              style={{
                opacity: isFuture ? 0.3 : 1,
                background: isExpanded ? 'rgba(232,196,184,0.4)' : undefined,
              }}
              whileHover={hasWhispers ? { scale: 1.06 } : {}}
              whileTap={hasWhispers ? { scale: 0.96 } : {}}
            >
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: isToday ? 600 : 400,
                color: isToday ? 'var(--gold)' : 'var(--charcoal)',
              }}>
                {day}
              </span>
              {hasWhispers && (
                <div className="flex gap-0.5 flex-wrap justify-center" style={{ maxWidth: '28px' }}>
                  {dayWhispers.slice(0, 3).map((_, di) => (
                    <div key={di} className={`whisper-dot ${di === 0 ? 'gold' : ''}`} />
                  ))}
                  {dayWhispers.length > 3 && (
                    <div className="whisper-dot" style={{ background: 'var(--sage-deep)' }} />
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Expanded day whispers */}
      <AnimatePresence>
        {expandedDay && expandedWhispers.length > 0 && (
          <motion.div
            key={expandedDay}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden', marginTop: '16px' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.4)', marginBottom: '12px' }}>
              {expandedWhispers.length} whisper{expandedWhispers.length !== 1 ? 's' : ''} on the {expandedDay}{expandedDay === 1 ? 'st' : expandedDay === 2 ? 'nd' : expandedDay === 3 ? 'rd' : 'th'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expandedWhispers.map(w => (
                <WhisperCard key={w.id} whisper={w} compact onClick={() => onWhisperClick(w)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
