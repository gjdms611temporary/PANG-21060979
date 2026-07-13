import { useEffect, useRef } from 'react'

export function useKeyboardState(): Set<string> {
  const keysRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      keysRef.current.add(event.key)
    }
    function handleKeyUp(event: KeyboardEvent) {
      keysRef.current.delete(event.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return keysRef.current
}

export function useJustPressed(key: string): () => boolean {
  const pendingRef = useRef(false)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === key && !event.repeat) {
        pendingRef.current = true
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [key])

  return () => {
    const value = pendingRef.current
    pendingRef.current = false
    return value
  }
}
