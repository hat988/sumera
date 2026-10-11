'use client'

import { useEffect, useRef, useState } from 'react'
import { invitation } from '@/lib/invitation-config'
import { launchConfetti } from '@/lib/confetti'

const BRUSH_RADIUS = 38
const REVEAL_THRESHOLD = 0.18

export function ScratchSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = canvas?.parentElement
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!canvas || !wrap || !ctx) return

    let finished = false
    let scratching = false
    let moveCount = 0
    const [foilA, foilB] = invitation.confettiColors

    const paint = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (w === 0) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'

      const grad = ctx.createLinearGradient(0, 0, w, h)
      grad.addColorStop(0, foilA)
      grad.addColorStop(0.33, foilB)
      grad.addColorStop(0.66, foilA)
      grad.addColorStop(1, foilB)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.globalAlpha = 0.08
      ctx.fillStyle = '#ffffff'
      for (let i = -h; i < w; i += 14) ctx.fillRect(i, 0, 4, h)
      ctx.globalAlpha = 1

      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.font = '600 15px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('S C R A T C H   H E R E', w / 2, h / 2)
      ctx.globalCompositeOperation = 'destination-out'
    }

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const scale = wrap.clientWidth / r.width || 1
      return { x: (e.clientX - r.left) * scale, y: (e.clientY - r.top) * scale }
    }

    const scratchAt = (p: { x: number; y: number }) => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, BRUSH_RADIUS, 0, Math.PI * 2)
      ctx.fill()
    }

    const checkProgress = () => {
      if (finished) return
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let cleared = 0
      let sampled = 0
      for (let i = 3; i < data.length; i += 64) {
        sampled++
        if (data[i] === 0) cleared++
      }
      if (sampled > 0 && cleared / sampled > REVEAL_THRESHOLD) {
        finished = true
        setDone(true)
        launchConfetti()
      }
    }

    const onDown = (e: PointerEvent) => {
      if (finished) return
      scratching = true
      scratchAt(pos(e))
    }
    const onMove = (e: PointerEvent) => {
      if (!scratching || finished) return
      scratchAt(pos(e))
      if (++moveCount % 8 === 0) checkProgress()
    }
    const onUp = () => {
      if (!scratching) return
      scratching = false
      checkProgress()
    }
    const onResize = () => {
      if (!finished) paint()
    }

    paint()
    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', onResize)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section className="section">
      <p className="reveal one-line-names">
        {invitation.groom} <span className="amp-inline">&amp;</span> {invitation.bride}
      </p>
      <p className="reveal small-caps scratch-hint">Scratch below to reveal</p>
      <div className="scratch-wrap reveal-scale">
        <div className="scratch-reveal">
          <p className="save-date-script">Save the Date</p>
          <p className="save-date-date">{invitation.dateLabel}</p>
          <p className="save-date-time">{invitation.timeLabel}</p>
        </div>
        <canvas
          ref={canvasRef}
          className={`scratch-canvas${done ? ' done' : ''}`}
          aria-label="Scratch card, scratch to reveal the engagement date"
        />
        <div className={`scratch-shine${done ? ' done' : ''}`} aria-hidden="true" />
      </div>
    </section>
  )
}
