import { motion } from 'framer-motion'

export default function WhisperNotification({ whisper, onOpen, onDismiss }) {
  return (
    <div className="whisper-notification">
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="card-glass"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          cursor: 'pointer',
          boxShadow: '0 8px 40px rgba(201,168,76,0.18), 0 2px 12px rgba(44,44,44,0.08)',
          border: '1px solid rgba(201,168,76,0.25)',
        }}
        onClick={onOpen}
      >
        {/* Pulsing dot */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -6,
              borderRadius: '50%',
              background: 'rgba(201,168,76,0.25)',
            }}
          />
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--blush), var(--gold-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>
            ✦
          </div>
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--charcoal)', fontWeight: 500, lineHeight: 1.3 }}>
            Aankit thought of you
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.45)', marginTop: '2px' }}>
            tap to open his whisper ✦
          </p>
        </div>

        {/* Dismiss */}
        <button
          onClick={e => { e.stopPropagation(); onDismiss(); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'rgba(44,44,44,0.3)', flexShrink: 0, padding: '4px' }}
        >
          ×
        </button>
      </motion.div>
    </div>
  )
}
