import { useState } from 'react'
import MenuList from '../components/MenuList'
import NoticeModal from '../components/NoticeModal'
import ConfirmModal from '../components/ConfirmModal'
import { MENU_ITEMS } from '../constants/menu'
import './MainScreen.css'

type MainScreenProps = {
  onStart: () => void
}

function MainScreen({ onStart }: MainScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  function handleChoose(index: number) {
    const item = MENU_ITEMS[index]
    if (item.id === 'start') {
      onStart()
    } else if (item.id === 'howToPlay') {
      setNotice('조작 방법 화면은 준비 중입니다')
    } else if (item.id === 'options') {
      setNotice('설정 화면은 준비 중입니다')
    } else if (item.id === 'exit') {
      setShowExitConfirm(true)
    }
  }

  function handleExitConfirm() {
    window.close()
    setShowExitConfirm(false)
    setNotice('이 창은 직접 닫아주세요')
  }

  return (
    <div className="main-screen">
      <h1 className="main-title">PANG</h1>
      <MenuList
        items={MENU_ITEMS}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        onChoose={handleChoose}
        disabled={notice !== null || showExitConfirm}
      />
      {notice !== null && (
        <NoticeModal message={notice} onClose={() => setNotice(null)} />
      )}
      {showExitConfirm && (
        <ConfirmModal
          message="게임을 종료하시겠습니까?"
          onConfirm={handleExitConfirm}
          onCancel={() => setShowExitConfirm(false)}
        />
      )}
    </div>
  )
}

export default MainScreen
