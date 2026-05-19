import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { useStore } from '../../store/useStore'
import { useWhisperListener } from '../../lib/realtimeHook'
import AnimatedBackground from '../shared/AnimatedBackground'
import WhisperNotification from './WhisperNotification'
import WhisperDetail from './WhisperDetail'
import WhisperCalendar from './WhisperCalendar'
import WhisperCard from '../shared/WhisperCard'

const TABS = ['latest', 'calendar']

export default function ReceiverHome() {
  const [tab, setTab] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [selectedWhisper, setSelectedWhisper] = useState(null)

  const { whispers, setWhispers, incomingWhisper, setIncomingWhisper, clearIncomingWhisper, unreadCount, setUnreadCount, incrementUnread, addWhisper } = useStore()

  useEffect(() => {
    loadWhispers()
  }, [])

  async function loadWhispers() {
    setLoading(true)
    const { data, error } = await supabase
      .from('whispers')
      .select('*')
      .order('sent_at', { ascending: false })
      .limit(200)
    if (!error && data) {
      setWhispers(data)
      setUnreadCount(data.filter(w => !w.is_read).length)
    }
    setLoading(false)
  }

  const handleNewWhisper = useCallback((whisper) => {
    addWhisper(whisper)
    setIncomingWhisper(whisper)
    incrementUnread()
  }, [])

  useWhisperListener(handleNewWhisper)

  function openWhisper(w) {
    setSelectedWhisper(w)
    clearIncomingWhisper()
    if (!w.is_read) {
      setUnreadCount(n => Math.max(0, n - 1))
    }
  }

  const latestUnread = whispers.find(w => !w.is_read)
  const latestWhisper = whispers[0]

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      <AnimatedBackground />

      {/* Incoming whisper notification */}
      <AnimatePresence>
        {incomingWhisper && (
          <WhisperNotification
            whisper={incomingWhisper}
            onOpen={() => openWhisper(incomingWhisper)}
            onDismiss={clearIncomingWhisper}
          />
        )}
      </AnimatePresence>

      {/* Whisper detail overlay */}
      <AnimatePresence>
        {selectedWhisper && (
          <WhisperDetail
            whisper={selectedWhisper}
            onClose={() => setSelectedWhisper(null)}
          />
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '32px 20px 80px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '28px' }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--sage-deep)', textTransform: 'uppercase', marginBottom: '4px' }}>
            ✦ for Jen
          </div>
          <div className="flex items-end justify-between">
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 300, color: 'var(--charcoal)' }}>
                Whispers
              </h1>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.4)', marginTop: '2px' }}>
                from Aankit
              </p>
            </div>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="streak-badge"
                style={{ background: 'var(--blush)', borderColor: 'var(--blush-deep)' }}
              >
                <span>✉</span>
                <span>{unreadCount} new</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
          style={{ borderBottom: '1px solid rgba(232,196,184,0.3)', paddingBottom: '0' }}
        >
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 400,
                color: tab === t ? 'var(--charcoal)' : 'rgba(44,44,44,0.35)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 4px 12px',
                borderBottom: tab === t ? '2px solid var(--blush-deep)' : '2px solid transparent',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
                letterSpacing: '0.02em',
              }}
            >
              {t}
            </button>
          ))}
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {tab === 'latest' && (
            <motion.div
              key="latest"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'rgba(44,44,44,0.3)' }}>
                  Opening your whispers…
                </div>
              ) : whispers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'rgba(44,44,44,0.35)', marginBottom: '8px' }}>
                    Your whispers will appear here
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.25)' }}>
                    when he thinks of you, you'll know
                  </p>
                </div>
              ) : (
                <>
                  {/* Hero — latest whisper */}
                  {latestWhisper && (
                    <div style={{ marginBottom: '24px' }}>
                      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.4)', marginBottom: '12px' }}>
                        most recent
                      </p>
                      <WhisperCard whisper={latestWhisper} onClick={() => openWhisper(latestWhisper)} />
                    </div>
                  )}

                  {/* Rest */}
                  {whispers.length > 1 && (
                    <>
                      <div className="ornament-divider" style={{ marginBottom: '16px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>all whispers</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {whispers.slice(1).map((w, i) => (
                          <motion.div
                            key={w.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.35 }}
                          >
                            <WhisperCard whisper={w} compact onClick={() => openWhisper(w)} />
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}

          {tab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.3 }}
              style={{ margin: '0 -20px' }}
            >
              <WhisperCalendar whispers={whispers} onWhisperClick={openWhisper} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
