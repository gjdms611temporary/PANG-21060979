import { BALLOON_RADIUS, FLOOR_Y } from './constants'
import type { Balloon } from './entities/balloon'
import type { Wire } from './entities/wire'

export function wireHitsBalloon(wire: Wire, balloon: Balloon): boolean {
  const closestY = Math.max(wire.y, Math.min(balloon.y, FLOOR_Y))
  const dx = wire.x - balloon.x
  const dy = closestY - balloon.y
  const r = BALLOON_RADIUS[balloon.size]
  return dx * dx + dy * dy <= r * r
}
