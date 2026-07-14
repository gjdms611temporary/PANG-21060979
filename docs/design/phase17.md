# Phase 17 설계 — Block 등장 (정지 상태, 충돌 없음)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 17
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 2절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- Block 엔티티 타입/생성 함수 정의
- Block 1~2개를 Mission 1 화면에 정적으로 배치·렌더링
- 이번 Phase에서는 Wire/풍선/플레이어와 충돌 판정을 하지 않는다 (Phase 18~20에서 순차 추가)

**이번 Phase에서 만들지 않는 것**
- 충돌 판정 전체 (다음 Phase들에서 추가)
- Block 이동 로직 (PRD-v2 2.4절: 위치를 상태로만 관리, 이동은 범위 밖)

---

## 2. 엔티티 설계 (`game/entities/block.ts` 신규)

```ts
export type Block = {
  x: number
  y: number
  width: number
  height: number
}

export function createBlock(x: number, y: number, width: number, height: number): Block {
  return { x, y, width, height }
}
```

- `x, y`는 좌상단 기준 좌표 (플레이어/HUD 좌표계와 동일한 canvas 좌표계 사용)
- PRD-v2 2.4절에 따라 위치를 고정 리터럴이 아닌 `Block` 객체(state)로 관리 — 후속 미션에서 이동형 Block으로 확장할 때 `vx`/`path` 같은 필드만 추가하면 되는 구조

## 3. 렌더링 (`game/render/drawBlock.ts` 신규)

```ts
import type { Block } from '../entities/block'

export function drawBlock(ctx: CanvasRenderingContext2D, block: Block): void {
  ctx.fillStyle = '#5a5560'
  ctx.fillRect(block.x, block.y, block.width, block.height)
}
```

- 기존 `drawPlayer.ts`(단색 사각형 placeholder)와 동일한 수준의 placeholder로 시작 (Phase 21에서 스프라이트로 교체)

## 4. 배치 및 화면 연동 (`screens/Mission1Screen.tsx`)

```ts
import { createBlock, type Block } from '../game/entities/block'
import { drawBlock } from '../game/render/drawBlock'

function createInitialBlocks(): Block[] {
  return [createBlock(CANVAS_WIDTH * 0.5 - 40, CANVAS_HEIGHT - 160, 80, 24)]
}
```

- `GameState`에 `blocks: Block[]` 필드 추가, `createInitialGameState()`에서 `createInitialBlocks()` 호출
- 렌더 순서: `drawBackground` → `drawBlock`(각 block) → `drawPlayer` → `drawWire` → `drawBalloon`(각 풍선) → `drawHUD`
  - Block을 배경 바로 위, 캐릭터/풍선보다 먼저 그려서 "고정된 배경 구조물" 느낌을 준다
- 정확한 개수/좌표/크기는 PRD-v2 2.3절대로 임시값이며, 확정 시 검토 필요

---

## 5. 확인 방법

1. Mission 1 진입 시 Block이 화면에 보이는지 (위치/크기가 자연스러운지, 다른 UI를 가리지 않는지)
2. 플레이어를 Block 위치로 이동시키거나 Wire/풍선을 Block에 부딪혀봐도 그냥 통과하는지 (이번 Phase에서는 정상 동작)

---

## 6. 검토 요청 사항

- Block 개수(1개 vs 2개)와 배치 좌표(화면 중앙 상단부 vs 다른 위치)를 이 임시값으로 진행할지, 다른 위치를 원하시는지 확인 부탁드립니다.
