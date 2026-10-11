import { invitation } from '@/lib/invitation-config'
import { Ornament } from './ornament'

export function NoteSection() {
  return (
    <section className="section">
      <Ornament />
      <p className="reveal note-text">{invitation.inviteNote}</p>
      <Ornament />
    </section>
  )
}
