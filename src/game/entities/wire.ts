import { WIRE_SPEED } from '../constants'

export type Wire = {
  x: number
  y: number
  active: boolean
}

export function createWire(x: number, y: number): Wire {
  return { x, y, active: true }
}

export function updateWire(wire: Wire, dt: number): void {
  wire.y -= WIRE_SPEED * dt
  if (wire.y <= 0) wire.active = false
}
