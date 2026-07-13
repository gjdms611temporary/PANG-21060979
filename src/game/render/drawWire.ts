import type { Wire } from '../entities/wire'

export function drawWire(ctx: CanvasRenderingContext2D, wire: Wire): void {
  ctx.strokeStyle = '#08060d'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(wire.x, wire.y)
  ctx.lineTo(wire.x, wire.y + 12)
  ctx.stroke()
}
