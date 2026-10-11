type MusicToggleProps = {
  muted: boolean
  visible: boolean
  onToggle: () => void
}

export function MusicToggle({ muted, visible, onToggle }: MusicToggleProps) {
  return (
    <button
      type="button"
      className="music-toggle"
      aria-label="Toggle background music"
      aria-pressed={!muted}
      onClick={onToggle}
      hidden={!visible}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        {muted && <line x1="2" y1="2" x2="22" y2="22" />}
      </svg>
    </button>
  )
}
