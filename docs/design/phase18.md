# Phase 18 설계 — Wire vs Block 충돌

> 대상: [docs/PLAN.md](../PLAN.md) Phase 18
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 2.2절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- Wire가 Block에 닿으면 풍선을 맞히지 못한 채 즉시 소멸 (재발사 가능 상태로 전환)

---

## 2. 충돌 판정 (`game/collision.ts`)

Wire는 `(wire.x, wire.y)`에서 `(wire.x, FLOOR_Y)`까지의 수직선이다 (`render/drawWire.ts` 참고). Block은 Wire가 위로 올라가는 도중 부딪히는 것만 판정하면 되므로, "Wire의 x가 Block의 x 범위 안에 있고, Wire의 선단(y)이 Block 하단보다 위로 올라왔는지"만 확인하면 된다.

```ts
import type { Block } from './entities/block'

export function wireHitsBlock(wire: Wire, block: Block): boolean {
  return (
    wire.x >= block.x &&
    wire.x <= block.x + block.width &&
    wire.y <= block.y + block.height
  )
}
```

## 3. 게임 루프 연동 (`screens/Mission1Screen.tsx`, Phase 8/9 로직 앞에 삽입)

```ts
const wire = state.wire
if (wire) {
  const hitBlock = state.blocks.some((block) => wireHitsBlock(wire, block))
  if (hitBlock) {
    state.wire = null
  } else {
    const hitIndex = state.balloons.findIndex((b) => wireHitsBalloon(wire, b))
    if (hitIndex !== -1) {
      // 기존 Phase 8/9 로직 그대로
    }
  }
}
```

- Block에 맞은 프레임에는 풍선 충돌 판정을 건너뛴다 (Wire가 Block에서 멈춘 것으로 간주 — 같은 프레임에 Block 뒤 풍선까지 맞히는 것은 부자연스러움)
- Block 소멸 시 점수 획득 없음 (풍선을 맞힌 게 아니므로)

---

## 4. 확인 방법

1. 플레이어를 Block 바로 아래로 이동시켜 Wire를 발사 → Wire가 Block에서 멈추고 사라지는지
2. Block에 막힌 직후 스페이스바로 Wire를 다시 발사할 수 있는지 (Phase 4 한 발 제한 규칙과 연동 확인)
3. Block이 없는 위치에서는 기존처럼 풍선까지 정상적으로 Wire가 도달하는지

---

## 5. 검토 요청 사항

- 별도 없음 — [PRD-v2.md](../PRD-v2.md) 2.2절 규칙을 그대로 구현하는 단계입니다.
