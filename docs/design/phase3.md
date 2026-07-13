# Phase 3 설계 — Wire 발사

> 대상: [docs/PLAN.md](../PLAN.md) Phase 3

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 스페이스바 입력으로 플레이어 위치에서 수직으로 Wire 발사
- Wire가 천장에 닿으면 소멸

**만들지 않는 것**: 한 발 제한(Phase 4), 풍선/충돌(Phase 5~)

---

## 2. 발사 입력 — Edge Trigger 처리

Phase 2의 `useKeyboardState`(눌려있는 키 Set)는 "누르고 있는 동안 계속 true"이므로,
Space를 누르고 있으면 매 프레임 새 Wire가 생성되는 문제가 생긴다.

→ 발사는 **keydown 시 1회만 발생**해야 하므로, Space 전용으로 "이번 프레임에 새로 눌렸는지"를 감지하는 별도 처리가 필요하다.

```ts
// game/input.ts에 추가
function useJustPressed(key: string): () => boolean {
  // keydown 시 pending=true 로 표시
  // consume() 호출 시 pending 값을 반환하고 false로 리셋
  // (게임 루프에서 매 프레임 consume()을 호출해 1회만 소비)
}
```

`Mission1Screen`의 루프에서 `spacePressed = consumeSpace()`를 매 프레임 확인하여 발사 조건으로 사용한다.

---

## 3. 파일 변경

```
src/game/
├── entities/
│   └── wire.ts          # Wire 타입, createWire(x, y), updateWire(wire, dt)
└── render/
    └── drawWire.ts       # ctx에 Wire 그리기 (수직선/막대)
```

```ts
// game/entities/wire.ts
type Wire = {
  x: number
  y: number
  active: boolean
}

function createWire(x: number, y: number): Wire { ... }
function updateWire(wire: Wire, dt: number): void {
  wire.y -= WIRE_SPEED * dt
  if (wire.y <= 0) wire.active = false   // 천장 도달 시 소멸
}
```

- `gameStateRef.wire: Wire | null`
- 매 프레임: `spacePressed && gameStateRef.wire === null` → `createWire(player.x + PLAYER_WIDTH/2, PLAYER_Y)` 로 생성
  (참고: "화면에 한 발만" 제한은 Phase 4에서 명시적으로 다루지만, `wire: Wire | null` 구조 자체가 자연스럽게 1발 제한의 기반이 된다)
- `wire.active === false` 가 되면 `gameStateRef.wire = null` 로 정리

---

## 4. 확인 방법

1. 스페이스바를 누르면 플레이어 바로 위에서 Wire가 수직으로 발사되는지
2. Wire가 화면 위로 곧게 올라가고, 좌우로 휘거나 플레이어를 따라가지 않는지 (발사 시점 x 고정)
3. 천장에 닿으면 Wire가 사라지는지
4. 스페이스바를 계속 눌러도(떼지 않아도) Wire가 여러 발 겹쳐 나가지 않는지 (edge trigger 확인 — 사실상 Phase 4 규칙의 선행 확인)

---

## 5. 검토 요청 사항

- `useJustPressed` 방식(키다운 엣지 감지)으로 발사 입력을 처리하는 것에 대한 동의 여부
