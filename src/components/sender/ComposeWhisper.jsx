import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { supabase } from '../../lib/supabase'
import MoodSelector from '../shared/MoodSelector'

// Compress image using canvas before upload
async function compressImage(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        resolve(blob)
      }, 'image/jpeg', quality)
    }
    img.src = url
  })
}

export default function ComposeWhisper({ onClose, onSent }) {
  const [trigger, setTrigger] = useState('')
  const [message, setMessage] = useState('')
  const [mood, setMood] = useState(null)
  const [location, setLocation] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const sendBtnRef = useRef()
  const lanternRef = useRef()
  const fileInputRef = useRef()

  function handleImagePick(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadImage() {
    if (!imageFile) return null
    const compressed = await compressImage(imageFile)
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    const { data, error } = await supabase.storage
      .from('whisper-images')
      .upload(filename, compressed, { contentType: 'image/jpeg' })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage
      .from('whisper-images')
      .getPublicUrl(filename)
    return publicUrl
  }

  async function handleSend() {
    if (!message.trim() || sending) return
    setSending(true)

    const lantern = lanternRef.current
    if (lantern) {
      gsap.fromTo(lantern,
        { opacity: 0, y: 0, scale: 0.5 },
        {
          opacity: 1, y: -120, scale: 1.2, duration: 1.2, ease: 'power2.out',
          onComplete: () => gsap.to(lantern, { opacity: 0, y: -200, duration: 0.5, ease: 'power2.in' })
        }
      )
    }

    try {
      const image_url = await uploadImage()

      const { error } = await supabase.from('whispers').insert([{
        trigger: trigger.trim() || null,
        message: message.trim(),
        mood: mood || null,
        location_name: location.trim() || null,
        image_url: image_url || null,
        sent_at: new Date().toISOString(),
      }])

      if (error) throw error

      await new Promise(r => setTimeout(r, 900))
      setSent(true)
      if (onSent) onSent()

      setTimeout(() => {
        setTrigger(''); setMessage(''); setMood(null); setLocation('')
        setImageFile(null); setImagePreview(null)
        setSent(false); setSending(false)
        if (onClose) onClose()
      }, 1800)

    } catch (err) {
      console.error(err)
      setSending(false)
      alert('Something went wrong. Check your connection.')
    }
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: '0' }}
    >
      <div style={{ padding: '24px 20px 40px', maxWidth: '480px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button className="btn-ghost" onClick={onClose} style={{ padding: '8px 14px', fontSize: '13px' }}>
            ← back
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.4)' }}>
            a whisper for Jen
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--charcoal)', marginBottom: '6px' }}
        >
          What are you feeling?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.4)', marginBottom: '32px' }}
        >
          She'll see exactly when and why you thought of her.
        </motion.p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Trigger */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '8px' }}>
              what made you think of her?
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="a flower, a song, a quiet moment…"
              value={trigger}
              onChange={e => setTrigger(e.target.value)}
              maxLength={120}
            />
          </motion.div>

          {/* Image attachment */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '8px' }}>
              attach a photo <span style={{ color: 'rgba(44,44,44,0.25)' }}>(optional)</span>
            </label>

            {imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block', borderRadius: '16px' }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute', top: '10px', right: '10px',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(44,44,44,0.6)', color: 'white',
                    border: 'none', cursor: 'pointer', fontSize: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1.5px dashed rgba(232,196,184,0.6)',
                  borderRadius: '16px',
                  padding: '28px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: 'rgba(250,246,240,0.5)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blush-deep)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(232,196,184,0.6)'}
              >
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🖼</div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.35)' }}>
                  tap to add a photo
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImagePick}
            />
          </motion.div>

          {/* Message */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '8px' }}>
              what do you want her to know? <span style={{ color: 'var(--blush-deep)' }}>*</span>
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="I was looking at the sky and thought how lucky I am…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={500}
            />
            <div style={{ textAlign: 'right', fontSize: '11px', color: 'rgba(44,44,44,0.25)', marginTop: '4px' }}>
              {message.length}/500
            </div>
          </motion.div>

          {/* Mood */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <MoodSelector selected={mood} onChange={setMood} />
          </motion.div>

          {/* Location */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '8px' }}>
              where are you? <span style={{ color: 'rgba(44,44,44,0.25)' }}>(optional)</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="coffee shop, the park, my desk…"
              value={location}
              onChange={e => setLocation(e.target.value)}
              maxLength={80}
            />
          </motion.div>

          {/* Send Button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ position: 'relative', marginTop: '8px' }}
          >
            <div
              ref={lanternRef}
              style={{
                position: 'absolute', left: '50%', top: '0',
                transform: 'translateX(-50%)',
                width: '40px', height: '40px',
                background: 'radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                opacity: 0,
              }}
            />

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="btn-primary"
                  style={{ background: 'var(--sage-deep)', cursor: 'default' }}
                >
                  <span>✦</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', textTransform: 'none', fontSize: '16px', letterSpacing: '0' }}>
                    Whisper sent to Jen
                  </span>
                </motion.div>
              ) : (
                <motion.button
                  key="send"
                  ref={sendBtnRef}
                  className="btn-primary"
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  whileTap={{ scale: 0.97 }}
                >
                  {sending ? (
                    <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', textTransform: 'none', fontSize: '16px', letterSpacing: 0 }}>
                      {imageFile ? 'uploading…' : 'sending…'}
                    </span>
                  ) : (
                    <>
                      <span>Send Whisper</span>
                      <span style={{ fontSize: '16px' }}>✦</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </motion.div>
  )
}