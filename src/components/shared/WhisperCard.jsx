import { motion } from 'framer-motion'

const MOOD_META = {
  tender:     { emoji: '🌸', label: 'tender' },
  playful:    { emoji: '✨', label: 'playful' },
  'missing you': { emoji: '🌙', label: 'missing you' },
  proud:      { emoji: '🌿', label: 'proud' },
  grateful:   { emoji: '🌼', label: 'grateful' },
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function WhisperCard({ whisper, onClick, compact = false }) {
  const mood = MOOD_META[whisper.mood] || { emoji: '✦', label: whisper.mood || '' }

  if (compact) {
    return (
      <motion.div
        className="card"
        style={{ padding: '16px 20px', cursor: onClick ? 'pointer' : 'default' }}
        onClick={onClick}
        whileHover={onClick ? { y: -2, boxShadow: 'var(--shadow-float)' } : {}}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-3">
          <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{mood.emoji}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--charcoal)', lineHeight: 1.5 }}
              className="truncate-2">
              {whisper.message}
            </p>
            {whisper.trigger && (
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: 'rgba(44,44,44,0.45)', marginTop: '4px' }}>
                {whisper.trigger}
              </p>
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'rgba(44,44,44,0.35)', fontFamily: 'var(--font-body)', flexShrink: 0 }}>
            {formatTime(whisper.sent_at || whisper.created_at)}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="card"
      style={{ padding: '28px 24px', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={onClick ? { y: -3, boxShadow: 'var(--shadow-float)' } : {}}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '20px' }}>{mood.emoji}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'var(--sage-deep)' }}>
            {mood.label}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'rgba(44,44,44,0.4)', fontFamily: 'var(--font-body)' }}>
            {formatTime(whisper.sent_at || whisper.created_at)}
          </div>
          {whisper.location_name && (
            <div style={{ fontSize: '11px', color: 'rgba(44,44,44,0.3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              {whisper.location_name}
            </div>
          )}
        </div>
      </div>

      {/* Trigger */}
      {whisper.trigger && (
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.5)', marginBottom: '10px', lineHeight: 1.5 }}>
          "{whisper.trigger}"
        </p>
      )}

      {/* Message */}
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', color: 'var(--charcoal)', lineHeight: 1.6, fontWeight: 300 }}>
        {whisper.message}
      </p>
    </motion.div>
  )
}
