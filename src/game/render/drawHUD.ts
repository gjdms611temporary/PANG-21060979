import { CANVAS_WIDTH } from '../constants'

const LIFE_ICON_GAP = 4

export function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
  ctx.font = 'bold 20px sans-serif'

  ctx.fillStyle = '#08060d'
  ctx.textAlign = 'left'
  ctx.fillText(`SCORE ${score}`, 12, 28)

  ctx.fillStyle = '#e63950'
  ctx.textAlign = 'right'
  const heartWidth = ctx.measureText('♥').width
  let iconX = CANVAS_WIDTH - 12
  for (let i = 0; i < lives; i++) {
    ctx.fillText('♥', iconX, 28)
    iconX -= heartWidth + LIFE_ICON_GAP
  }
}
