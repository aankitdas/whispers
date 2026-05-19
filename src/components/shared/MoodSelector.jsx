const MOODS = [
  { key: 'tender',      emoji: '🌸', label: 'tender' },
  { key: 'playful',     emoji: '✨', label: 'playful' },
  { key: 'missing you', emoji: '🌙', label: 'missing you' },
  { key: 'grateful',   emoji: '🌼', label: 'grateful' },
  { key: 'proud',      emoji: '🌿', label: 'proud' },
]

export default function MoodSelector({ selected, onChange }) {
  return (
    <div>
      <label style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(44,44,44,0.5)', display: 'block', marginBottom: '10px' }}>
        the feeling behind it
      </label>
      <div className="flex flex-wrap gap-2">
        {MOODS.map(m => (
          <button
            key={m.key}
            type="button"
            className={`mood-tag ${selected === m.key ? 'selected' : ''}`}
            onClick={() => onChange(selected === m.key ? null : m.key)}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { MOODS }
