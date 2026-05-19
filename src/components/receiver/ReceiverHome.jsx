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

  const {
    whispers: rawWhispers, setWhispers,
    incomingWhisper, setIncomingWhisper, clearIncomingWhisper,
    unreadCount, setUnreadCount, incrementUnread, addWhisper
  } = useStore()

  const whispers = Array.isArray(rawWhispers) ? rawWhispers : []

  useEffect(() => { loadWhispers() }, [])

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

  async function markRead(w) {
    if (w.is_read) return
    await supabase.from('whispers').update({ is_read: true }).eq('id', w.id)
    setWhispers(whispers.map(x => x.id === w.id ? { ...x, is_read: true } : x))
    setUnreadCount(n => Math.max(0, n - 1))
  }

  async function openWhisper(w) {
    setSelectedWhisper(w)
    clearIncomingWhisper()
    await markRead(w)
  }

  async function openEnvelope() {
    const unread = whispers.filter(w => !w.is_read)
    for (const w of unread) {
      await supabase.from('whispers').update({ is_read: true }).eq('id', w.id)
    }
    setWhispers(whispers.map(x => ({ ...x, is_read: true })))
    setUnreadCount(0)
    if (unread[0]) setSelectedWhisper(unread[0])
  }

  const unread = whispers.filter(w => !w.is_read)
  const read = whispers.filter(w => w.is_read)

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      <AnimatedBackground />

      <AnimatePresence>
        {incomingWhisper && (
          <WhisperNotification
            whisper={incomingWhisper}
            onOpen={() => openWhisper(incomingWhisper)}
            onDismiss={clearIncomingWhisper}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedWhisper && (
          <WhisperDetail
            whisper={selectedWhisper}
            onClose={() => setSelectedWhisper(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tab === 'latest' && unread.length > 0 && (
          <motion.div
            key="envelope"
            className="envelope-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(44,44,44,0.25)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '24px',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textAlign: 'center', letterSpacing: '0.05em' }}>
                ✦ {unread.length} new whisper{unread.length !== 1 ? 's' : ''} from Aankit
              </p>

              <div
                className="card"
                style={{
                  padding: '36px 28px',
                  background: 'linear-gradient(135deg, rgba(250,246,240,0.97), rgba(242,235,224,0.97))',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
                onClick={openEnvelope}
              >
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, var(--blush), var(--gold-light))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 8px 32px rgba(201,168,76,0.25)',
                  }}
                >
                  ✉
                </motion.div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '8px' }}>
                  Aankit thought of you
                </h2>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.45)', marginBottom: '24px' }}>
                  {unread.length > 1 ? `he sent you ${unread.length} whispers` : 'he sent you a whisper'}
                </p>

                <div className="btn-primary" style={{ pointerEvents: 'none' }}>
                  open ✦
                </div>
              </div>

              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '16px' }}>
                tap the card to open
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', padding: '32px 20px 80px', position: 'relative', zIndex: 1 }}>

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
            {unreadCount > 0 && tab === 'calendar' && (
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
          style={{ borderBottom: '1px solid rgba(232,196,184,0.3)' }}
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
              ) : read.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '16px', color: 'rgba(44,44,44,0.25)' }}>
                    open his whispers above ✦
                  </p>
                </div>
              ) : (
                <>
                  <div className="ornament-divider" style={{ marginBottom: '16px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>all whispers</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {read.map((w, i) => (
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