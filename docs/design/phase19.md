# Phase 19 설계 — 풍선 vs Block 충돌 (반사)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 19
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 2.2절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 풍선이 Block에 부딪히면 화면 벽/바닥에 부딪힌 것과 동일하게 진행 방향 반전 (수평 충돌 → 좌우 반전, 수직 충돌 → 상하 반전)

---

## 2. 충돌 판정 (`game/collision.ts`)

기존 `playerHitsBalloon`에서 쓰던 사각형-원 교차 판정(`rectIntersectsCircle`)을 export로 전환해 재사용한다.

```ts
// game/collision.ts
export function rectIntersectsCircle( // 기존 private 함수 → export로 변경
  rectX: number, rectY: number, rectW: number, rectH: number,
  cx: number, cy: number, r: number,
): boolean {
  const closestX = Math.max(rectX, Math.min(cx, rectX + rectW))
  const closestY = Math.max(rectY, Math.min(cy, rectY + rectH))
  const dx = cx - closestX
  const dy = cy - closestY
  return dx * dx + dy * dy <= r * r
}

export function balloonHitsBlock(balloon: Balloon, block: Block): boolean {
  return rectIntersectsCircle(
    block.x, block.y, block.width, block.height,
    balloon.x, balloon.y, BALLOON_RADIUS[balloon.size],
  )
}
```

## 3. 반사 로직 (`game/entities/balloon.ts`)

어느 축에서 부딪혔는지는 원 중심과 사각형에서 가장 가까운 점 사이의 겹침(overlap)이 x/y 중 어느 쪽이 더 작은지로 판단한다 (더 얕게 파고든 축이 실제로 부딪힌 면).

```ts
export function resolveBalloonBlockCollision(balloon: Balloon, block: Block): void {
  const radius = BALLOON_RADIUS[balloon.size]
  const closestX = Math.max(block.x, Math.min(balloon.x, block.x + block.width))
  const closestY = Math.max(block.y, Math.min(balloon.y, block.y + block.height))
  const dx = balloon.x - closestX
  const dy = balloon.y - closestY

  const overlapX = radius - Math.abs(dx)
  const overlapY = radius - Math.abs(dy)

  if (overlapX < overlapY) {
    balloon.x += dx < 0 ? -overlapX : overlapX
    balloon.vx = -balloon.vx
  } else {
    balloon.y += dy < 0 ? -overlapY : overlapY
    balloon.vy = -balloon.vy
  }
}
```

- 겹침을 되돌려(push-out) 위치를 보정한 뒤 해당 축의 속도만 반전 — Phase 6/7의 벽/바닥 반사(`updateBalloonVertical`/`updateBalloonHorizontal`)와 동일한 접근

## 4. 게임 루프 연동 (`screens/Mission1Screen.tsx`, `updateBalloon` 호출 직후)

```ts
for (const balloon of state.balloons) {
  updateBalloon(balloon, dt)
  for (const block of state.blocks) {
    if (balloonHitsBlock(balloon, block)) {
      resolveBalloonBlockCollision(balloon, block)
    }
  }
}
```

---

## 5. 확인 방법

1. 풍선이 Block 옆면(좌/우)에 부딪히면 좌우로 튕기는지
2. 풍선이 Block 위/아래(낙하 중 상단, 바운스 중 하단)에 부딪히면 상하로 튕기는지
3. 반사 후 풍선이 Block 안에 끼거나 뚫고 지나가지 않는지 (여러 프레임 연속 관찰)

---

## 6. 검토 요청 사항

- 별도 없음 — [PRD-v2.md](../PRD-v2.md) 2.2절 규칙을 그대로 구현하는 단계입니다.
