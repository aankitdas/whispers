import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
function ImageExpand({ url, onExpandChange }) {
  const [expanded, setExpanded] = useState(false)
  function toggle() {
    const next = !expanded
    setExpanded(next)
    onExpandChange(next)
  }
  return (
    <motion.div
      style={{ marginBottom: '16px', position: 'relative' }}
      animate={{ marginBottom: expanded ? '24px' : '16px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={toggle}
      >
        <motion.img
          src={url}
          alt="from Aankit"
          style={{ width: '100%', objectFit: 'cover', display: 'block' }}
          animate={{ maxHeight: expanded ? '420px' : '220px' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Expand/collapse hint */}
        <AnimatePresence>
          {!expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', bottom: '10px', right: '10px',
                background: 'rgba(44,44,44,0.4)',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '11px',
                color: 'white',
                fontFamily: 'var(--font-body)',
                pointerEvents: 'none',
              }}
            >
              tap to expand
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close hint when expanded */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute', top: '10px', right: '10px',
                background: 'rgba(44,44,44,0.4)',
                borderRadius: '50%',
                width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', color: 'white',
                pointerEvents: 'none',
              }}
            >
              ×
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
export default function WhisperDetail({ whisper, onClose }) {
  const isPreset = whisper?.mood && MOOD_META[whisper.mood]
  const customParts = !isPreset && whisper?.mood
    ? whisper.mood.split(' ')
    : null
  const mood = isPreset
    ? MOOD_META[whisper.mood]
    : { emoji: customParts?.[0] || '✦', color: 'rgba(232,196,184,0.2)' }
  const customMoodLabel = customParts
    ? customParts.slice(1).join(' ')
    : null
  const [imageExpanded, setImageExpanded] = useState(false)

  useEffect(() => {
    if (whisper && !whisper.is_read) {
      supabase.from('whispers').update({ is_read: true }).eq('id', whisper.id)
    }
  }, [whisper])
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
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
        overflowY: 'hidden',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: '400px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="card" style={{
          background: `radial-gradient(ellipse at top, ${mood.color} 0%, white 60%)`,
          position: 'relative',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            padding: '36px 28px',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            flex: 1,
          }}>

            {/* Decorative top line */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '40px', height: '3px', borderRadius: '3px',
              background: 'linear-gradient(90deg, var(--blush), var(--gold))',
            }} />
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '20px', color: 'rgba(44,44,44,0.3)', lineHeight: 1,
                padding: '4px',
              }}
            >
              ×
            </button>
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
            {/* Image — outside fade wrapper so it doesn't blur */}
            {whisper.image_url && (
              <ImageExpand url={whisper.image_url} onExpandChange={setImageExpanded} />
            )}

            <motion.div
              animate={{ opacity: imageExpanded ? 0.12 : 1 }}
              transition={{ duration: 0.35 }}
            >
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
            </motion.div>{/* closes imageExpanded fade wrapper */}

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

          </div>{/* closes inner scroll div */}
        </div>{/* closes card */}
      </motion.div>
    </motion.div>
  )
}
