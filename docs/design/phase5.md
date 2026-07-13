# Phase 5 설계 — 풍선 등장 (정지 상태)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 5

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 대(大) 풍선 1~2개를 화면에 정적으로 표시 (움직이지 않음)

**만들지 않는 것**: 낙하/바운스(Phase 6), 좌우 이동(Phase 7), 충돌(Phase 8~)

---

## 2. 엔티티 설계

```
src/game/
├── entities/
│   └── balloon.ts        # Balloon 타입, createBalloon()
└── render/
    └── drawBalloon.ts     # ctx에 원(circle)으로 풍선 그리기
```

```ts
// game/entities/balloon.ts
type BalloonSize = 'large' | 'small'

type Balloon = {
  x: number
  y: number
  vx: number     // 이번 Phase에서는 0 고정
  vy: number     // 이번 Phase에서는 0 고정
  size: BalloonSize
}

function createBalloon(x: number, y: number, size: BalloonSize): Balloon { ... }
```

- `gameStateRef.balloons: Balloon[]` — 초기값으로 대(大) 풍선 1~2개를 화면 상단 근처 임의 위치에 배치
- 크기별 반지름 상수: `BALLOON_RADIUS = { large: 32, small: 18 }` (px, 세부 수치는 Phase 16에서 조정 가능)
- `drawBalloon`은 `ctx.arc()`로 크기에 맞는 원을 그림 (색상 placeholder, 실제 스프라이트는 Phase 16)

---

## 3. 확인 방법

1. Mission 1 화면 진입 시 대(大) 풍선이 화면에 보이는지
2. 풍선 크기/위치가 화면 비율상 어색하지 않은지 (너무 크거나 화면 밖에 걸치지 않는지)
3. 이 단계에서는 풍선이 움직이지 않는 것이 정상 (다음 Phase에서 낙하/이동 추가)

---

## 4. 검토 요청 사항

- 초기 등장 개수(1개 vs 2개)와 배치 위치(예: 화면 상단 좌/우)에 대한 선호가 있으면 알려주세요. 없으면 임의로 2개, 화면 상단 좌우로 배치하겠습니다.
