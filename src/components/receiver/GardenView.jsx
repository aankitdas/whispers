import { motion } from 'framer-motion'
import WhisperCard from '../shared/WhisperCard'

export default function GardenView({ whispers, onWhisperClick }) {
    const favourites = whispers.filter(w => w.is_favourite)

    if (favourites.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '60px 20px' }}
            >
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>🌸</div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'rgba(44,44,44,0.35)', marginBottom: '8px' }}>
                    your garden is waiting
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '14px', color: 'rgba(44,44,44,0.25)' }}>
                    hold the heart on a whisper to save it here
                </p>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="ornament-divider" style={{ marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                    {favourites.length} saved {favourites.length === 1 ? 'whisper' : 'whispers'}
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {favourites.map((w, i) => (
                    <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.35 }}
                    >
                        <WhisperCard
                            whisper={w}
                            compact
                            onClick={() => onWhisperClick(w)}
                            style={{ border: '1px solid rgba(232,196,184,0.6)', boxShadow: '0 2px 12px rgba(232,196,184,0.15)' }}
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}