import { useEffect, useRef } from 'react'

const MAX_DT = 1 / 30 // cap so tab-switch/background pauses don't cause huge physics steps

export function useGameLoop(onFrame: (dt: number) => void): void {
  const onFrameRef = useRef(onFrame)
  onFrameRef.current = onFrame

  useEffect(() => {
    let frameId: number
    let lastTime = performance.now()

    function tick(time: number) {
      const dt = Math.min((time - lastTime) / 1000, MAX_DT)
      lastTime = time
      onFrameRef.current(dt)
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])
}
