# Phase 8 설계 — Wire와 풍선 충돌 (단순 소멸)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 8

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- Wire가 풍선에 맞으면 Wire와 풍선이 모두 사라짐 (분열 규칙은 Phase 9에서 추가)

**만들지 않는 것**: 분열(Phase 9), 플레이어-풍선 충돌(Phase 10)

---

## 2. 충돌 판정 설계

```
src/game/
└── collision.ts     # 공용 충돌 판정 함수 모음
```

Wire는 얇은 수직선(점에 가까움), 풍선은 원이므로 **점(또는 짧은 선분) vs 원** 판정으로 처리한다.

```ts
// game/collision.ts
function isPointInCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
  const dx = px - cx
  const dy = py - cy
  return dx * dx + dy * dy <= r * r
}

function wireHitsBalloon(wire: Wire, balloon: Balloon): boolean {
  return isPointInCircle(wire.x, wire.y, balloon.x, balloon.y, BALLOON_RADIUS[balloon.size])
}
```

## 3. 게임 루프 연동

`Mission1Screen`의 매 프레임 업데이트 순서에 충돌 검사 단계를 추가한다.

```ts
// 매 프레임, 엔티티 update 이후
if (gameStateRef.wire) {
  const hitIndex = gameStateRef.balloons.findIndex(b => wireHitsBalloon(gameStateRef.wire!, b))
  if (hitIndex !== -1) {
    gameStateRef.balloons.splice(hitIndex, 1)   // 풍선 제거 (이번 Phase: 무조건 소멸)
    gameStateRef.wire = null                     // Wire 소멸 → 재발사 가능 (Phase 4 규칙과 연동)
  }
}
```

---

## 4. 확인 방법

1. Wire로 풍선을 맞히면 풍선과 Wire가 함께 즉시 사라지는지
2. 풍선을 맞힌 직후 스페이스바를 누르면 바로 재발사되는지 (Phase 4 규칙과의 연동 재확인)
3. Wire가 풍선을 스치지 않고 지나가면(빗나가면) 아무 일도 일어나지 않는지

---

## 5. 검토 요청 사항

- 별도 없음 — 다음 Phase(9)에서 "무조건 소멸"을 "대→소 분열"로 교체합니다.
