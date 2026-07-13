const LIFE_ICON_GAP = 4

export function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
  ctx.fillStyle = '#08060d'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`SCORE ${score}`, 12, 28)

  const scoreWidth = ctx.measureText(`SCORE ${score}`).width
  ctx.font = 'bold 20px sans-serif'
  ctx.fillStyle = '#e63950'
  let iconX = 12 + scoreWidth + 24
  for (let i = 0; i < lives; i++) {
    ctx.fillText('♥', iconX, 28)
    iconX += ctx.measureText('♥').width + LIFE_ICON_GAP
  }
}
