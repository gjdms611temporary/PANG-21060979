import { useRef } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_WIDTH } from '../game/constants'
import { createPlayer, updatePlayer, type Player } from '../game/entities/player'
import { createWire, updateWire, type Wire } from '../game/entities/wire'
import { drawPlayer } from '../game/render/drawPlayer'
import { drawWire } from '../game/render/drawWire'
import { useJustPressed, useKeyboardState } from '../game/input'
import { useGameLoop } from '../game/loop'
import './Mission1Screen.css'

type GameState = {
  player: Player
  wire: Wire | null
}

function Mission1Screen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameStateRef = useRef<GameState>({ player: createPlayer(), wire: null })
  const keys = useKeyboardState()
  const consumeSpace = useJustPressed(' ')

  useGameLoop((dt) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    updatePlayer(state.player, keys, dt)

    if (consumeSpace() && state.wire === null) {
      state.wire = createWire(state.player.x + PLAYER_WIDTH / 2, state.player.y)
    }

    if (state.wire) {
      updateWire(state.wire, dt)
      if (!state.wire.active) {
        state.wire = null
      }
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    drawPlayer(ctx, state.player)
    if (state.wire) {
      drawWire(ctx, state.wire)
    }
  })

  return (
    <div className="mission1-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="mission1-canvas"
      />
    </div>
  )
}

export default Mission1Screen
