import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import Mission1Placeholder from './screens/Mission1Placeholder'

type Screen = 'main' | 'mission1-placeholder'

function App() {
  const [screen, setScreen] = useState<Screen>('main')

  if (screen === 'mission1-placeholder') {
    return <Mission1Placeholder />
  }

  return <MainScreen onStart={() => setScreen('mission1-placeholder')} />
}

export default App
