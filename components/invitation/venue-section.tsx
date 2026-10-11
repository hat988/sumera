import { invitation } from '@/lib/invitation-config'
import { Ornament } from './ornament'

export function VenueSection() {
  const query = encodeURIComponent(invitation.mapQuery)

  return (
    <section className="section">
      <h2 className="reveal section-title">The Venue</h2>
      <p className="reveal venue-name">{invitation.venueName}</p>
      <Ornament />
      <div className="map-frame reveal-scale">
        <iframe
          title="Venue location on Google Maps"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        className="accent-button reveal"
        href={`https://maps.google.com/?q=${query}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        See On Google Maps
      </a>
    </section>
  )
}
