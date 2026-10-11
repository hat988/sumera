export const CONFETTI_EVENT = 'invitation:confetti'

export function launchConfetti() {
  window.dispatchEvent(new Event(CONFETTI_EVENT))
}
