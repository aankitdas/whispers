import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'
import WhisperCard from '../shared/WhisperCard'
import ComposeWhisper from './ComposeWhisper'
import AnimatedBackground from '../shared/AnimatedBackground'

function computeStreak(whispers) {
  if (!whispers.length) return 0
  const days = [...new Set(whispers.map(w =>
    new Date(w.sent_at || w.created_at).toDateString()
  ))].sort((a, b) => new Date(b) - new Date(a))

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (days[0] !== today && days[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1])
    const curr = new Date(days[i])
    const diff = (prev - curr) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

function groupByDate(whispers) {
  const groups = {}
  whispers.forEach(w => {
    const d = new Date(w.sent_at || w.created_at).toDateString()
    if (!groups[d]) groups[d] = []
    groups[d].push(w)
  })
  return groups
}

function friendlyDate(dateStr) {
  const d = new Date(dateStr)
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (d.toDateString() === today) return 'Today'
  if (d.toDateString() === yesterday) return 'Yesterday'
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function SenderHome() {
  const [composing, setComposing] = useState(false)
  const [loading, setLoading] = useState(true)
  const { whispers, setWhispers, streak, setStreak, addWhisper } = useStore()

  useEffect(() => {
    loadWhispers()
  }, [])

  async function loadWhispers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('whispers')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(100)

    if (!error && data) {
      setWhispers(data)
      setStreak(computeStreak(data))
    }
    setLoading(false)
  }

  function handleSent() {
    loadWhispers()
  }

  const todayStr = new Date().toDateString()
  const todayWhispers = whispers.filter(w =>
    new Date(w.sent_at || w.created_at).toDateString() === todayStr
  )
  const grouped = groupByDate(whispers)

  if (composing) {
    return (
      <AnimatePresence>
        <ComposeWhisper onClose={() => setComposing(false)} onSent={handleSent} />
      </AnimatePresence>
    )
  }

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      <AnimatedBackground />

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '40px 20px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '32px' }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--sage-deep)', textTransform: 'uppercase', marginBottom: '4px' }}>
            ✦ your heart
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 300, color: 'var(--charcoal)' }}>
            Whispers
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.4)', marginTop: '2px' }}>
            for Jennifer Lane
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center flex-wrap gap-3"
          style={{ marginBottom: '24px' }}
        >
          {streak > 0 && (
            <div className="streak-badge">
              <span>🔥</span>
              <span>{streak} day{streak !== 1 ? 's' : ''} in a row</span>
            </div>
          )}
          <div className="streak-badge">
            <span>✦</span>
            <span>{todayWhispers.length} today</span>
          </div>
          <div className="streak-badge">
            <span>📖</span>
            <span>{whispers.length} total</span>
          </div>
        </motion.div>

        {/* Compose CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{ padding: '28px 24px', marginBottom: '32px', cursor: 'pointer', border: '1px solid rgba(232,196,184,0.4)' }}
          onClick={() => setComposing(true)}
          whileHover={{ y: -3, boxShadow: 'var(--shadow-float)' }}
          whileTap={{ scale: 0.98 }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.12em', color: 'rgba(44,44,44,0.3)', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            ✦ &nbsp; Are you thinking of her right now? &nbsp; ✦
          </p>
          <div className="btn-primary" style={{ pointerEvents: 'none' }}>
            <span>Send a Whisper</span>
            <span style={{ fontSize: '16px' }}>✦</span>
          </div>
        </motion.div>

        {/* History */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'rgba(44,44,44,0.3)', fontSize: '16px' }}>
            Loading your whispers…
          </div>
        ) : whispers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ textAlign: 'center', padding: '40px 20px' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'rgba(44,44,44,0.35)', marginBottom: '8px' }}>
              Your first whisper awaits
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.25)' }}>
              Every thought you capture becomes proof of your love
            </p>
          </motion.div>
        ) : (
          <div>
            <div className="ornament-divider" style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>your history</span>
            </div>
            {Object.entries(grouped).map(([dateStr, dayWhispers], gi) => (
              <motion.div
                key={dateStr}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.06, duration: 0.4 }}
                style={{ marginBottom: '24px' }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.4)', marginBottom: '10px' }}>
                  {friendlyDate(dateStr)} · {dayWhispers.length} whisper{dayWhispers.length !== 1 ? 's' : ''}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dayWhispers.map(w => (
                    <WhisperCard key={w.id} whisper={w} compact />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
