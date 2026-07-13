import { useEffect } from 'react'

type NoticeModalProps = {
  message: string
  onClose: () => void
}

function NoticeModal({ message, onClose }: NoticeModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  )
}

export default NoticeModal
