'use client'

import { Fragment, useEffect, useState } from 'react'
import { invitation } from '@/lib/invitation-config'

const LABELS = ['Days', 'Hours', 'Minutes', 'Seconds'] as const

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function timeLeft(target: number) {
  const secs = Math.floor(Math.max(0, target - Date.now()) / 1000)
  return [
    pad(Math.floor(secs / 86400)),
    pad(Math.floor((secs % 86400) / 3600)),
    pad(Math.floor((secs % 3600) / 60)),
    pad(secs % 60),
  ]
}

export function CountdownSection() {
  const [values, setValues] = useState<string[]>(['00', '00', '00', '00'])

  useEffect(() => {
    const target = new Date(invitation.eventDateISO).getTime()
    const tick = () => setValues(timeLeft(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="section">
      <p className="reveal small-caps">Counting Down To Forever</p>
      <div className="countdown reveal" role="timer" aria-label="Countdown to the engagement">
        {LABELS.map((label, i) => (
          <Fragment key={label}>
            {i > 0 && (
              <div className="count-sep" aria-hidden="true">
                :
              </div>
            )}
            <div className="count-box">
              <span className="count-num">{values[i]}</span>
              <span className="count-label">{label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  )
}
