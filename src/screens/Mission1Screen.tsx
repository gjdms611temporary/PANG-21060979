import { useEffect, useRef, useState } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, FLOOR_Y, PLAYER_WIDTH, SCORE_TABLE } from '../game/constants'
import { playerHitsBalloon, wireHitsBalloon } from '../game/collision'
import { createBalloon, splitBalloon, updateBalloon, type Balloon } from '../game/entities/balloon'
import { createPlayer, updatePlayer, type Player } from '../game/entities/player'
import { createWire, updateWire, type Wire } from '../game/entities/wire'
import { drawBalloon } from '../game/render/drawBalloon'
import { drawPlayer } from '../game/render/drawPlayer'
import { drawWire } from '../game/render/drawWire'
import { useJustPressed, useKeyboardState } from '../game/input'
import { useGameLoop } from '../game/loop'
import ClearScreen from './ClearScreen'
import GameOverScreen from './GameOverScreen'
import './Mission1Screen.css'

type GameStatus = 'playing' | 'dead' | 'clear' | 'gameover'

type GameState = {
  player: Player
  wire: Wire | null
  balloons: Balloon[]
  score: number
}

const STARTING_LIVES = 1
const DEAD_RESET_DELAY_MS = 1000

function createInitialBalloons(): Balloon[] {
  return [
    createBalloon(CANVAS_WIDTH * 0.25, 80, 'large', 'right'),
    createBalloon(CANVAS_WIDTH * 0.75, 80, 'large', 'left'),
  ]
}

function createInitialGameState(): GameState {
  return {
    player: createPlayer(),
    wire: null,
    balloons: createInitialBalloons(),
    score: 0,
  }
}

type Mission1ScreenProps = {
  onExitToMain: () => void
}

function Mission1Screen({ onExitToMain }: Mission1ScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameStateRef = useRef<GameState>(createInitialGameState())
  const keys = useKeyboardState()
  const consumeSpace = useJustPressed(' ')
  const [status, setStatus] = useState<GameStatus>('playing')
  const [lives, setLives] = useState(STARTING_LIVES)

  useEffect(() => {
    if (status !== 'dead') return
    const timer = setTimeout(() => {
      gameStateRef.current = createInitialGameState()
      setStatus('playing')
    }, DEAD_RESET_DELAY_MS)
    return () => clearTimeout(timer)
  }, [status])

  function handleRestart() {
    gameStateRef.current = createInitialGameState()
    setLives(STARTING_LIVES)
    setStatus('playing')
  }

  useGameLoop((dt) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const state = gameStateRef.current

    if (status === 'playing') {
      updatePlayer(state.player, keys, dt)

      if (consumeSpace() && state.wire === null) {
        state.wire = createWire(state.player.x + PLAYER_WIDTH / 2, FLOOR_Y)
      }

      if (state.wire) {
        updateWire(state.wire, dt)
        if (!state.wire.active) {
          state.wire = null
        }
      }

      for (const balloon of state.balloons) {
        updateBalloon(balloon, dt)
      }

      const wire = state.wire
      if (wire) {
        const hitIndex = state.balloons.findIndex((b) => wireHitsBalloon(wire, b))
        if (hitIndex !== -1) {
          const hitBalloon = state.balloons[hitIndex]
          state.score += SCORE_TABLE[hitBalloon.size]
          console.log('score:', state.score)
          const children = splitBalloon(hitBalloon)
          state.balloons.splice(hitIndex, 1, ...children)
          state.wire = null
        }
      }

      if (state.balloons.some((b) => playerHitsBalloon(state.player, b))) {
        const remaining = lives - 1
        setLives(remaining)
        setStatus(remaining <= 0 ? 'gameover' : 'dead')
      } else if (state.balloons.length === 0) {
        setStatus('clear')
      }
    }

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    drawPlayer(ctx, state.player)
    if (state.wire) {
      drawWire(ctx, state.wire)
    }
    for (const balloon of state.balloons) {
      drawBalloon(ctx, balloon)
    }

    if (status === 'dead') {
      ctx.fillStyle = '#08060d'
      ctx.font = 'bold 48px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('사망!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2)
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
      {status === 'clear' && <ClearScreen onExitToMain={onExitToMain} />}
      {status === 'gameover' && (
        <GameOverScreen onRestart={handleRestart} onExitToMain={onExitToMain} />
      )}
    </div>
  )
}

export default Mission1Screen
