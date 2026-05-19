export default function AnimatedBackground() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${10 + Math.random() * 12}s`,
    delay: `${Math.random() * 10}s`,
    drift: `${(Math.random() - 0.5) * 60}px`,
    drift2: `${(Math.random() - 0.5) * 40}px`,
  }))

  return (
    <div className="particles-container" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            '--duration': p.duration,
            '--delay': p.delay,
            '--drift': p.drift,
            '--drift2': p.drift2,
          }}
        />
      ))}
    </div>
  )
}
