import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#8fd3f4')
  gradient.addColorStop(1, '#e8f9ff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}
