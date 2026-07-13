export type MenuItem = {
  id: 'start' | 'howToPlay' | 'options' | 'exit'
  label: string
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'start', label: '게임 시작' },
  { id: 'howToPlay', label: '조작 방법' },
  { id: 'options', label: '설정' },
  { id: 'exit', label: '게임 종료' },
]
