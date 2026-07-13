import { useEffect } from 'react'
import type { MenuItem } from '../constants/menu'
import './MenuList.css'

type MenuListProps = {
  items: MenuItem[]
  selectedIndex: number
  onSelect: (index: number) => void
  onChoose: (index: number) => void
  disabled?: boolean
}

function MenuList({ items, selectedIndex, onSelect, onChoose, disabled = false }: MenuListProps) {
  useEffect(() => {
    if (disabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        onSelect((selectedIndex + 1) % items.length)
      } else if (event.key === 'ArrowUp') {
        onSelect((selectedIndex - 1 + items.length) % items.length)
      } else if (event.key === 'Enter') {
        onChoose(selectedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, items.length, selectedIndex, onSelect, onChoose])

  return (
    <ul className="menu-list">
      {items.map((item, index) => (
        <li
          key={item.id}
          className={`menu-item${index === selectedIndex ? ' selected' : ''}`}
          onMouseEnter={() => onSelect(index)}
          onClick={() => onChoose(index)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  )
}

export default MenuList
