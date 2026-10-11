import { invitation } from '@/lib/invitation-config'
import { Ornament } from './ornament'

export function ScheduleSection() {
  return (
    <section className="section">
      <h2 className="reveal section-title">{"The Day's Schedule"}</h2>
      <Ornament />
      <div className="schedule">
        {invitation.schedule.map((item) => (
          <div key={item.time + item.name} className="schedule-item reveal">
            <span className="schedule-time">{item.time}</span>
            <span className="schedule-dot" aria-hidden="true" />
            <span className="schedule-name">{item.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
