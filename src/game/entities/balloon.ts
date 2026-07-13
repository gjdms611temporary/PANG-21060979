import { BALLOON_RADIUS, FLOOR_Y, GRAVITY } from '../constants'

export type BalloonSize = 'large' | 'small'

export type Balloon = {
  x: number
  y: number
  vx: number
  vy: number
  size: BalloonSize
}

export function createBalloon(x: number, y: number, size: BalloonSize): Balloon {
  return { x, y, vx: 0, vy: 0, size }
}

export function updateBalloonVertical(balloon: Balloon, dt: number): void {
  balloon.vy += GRAVITY * dt
  balloon.y += balloon.vy * dt

  const floorY = FLOOR_Y - BALLOON_RADIUS[balloon.size]
  if (balloon.y >= floorY) {
    balloon.y = floorY
    balloon.vy = -balloon.vy
  }
}
