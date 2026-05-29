import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'

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
function FavouriteHeart({ whisper, onFavouriteChange }) {
  const [saved, setSaved] = useState(whisper?.is_favourite || false)
  useEffect(() => { setSaved(whisper?.is_favourite || false) }, [whisper?.id])

  useEffect(() => {
    if (fillRef.current) {
      fillRef.current.setAttribute('y', saved ? 0 : 48)
    }
  }, [saved])
  const [pressing, setPressing] = useState(false)
  const fillRef = useRef(null)
  const svgRef = useRef(null)
  const sparkRef = useRef(null)
  const rafRef = useRef(null)
  const wobbleRef = useRef(null)
  const sparkCanvasRef = useRef(null)
  const startTimeRef = useRef(null)
  const FILL_MS = 700

  function haptic(t) {
    if (!navigator.vibrate) return
    if (t === 'tick') navigator.vibrate(10)
    if (t === 'pulse') navigator.vibrate(18)
    if (t === 'success') navigator.vibrate([0, 40, 60, 90])
  }

  function startWobble() {
    let phase = 0, lastPulse = 0
    function loop() {
      phase += 0.35
      const progress = Math.min((Date.now() - startTimeRef.current) / FILL_MS, 1)
      const grow = 0.85 + progress * 0.40
      const wobX = 1 + Math.cos(phase * 0.7) * 0.03
      const wobY = 1 + Math.sin(phase) * 0.045
      if (svgRef.current) svgRef.current.style.transform = `scale(${grow * wobX}, ${grow * wobY})`
      if (phase - lastPulse > 6.3) { haptic('pulse'); lastPulse = phase }
      wobbleRef.current = requestAnimationFrame(loop)
    }
    loop()
  }

  function stopWobble() {
    cancelAnimationFrame(wobbleRef.current)
  }

  function onPressStart(e) {
    e.preventDefault()
    if (saved) { unSave(); return }
    haptic('tick')
    startTimeRef.current = Date.now()
    setPressing(true)
    startWobble()
    rafRef.current = requestAnimationFrame(fillLoop)
  }

  function fillLoop() {
    const p = Math.min((Date.now() - startTimeRef.current) / FILL_MS, 1)
    if (fillRef.current) fillRef.current.setAttribute('y', 48 - 52 * p)
    if (p < 1) rafRef.current = requestAnimationFrame(fillLoop)
    else complete()
  }

  function onPressEnd(e) {
    if (!startTimeRef.current || saved) return
    if (Date.now() - startTimeRef.current < FILL_MS - 40) cancel()
  }

  function cancel() {
    if (saved) return
    cancelAnimationFrame(rafRef.current)
    stopWobble()
    startTimeRef.current = null
    setPressing(false)
    const rect = fillRef.current
    if (!rect) return
    let y = parseFloat(rect.getAttribute('y') || 48)
    if (svgRef.current) { svgRef.current.style.transition = 'transform 0.3s ease-out'; svgRef.current.style.transform = 'scale(1)' }
    setTimeout(() => { if (svgRef.current) svgRef.current.style.transition = '' }, 320)
    function drain() {
      y += 4; rect.setAttribute('y', y)
      if (y < 48) requestAnimationFrame(drain)
      else rect.setAttribute('y', 48)
    }
    drain()
  }

  async function complete() {
    setSaved(true)
    setPressing(false)
    cancelAnimationFrame(rafRef.current)
    stopWobble()
    startTimeRef.current = null
    if (fillRef.current) fillRef.current.setAttribute('y', 0)
    haptic('success')
    const svg = svgRef.current
    if (svg) {
      svg.style.transition = 'transform 0.12s ease-out'
      svg.style.transform = 'scale(1.32)'
      setTimeout(() => { svg.style.transform = 'scale(1.15)' }, 130)
      setTimeout(() => { svg.style.transform = 'scale(1.22)'; svg.style.transition = '' }, 270)
    }
    launchSparkles()
    await supabase.from('whispers').update({ is_favourite: true }).eq('id', whisper.id)
    onFavouriteChange?.(whisper.id, true)
  }

  async function unSave() {
    setSaved(false)
    if (fillRef.current) fillRef.current.setAttribute('y', 48)
    if (svgRef.current) { svgRef.current.style.transition = 'transform 0.3s ease'; svgRef.current.style.transform = 'scale(1)'; setTimeout(() => { if (svgRef.current) svgRef.current.style.transition = '' }, 320) }
    await supabase.from('whispers').update({ is_favourite: false }).eq('id', whisper.id)
    onFavouriteChange?.(whisper.id, false)
  }

  function launchSparkles() {
    const canvas = sparkCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const cx = 100, cy = 100
    const colors = ['#E8C4B8', '#C9A84C', '#A8B5A0', '#F2D5CB', '#B8C8B0', '#C9A84C']
    const particles = []

    for (let i = 0; i < 4; i++) {
      const angle = Math.random() * Math.PI * 2, spd = 0.8 + Math.random() * 1.2
      particles.push({ type: 'petal', x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 1.1, alpha: 0.95, fade: 0.010 + Math.random() * 0.010, size: 3.5 + Math.random() * 3, rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.07, drift: (Math.random() - 0.5) * 0.03, color: colors[i % colors.length] })
    }
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2, spd = 0.6 + Math.random() * 1.3
      particles.push({ type: 'star6', x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - 0.9, alpha: 1, fade: 0.009 + Math.random() * 0.011, size: 2.5 + Math.random() * 2, rot: Math.random() * Math.PI / 3, rotV: (Math.random() - 0.5) * 0.05, drift: (Math.random() - 0.5) * 0.025, twinkle: Math.random() * Math.PI * 2, color: colors[i % colors.length] })
    }
    for (let i = 0; i < 3; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2, spd = 2.5 + Math.random() * 2
      particles.push({ type: 'streak', x: cx, y: cy, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, alpha: 0.85, fade: 0.022 + Math.random() * 0.018, len: 8 + Math.random() * 10, color: colors[i % colors.length] })
    }

    function drawPetal(p) {
      ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color
      ctx.beginPath(); ctx.moveTo(0, -p.size); ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.6, p.size * 0.6, 0, p.size * 0.8); ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.6, -p.size * 0.6, -p.size * 0.3, 0, -p.size); ctx.closePath(); ctx.fill(); ctx.restore()
    }
    function drawStar6(p) {
      ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha * (0.7 + 0.3 * Math.sin(p.twinkle))); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color
      const r = p.size, inner = r * 0.38, pts = 6
      ctx.beginPath()
      for (let i = 0; i < pts * 2; i++) { const a = (i / (pts * 2)) * Math.PI * 2 - Math.PI / 2, rad = i % 2 === 0 ? r : inner; i === 0 ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad) : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad) }
      ctx.closePath(); ctx.fill(); ctx.restore()
    }
    function drawStreak(p) {
      ctx.save(); ctx.globalAlpha = Math.max(0, p.alpha); ctx.strokeStyle = p.color; ctx.lineWidth = 1.2; ctx.lineCap = 'round'
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy), nx = p.vx / spd, ny = p.vy / spd
      ctx.beginPath(); ctx.moveTo(p.x - nx * p.len * 0.5, p.y - ny * p.len * 0.5); ctx.lineTo(p.x + nx * p.len * 0.5, p.y + ny * p.len * 0.5); ctx.stroke(); ctx.restore()
    }

    function tick() {
      ctx.clearRect(0, 0, 200, 200)
      let alive = false
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.022; if (p.drift) p.vx += p.drift * 0.1
        if (p.rot !== undefined) p.rot += p.rotV || 0
        if (p.twinkle !== undefined) p.twinkle += 0.18
        p.alpha -= p.fade
        if (p.alpha > 0) { alive = true; if (p.type === 'petal') drawPetal(p); else if (p.type === 'star6') drawStar6(p); else drawStreak(p) }
      })
      if (alive) sparkRef.current = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, 200, 200)
    }
    tick()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.55 }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', paddingTop: '8px', marginBottom: '8px' }}
    >
      <div
        style={{ position: 'relative', width: '80px', paddingBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', cursor: 'pointer', WebkitUserSelect: 'none', userSelect: 'none' }}
        onTouchStart={onPressStart} onTouchEnd={onPressEnd} onTouchCancel={cancel}
        onMouseDown={onPressStart} onMouseUp={onPressEnd} onMouseLeave={onPressEnd}
      >
        <canvas ref={sparkCanvasRef} width={200} height={200}
          style={{ position: 'absolute', bottom: '28px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', pointerEvents: 'none', zIndex: 10 }}
        />
        <svg ref={svgRef} viewBox="0 0 52 48" style={{ width: '56px', height: '56px', overflow: 'visible', position: 'relative', zIndex: 2, transformOrigin: 'center bottom', willChange: 'transform' }}>
          <defs>
            <clipPath id={`hclip-${whisper.id}`}>
              <path d="M26,44 C26,44 4,30 4,16 C4,9 9,4 15,4 C19,4 23,6 26,10 C29,6 33,4 37,4 C43,4 48,9 48,16 C48,30 26,44 26,44 Z" />
            </clipPath>
          </defs>
          <path d="M26,44 C26,44 4,30 4,16 C4,9 9,4 15,4 C19,4 23,6 26,10 C29,6 33,4 37,4 C43,4 48,9 48,16 C48,30 26,44 26,44 Z"
            fill="none" stroke={saved ? '#E8C4B8' : '#ddd0c4'} strokeWidth="1.5" />
          <rect ref={fillRef} x="0" y="48" width="52" height="52" fill="#E8C4B8" clipPath={`url(#hclip-${whisper.id})`} />
        </svg>
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '12px', color: saved ? '#E8C4B8' : '#c0b0a0', transition: 'color 0.4s', letterSpacing: '0.02em' }}>
        {saved ? 'saved to your garden ✦' : 'hold to save'}
      </span>
    </motion.div>
  )
}

export default function WhisperDetail({ whisper, onClose, onFavouriteChange, showFavourite = true }) {
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
            {showFavourite && (
              <FavouriteHeart
                whisper={whisper}
                onFavouriteChange={onFavouriteChange}
              />
            )}

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
