'use client'

import { useEffect, useRef } from 'react'
import { CONFETTI_EVENT } from '@/lib/confetti'
import { invitation } from '@/lib/invitation-config'

type Piece = {
  x: number
  y: number
  w: number
  h: number
  color: string
  shape: 'rect' | 'circle' | 'ribbon'
  vy: number
  vx: number
  rot: number
  vr: number
  sway: number
  expired?: boolean
}

const SHAPES: Piece['shape'][] = ['rect', 'circle', 'ribbon']

export function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let pieces: Piece[] = []
    let running = false
    let expireTimer: ReturnType<typeof setTimeout> | undefined
    const colors = invitation.confettiColors

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const makePiece = (): Piece => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.4,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      vy: 2 + Math.random() * 3.5,
      vx: -1.2 + Math.random() * 2.4,
      rot: Math.random() * Math.PI * 2,
      vr: -0.12 + Math.random() * 0.24,
      sway: Math.random() * Math.PI * 2,
    })

    const frame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      for (const p of pieces) {
        p.sway += 0.05
        p.x += p.vx + Math.sin(p.sway) * 0.8
        p.y += p.vy
        p.rot += p.vr
        if (p.y < canvas.height + 30) {
          alive = true
        } else if (!p.expired) {
          Object.assign(p, makePiece(), { y: -20 })
          alive = true
        }
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'ribbon') {
          ctx.fillRect(-p.w / 4, -p.h, p.w / 2, p.h * 2)
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        }
        ctx.restore()
      }
      if (alive) {
        requestAnimationFrame(frame)
      } else {
        running = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    const launch = () => {
      pieces = Array.from({ length: 160 }, makePiece)
      if (!running) {
        running = true
        requestAnimationFrame(frame)
      }
      clearTimeout(expireTimer)
      expireTimer = setTimeout(() => pieces.forEach((p) => (p.expired = true)), 4500)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener(CONFETTI_EVENT, launch)
    return () => {
      clearTimeout(expireTimer)
      window.removeEventListener('resize', resize)
      window.removeEventListener(CONFETTI_EVENT, launch)
    }
  }, [])

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />
}
