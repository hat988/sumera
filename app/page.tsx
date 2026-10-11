import { ClosingSection } from '@/components/invitation/closing-section'
import { CountdownSection } from '@/components/invitation/countdown-section'
import { HeroSection } from '@/components/invitation/hero-section'
import { InvitationExperience } from '@/components/invitation/invitation-experience'
import { NoteSection } from '@/components/invitation/note-section'
import { ScheduleSection } from '@/components/invitation/schedule-section'
import { ScratchSection } from '@/components/invitation/scratch-section'
import { VenueSection } from '@/components/invitation/venue-section'

export default function Page() {
  return (
    <InvitationExperience>
      <HeroSection />
      <NoteSection />
      <CountdownSection />
      <ScheduleSection />
      <ScratchSection />
      <VenueSection />
      <ClosingSection />
    </InvitationExperience>
  )
}
