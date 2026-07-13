export function drawHUD(ctx: CanvasRenderingContext2D, score: number, lives: number): void {
  ctx.fillStyle = '#08060d'
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`SCORE ${score}`, 12, 28)
  ctx.fillText(`LIVES ${lives}`, 12, 52)
}
