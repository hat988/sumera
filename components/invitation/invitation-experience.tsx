'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { invitation } from '@/lib/invitation-config'
import { AmbientBackground } from './ambient-background'
import { BrandFooter } from './brand-footer'
import { ConfettiCanvas } from './confetti-canvas'
import { IntroStage } from './intro-stage'
import { MusicToggle } from './music-toggle'

export function InvitationExperience({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [opened, setOpened] = useState(false)
  const [muted, setMuted] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('locked', !opened)
    return () => document.body.classList.remove('locked')
  }, [opened])

  useEffect(() => {
    const main = mainRef.current
    if (!main) return
    main.querySelectorAll('.section').forEach((section) => {
      section.querySelectorAll<HTMLElement>('.reveal, .reveal-scale').forEach((el, i) => {
        el.style.setProperty('--stagger', `${(i * 0.12).toFixed(2)}s`)
      })
    })
    const targets = main.querySelectorAll('.reveal, .reveal-scale')
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('in'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -4% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const tryPlayMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !invitation.backgroundMusicSrc) return
    if (!audio.paused) return
    audio
      .play()
      .then(() => setMuted(false))
      .catch(() => setMuted(true))
      .finally(() => setMusicStarted(true))
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) {
      setMuted((m) => !m)
      return
    }
    if (audio.paused) {
      if (audio.error || audio.readyState === 0) audio.load()
      audio
        .play()
        .then(() => setMuted(false))
        .catch(() => setMuted(true))
    } else {
      audio.pause()
      setMuted(true)
    }
  }, [])

  const openInvitation = useCallback(() => {
    tryPlayMusic()
    setTimeout(() => {
      window.scrollTo(0, 0)
      setOpened(true)
    }, 900)
  }, [tryPlayMusic])

  return (
    <>
      <IntroStage onBegin={tryPlayMusic} onOpen={openInvitation} />
      <AmbientBackground />
      <main ref={mainRef} className={`content${opened ? ' visible' : ''}`} aria-hidden={!opened}>
        {children}
      </main>
      <BrandFooter />
      <ConfettiCanvas />
      {invitation.backgroundMusicSrc && (
        <audio ref={audioRef} src={invitation.backgroundMusicSrc} loop preload="none" />
      )}
      <MusicToggle muted={muted} visible={musicStarted} onToggle={toggleMusic} />
    </>
  )
}
