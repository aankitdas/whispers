import { useState, useRef } from 'react'

const MOODS = [
  { key: 'missing you', emoji: '🌙', label: 'missing you' },
  { key: 'tender', emoji: '🌸', label: 'tender' },
  { key: 'playful', emoji: '✨', label: 'playful' },
  { key: 'grateful', emoji: '🌼', label: 'grateful' },
  { key: 'proud', emoji: '🌿', label: 'proud' },
  { key: 'in awe', emoji: '🌊', label: 'in awe' },
  { key: 'silly', emoji: '🦋', label: 'silly' },
  { key: 'lucky', emoji: '🍀', label: 'lucky' },
]

const QUICK_EMOJIS = ['💛', '🌹', '🔥', '💫', '🎶', '☁️', '🫧', '🍂', '🌈', '🐚', '🕯️', '🫶']

export default function MoodSelector({ selected, onChange }) {
  const [adding, setAdding] = useState(false)
  const [customText, setCustomText] = useState('')
  const [customEmoji, setCustomEmoji] = useState('💛')
  const inputRef = useRef()

  const isPreset = MOODS.some(m => m.key === selected)
  const isCustom = selected && !isPreset

  function openAdder() {
    setAdding(true)
    setCustomText('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function confirmCustom() {
    if (!customText.trim()) onChange(null)
    setAdding(false)
  }

  function handleTextChange(e) {
    setCustomText(e.target.value)
    const text = e.target.value.trim()
    if (text) {
      onChange(`${customEmoji} ${text}`)
    } else {
      onChange(null)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') confirmCustom()
    if (e.key === 'Escape') { setAdding(false); onChange(null) }
  }

  return (
    <div>
      <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '10px' }}>
        the feeling behind it
      </label>

      <div className="flex flex-wrap gap-2">
        {/* Preset chips */}
        {MOODS.map(m => (
          <button
            key={m.key}
            type="button"
            className={`mood-tag ${selected === m.key ? 'selected' : ''}`}
            onClick={() => { onChange(selected === m.key ? null : m.key); setAdding(false) }}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}

        {/* Custom chip — shows after confirmed */}
        {isCustom && !adding && (
          <button
            type="button"
            className="mood-tag selected"
            onClick={() => { onChange(null); setAdding(false) }}
          >
            <span>{selected}</span>
            <span style={{ opacity: 0.5, fontSize: '11px' }}>×</span>
          </button>
        )}

        {/* + button */}
        {!adding && (
          <button
            type="button"
            className="mood-tag"
            onClick={openAdder}
            style={{ fontWeight: 500, letterSpacing: '0.05em' }}
          >
            +
          </button>
        )}
      </div>

      {/* Inline custom mood input */}
      {adding && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Emoji row */}
          <div className="flex flex-wrap gap-2">
            {QUICK_EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                onClick={() => {
                  setCustomEmoji(e)
                  if (customText.trim()) onChange(`${e} ${customText.trim()}`)
                }}
                style={{
                  fontSize: '20px', padding: '4px 6px', borderRadius: '8px', border: 'none',
                  background: customEmoji === e ? 'rgba(232,196,184,0.5)' : 'transparent',
                  cursor: 'pointer', transition: 'background 0.15s ease',
                  outline: customEmoji === e ? '1.5px solid var(--blush-deep)' : 'none',
                }}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Text + confirm row */}
          <div className="flex gap-2" style={{ alignItems: 'center' }}>
            <span style={{ fontSize: '18px' }}>{customEmoji}</span>
            <input
              ref={inputRef}
              type="text"
              className="input-field"
              data-gramm="false"
              data-gramm_editor="false"
              data-enable-grammarly="false"
              placeholder="describe the feeling…"
              value={customText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              maxLength={40}
              style={{ flex: 1, padding: '10px 14px', fontSize: '14px' }}
            />

            <button
              type="button"
              className="mood-tag"
              onClick={() => { setAdding(false) }}
              style={{ flexShrink: 0, padding: '10px 14px', opacity: 0.5 }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { MOODS }