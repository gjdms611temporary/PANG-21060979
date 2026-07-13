# Phase 12 설계 — 목숨 및 게임 오버 처리

> 대상: [docs/PLAN.md](../PLAN.md) Phase 12

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 플레이어 목숨(1개) 관리
- Phase 10의 사망 처리와 연동하여 목숨 소진 시 게임 오버 화면 표시
- 게임 오버 화면에서 재시작 가능

---

## 2. 상태 설계

```ts
type GameStatus = 'playing' | 'dead' | 'clear' | 'gameover'

const [lives, setLives] = useState(1)          // PRD 기준 목숨 1개로 시작
const [status, setStatus] = useState<GameStatus>('playing')
```

- 플레이어-풍선 충돌 감지(Phase 10) 시:
  ```ts
  const remaining = lives - 1
  setLives(remaining)
  setStatus(remaining <= 0 ? 'gameover' : 'dead')
  ```
- `status === 'dead'`(목숨이 남아있는 사망)일 경우: 잠시 후 스테이지를 초기 상태로 리셋(`gameStateRef` 재생성 — 플레이어 위치, 풍선 배치, Wire 초기화)하고 `status`를 `'playing'`으로 되돌린다. (연출 디테일: "잠시 후"는 간단한 타이머 또는 사용자 입력 대기로 처리, 세부 값은 Phase 16에서 조정)
- `status === 'gameover'`가 되면 게임 루프 정지, `GameOverScreen` 표시

## 3. 컴포넌트

```
src/screens/
└── GameOverScreen.tsx   # "게임 오버" 문구 + "다시 시작" 버튼
```

- "다시 시작" 클릭 시: `lives`를 1로 초기화, `status`를 `'playing'`으로, `gameStateRef`를 초기 상태로 재생성

---

## 4. 확인 방법

1. 풍선에 맞아 목숨을 모두 소진하면 게임 오버 화면이 뜨는지
2. 게임 오버 화면에서 "다시 시작"을 누르면 플레이어/풍선/Wire가 모두 초기 상태로 리셋되고 정상적으로 다시 플레이할 수 있는지
3. (목숨이 여러 개인 경우를 대비한 구조 검증용) 목숨이 1개보다 많다면 사망 후 게임 오버 없이 스테이지가 재시작되는지 — 단, PRD상 Mission 1은 목숨 1개이므로 실제로는 사망 즉시 게임 오버가 되는 것이 정상 동작

---

## 5. 검토 요청 사항

- PRD상 목숨이 1개이므로 사실상 "사망 = 게임 오버"가 되는데, 그래도 목숨 값을 변수로 두어 이후 확장(목숨 여러 개) 가능성을 열어두는 구조에 대한 동의 여부 (과설계가 우려되면 목숨 개념 없이 "사망 = 즉시 게임 오버"로 단순화하는 방안도 가능)
