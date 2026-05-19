import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'

const SENDER_PIN = import.meta.env.VITE_SENDER_PIN || '1234'
const RECEIVER_PIN = import.meta.env.VITE_RECEIVER_PIN || '5678'

export default function PinScreen({ side, onSuccess }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const refs = [useRef(), useRef(), useRef(), useRef()]

  const isSender = side === 'sender'
  const correctPin = isSender ? SENDER_PIN : RECEIVER_PIN

  function handleChange(index, value) {
    if (!/^\d?$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    setError(false)
    if (value && index < 3) refs[index + 1].current?.focus()
    if (next.every(d => d !== '') && value) {
      checkPin(next.join(''))
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs[index - 1].current?.focus()
    }
  }

  function checkPin(pin) {
    if (pin === correctPin) {
      onSuccess()
    } else {
      setShaking(true)
      setError(true)
      setTimeout(() => {
        setDigits(['', '', '', ''])
        setShaking(false)
        refs[0].current?.focus()
      }, 600)
    }
  }

  return (
    <div className="page" style={{ background: 'var(--cream)' }}>
      <AnimatedBackground />
      <div className="pin-inner flex flex-col items-center justify-center min-h-screen px-8 relative z-10" style={{ width: '100%' }}>

        {/* Logo / wordmark */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', letterSpacing: '0.2em', color: 'var(--sage-deep)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ✦
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
            Whispers
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '15px', color: 'rgba(44,44,44,0.45)', marginTop: '8px' }}>
            {isSender ? 'your heart' : 'for Jen'}
          </p>
        </motion.div>

        {/* PIN form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="card text-center"
          style={{ padding: '40px 32px', width: '100%', maxWidth: '340px' }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--charcoal-soft)', marginBottom: '28px', fontWeight: 400 }}>
            Enter your PIN to enter
          </p>

          <motion.div
            className="flex justify-center gap-3 mb-4"
            animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={refs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="pin-digit"
                autoFocus={i === 0}
                style={error ? { borderColor: '#E07070' } : {}}
              />
            ))}
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ fontSize: '13px', color: '#C05050', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
            >
              That's not quite right
            </motion.p>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '32px', fontSize: '12px', color: 'rgba(44,44,44,0.3)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}
        >
          {isSender ? 'your private space' : 'a space made just for you'}
        </motion.p>
      </div>
    </div>
  )
}
