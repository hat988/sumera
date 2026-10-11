import { invitation } from '@/lib/invitation-config'
import { Ornament } from './ornament'

export function HeroSection() {
  return (
    <section className="section hero">
      <p className="reveal opening-line">{invitation.openingLine}</p>
      <Ornament />
      <p className="reveal small-caps">{invitation.eventLabel}</p>

      <h1 className="reveal names-script">{invitation.groom}</h1>
      <p className="reveal parents-line">
        Son of <b>{invitation.groomParents}</b>
      </p>
      <p className="reveal amp" aria-hidden="true">
        &amp;
      </p>
      <h1 className="reveal names-script">{invitation.bride}</h1>
      <p className="reveal parents-line">
        Daughter of <b>{invitation.brideParents}</b>
      </p>

      <Ornament />
      <p className="reveal small-caps">{invitation.familiesLine}</p>

      <div className="scroll-hint" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}
