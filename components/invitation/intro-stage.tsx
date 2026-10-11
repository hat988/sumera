'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { coupleNames, invitation } from '@/lib/invitation-config'

type Phase = 'loading' | 'tap' | 'playing' | 'ended' | 'gone'

type IntroStageProps = {
  onBegin: () => void
  onOpen: () => void
}

const hasFilm = Boolean(invitation.introVideoSrc)

export function IntroStage({ onBegin, onOpen }: IntroStageProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<Phase>(hasFilm ? 'loading' : 'tap')
  const [filmReady, setFilmReady] = useState(false)
  const [percent, setPercent] = useState('')
  const [removed, setRemoved] = useState(false)

  const markReady = () => {
    setFilmReady(true)
    setPercent('100%')
    setPhase((p) => (p === 'loading' ? 'tap' : p))
  }
  const skipFilm = () => setPhase((p) => (p === 'loading' ? 'tap' : p))

  useEffect(() => {
    if (!hasFilm) return
    if ((videoRef.current?.readyState ?? 0) >= 4) markReady()
    // Never keep the guest on the loading gate for more than 60s.
    const safety = setTimeout(skipFilm, 60000)
    return () => clearTimeout(safety)
  }, [])

  const handleProgress = () => {
    const v = videoRef.current
    if (!v || !v.duration || v.buffered.length === 0) return
    const loaded = v.buffered.end(v.buffered.length - 1) / v.duration
    setPercent(`${Math.min(99, Math.round(loaded * 100))}%`)
  }

  const begin = () => {
    if (phase !== 'tap') return
    onBegin()
    const v = videoRef.current
    if (!filmReady || !v) {
      setPhase('ended')
      return
    }
    setPhase('playing')
    v.play().catch(() => setPhase('ended'))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      begin()
    }
  }

  const enter = () => {
    setPhase('gone')
    onOpen()
    setTimeout(() => setRemoved(true), 1800)
  }

  if (removed) return null

  const stageClass = ['vid-stage', phase === 'ended' && 'ended', phase === 'gone' && 'gone'].filter(Boolean).join(' ')
  const tapClass = ['vid-tap', phase === 'loading' && 'waiting', phase !== 'tap' && phase !== 'loading' && 'gone']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={stageClass} aria-label="Cinematic invitation opening">
      {!hasFilm && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="vid-backdrop" src={invitation.introPoster || '/placeholder.svg'} alt="" aria-hidden="true" />
      )}

      {hasFilm ? (
        <video
          ref={videoRef}
          src={invitation.introVideoSrc}
          preload="auto"
          muted
          playsInline
          onProgress={handleProgress}
          onCanPlayThrough={markReady}
          onError={() => {
            skipFilm()
            if (phase === 'playing') setPhase('ended')
          }}
          onEnded={() => setPhase('ended')}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="vid-backdrop vid-finale-backdrop"
          src={invitation.finaleBackdrop || '/placeholder.svg'}
          alt=""
          aria-hidden="true"
        />
      )}

      <div className="vid-finale">
        <p className="vid-finale-line">{invitation.familiesLine}</p>
        <p className="vid-finale-names">{coupleNames}</p>
        <p className="vid-finale-date">{invitation.dateLabel}</p>
        <button type="button" className="vid-enter" onClick={enter} tabIndex={phase === 'ended' ? 0 : -1}>
          Open Invitation
        </button>
      </div>

      <div
        className={tapClass}
        role="button"
        tabIndex={phase === 'tap' ? 0 : -1}
        aria-label="Play the invitation film"
        onClick={begin}
        onKeyDown={handleKeyDown}
      >
        <div className="vid-tap-mono" aria-hidden="true">
          <span>{invitation.monogram}</span>
        </div>
        <p className="vid-tap-line">{invitation.openingLine}</p>
        <p className="vid-tap-names">{coupleNames}</p>
        <p className="vid-tap-hint">Tap to begin</p>
      </div>

      {hasFilm && (
        <div className={`vid-preload${phase === 'loading' ? '' : ' gone'}`}>
          <div className="vid-preload-ring" aria-hidden="true" />
          <p className="vid-preload-title">Please wait</p>
          <p className="vid-preload-text">Loading your film</p>
          <p className="vid-preload-pct" aria-live="polite">
            {percent}
          </p>
        </div>
      )}
    </div>
  )
}
