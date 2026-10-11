import type { CSSProperties } from 'react'

function seededRandom(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const random = seededRandom(1910)
const flecks = Array.from({ length: 15 }, () => {
  const size = 3 + random() * 5
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${random() * 100}%`,
    '--fx1': `${random() * 60 - 30}px`,
    '--fx2': `${random() * 60 - 30}px`,
    animationDuration: `${12 + random() * 14}s`,
    animationDelay: `${random() * 14}s`,
  } as CSSProperties
})

export function AmbientBackground() {
  return (
    <>
      <div className="fronds" aria-hidden="true">
        <div className="frond f1" />
        <div className="frond f2" />
        <div className="frond f3" />
      </div>
      <div className="sheen" aria-hidden="true" />
      <div className="flecks" aria-hidden="true">
        {flecks.map((style, i) => (
          <div key={i} className="flk" style={style} />
        ))}
      </div>
    </>
  )
}
