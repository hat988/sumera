'use client'

import { useEffect, useRef } from 'react'

export function BrandFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const linkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    const link = linkRef.current
    if (!footer || !link || !('IntersectionObserver' in window)) return

    // Observe the static footer, not the animating link, so the pop animation can't retrigger itself.
    let armed = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && armed) {
          armed = false
          link.classList.remove('attention')
          void link.offsetWidth
          link.classList.add('attention')
        } else if (!entry.isIntersecting) {
          armed = true
        }
      },
      { threshold: 0.6 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={footerRef} className="brand-footer">
      <a ref={linkRef} href="https://arfamoments.com/" target="_blank" rel="noopener noreferrer">
        Crafted on <b>Arfa Moments</b> · create yours free
      </a>
    </footer>
  )
}
