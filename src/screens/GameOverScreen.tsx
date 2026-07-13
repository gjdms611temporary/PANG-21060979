import './GameOverScreen.css'

type GameOverScreenProps = {
  onRestart: () => void
}

function GameOverScreen({ onRestart }: GameOverScreenProps) {
  return (
    <div className="gameover-screen-overlay">
      <p className="gameover-screen-text">게임 오버</p>
      <button type="button" className="gameover-screen-button" onClick={onRestart}>
        다시 시작
      </button>
    </div>
  )
}

export default GameOverScreen
