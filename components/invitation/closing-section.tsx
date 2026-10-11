import { invitation } from '@/lib/invitation-config'
import { Ornament } from './ornament'

export function ClosingSection() {
  return (
    <section className="section closing-section">
      <Ornament />
      <p className="reveal note-text">{invitation.closingNote}</p>
      <p className="reveal closing-script">{invitation.closingScript}</p>
      <p className="reveal one-line-names closing-names">
        {invitation.groom} <span className="amp-inline">&amp;</span> {invitation.bride}
      </p>
      <Ornament />
    </section>
  )
}
