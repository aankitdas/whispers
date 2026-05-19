import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useEffect } from 'react'

const MOOD_META = {
  tender: { emoji: '🌸', color: 'rgba(232,196,184,0.3)' },
  playful: { emoji: '✨', color: 'rgba(232,213,163,0.3)' },
  'missing you': { emoji: '🌙', color: 'rgba(168,181,160,0.3)' },
  grateful: { emoji: '🌼', color: 'rgba(232,213,163,0.25)' },
  proud: { emoji: '🌿', color: 'rgba(168,181,160,0.25)' },
  'in awe': { emoji: '🌊', color: 'rgba(168,181,160,0.2)' },
  silly: { emoji: '🦋', color: 'rgba(232,213,163,0.2)' },
  lucky: { emoji: '🍀', color: 'rgba(168,181,160,0.2)' },
}

function formatFull(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) +
    ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function WhisperDetail({ whisper, onClose }) {
  const isPreset = whisper?.mood && MOOD_META[whisper.mood]
  const mood = isPreset
    ? MOOD_META[whisper.mood]
    : { emoji: [...(whisper?.mood || '')][0] || '✦', color: 'rgba(232,196,184,0.2)' }
  const customMoodLabel = !isPreset && whisper?.mood
    ? (whisper.mood.match(/\s(.+)/) || [])[1] || whisper.mood
    : null

  useEffect(() => {
    if (whisper && !whisper.is_read) {
      supabase.from('whispers').update({ is_read: true }).eq('id', whisper.id)
    }
  }, [whisper])

  if (!whisper) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(44,44,44,0.3)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '400px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card" style={{
          padding: '36px 28px',
          background: `radial-gradient(ellipse at top, ${mood.color} 0%, white 60%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative top line */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '40px', height: '3px', borderRadius: '3px',
            background: 'linear-gradient(90deg, var(--blush), var(--gold))',
          }} />

          {/* From */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{ marginBottom: '24px' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--sage-deep)', textTransform: 'uppercase', marginBottom: '4px' }}>
              ✦ from Aankit
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.4)' }}>
              {formatFull(whisper.sent_at || whisper.created_at)}
              {whisper.location_name && ` · ${whisper.location_name}`}
            </p>
          </motion.div>

          {/* Mood */}
          {whisper.mood && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ fontSize: '22px' }}>{mood.emoji}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'var(--sage-deep)' }}>
                {customMoodLabel
                  ? `he's feeling ${customMoodLabel}`
                  : whisper.mood === 'missing you' ? "he's missing you"
                    : whisper.mood === 'in awe' ? "he's in awe of you"
                      : `he's feeling ${whisper.mood}`}
              </span>
            </motion.div>
          )}

          {/* Trigger */}
          {whisper.trigger && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(44,44,44,0.5)', marginBottom: '12px', lineHeight: 1.5 }}
            >
              "{whisper.trigger}"
            </motion.p>
          )}
          {/* Image */}
          {whisper.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.28 }}
              style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}
            >
              <img
                src={whisper.image_url}
                alt="from Aankit"
                style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          )}
          {/* Message — the heart */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1.65, marginBottom: '28px' }}
          >
            {whisper.message}
          </motion.p>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="ornament-divider"
            style={{ marginBottom: '20px' }}
          >
            ✦
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.4)', textAlign: 'center' }}
          >
            with love, Aankit
          </motion.p>

          {/* Close */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={onClose}
            className="btn-ghost"
            style={{ width: '100%', marginTop: '24px' }}
          >
            close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
