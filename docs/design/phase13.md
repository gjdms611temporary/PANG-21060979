# Phase 13 설계 — 메인 화면 ↔ Mission 1 연결 완성

> 대상: [docs/PLAN.md](../PLAN.md) Phase 13

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- `Mission1Placeholder` 제거, `게임 시작` → 실제 Mission 1 플레이 화면으로 바로 진입
- 클리어(Phase 11)/게임 오버(Phase 12) 화면에서 메인 화면으로 돌아가는 경로 연결
- `조작 방법` 메뉴에 실제 조작 안내 화면 연결

---

## 2. 화면 상태 확장

`App.tsx`의 화면 상태를 확장한다.

```ts
type Screen = 'main' | 'mission1' | 'howToPlay'
const [screen, setScreen] = useState<Screen>('main')
```

- `Mission1Placeholder` 삭제, `'mission1'`일 때 `<Mission1Screen onExitToMain={() => setScreen('main')} />` 렌더
- `'howToPlay'`일 때 `<HowToPlayScreen onBack={() => setScreen('main')} />` 렌더 (Phase 1에서 만든 `NoticeModal` 임시 안내 대신 실제 화면으로 교체)

## 3. Mission1Screen ↔ App 간 콜백 연결

- `Mission1Screen`은 `status`가 `'clear'` 또는 `'gameover'`일 때, 각 화면(`ClearScreen`/`GameOverScreen`)에 "메인으로" 버튼을 추가하고 클릭 시 `props.onExitToMain()` 호출
- `GameOverScreen`의 "다시 시작"은 Mission 1 내부에서 상태만 리셋(화면 전환 없음), "메인으로"는 `onExitToMain()`으로 `App`의 `screen`을 `'main'`으로 되돌림

## 4. HowToPlayScreen 신규 작성

```
src/screens/
└── HowToPlayScreen.tsx   # 이동(←/→) / 발사(Space) / 풍선 회피 안내 텍스트 + "뒤로가기" 버튼
```

- 내용은 [FEATURES/main.md](../FEATURES/main.md) 3절, [FEATURES/mission1.md](../FEATURES/mission1.md) 1절 문구를 바탕으로 정적 텍스트로 구성 (별도 인터랙션 데모 없이 텍스트 안내 수준)

---

## 5. 확인 방법

1. 메인 화면 → `게임 시작` → Mission 1(placeholder 아님, 실제 플레이 화면)로 바로 진입하는지
2. Mission 1에서 클리어/게임 오버 후 "메인으로" 버튼으로 메인 화면에 정상 복귀하는지
3. 메인 화면 → `조작 방법` → 실제 안내 화면 → "뒤로가기"로 메인 화면 복귀까지 흐름이 끊기지 않는지
4. 메인 화면 → Mission 1 → 메인 화면을 여러 번 반복해도 이전 플레이 상태(풍선 위치 등)가 남아있지 않고 매번 깨끗하게 초기화되는지

---

## 6. 검토 요청 사항

- `설정` 메뉴는 이번 Phase에서도 여전히 Phase 1의 임시 안내(`NoticeModal`)로 남겨두고, 실제 설정 화면/기능은 이 Plan의 범위 밖(추후 별도 Phase 필요)으로 두는 것에 대한 동의 여부
