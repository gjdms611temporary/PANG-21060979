# Phase 20 설계 — 플레이어 vs Block 충돌

> 대상: [docs/PLAN.md](../PLAN.md) Phase 20
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 2.2절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 플레이어가 Block을 통과하지 못하도록 이동 제한 (화면 좌/우 벽과 동일한 방식)

---

## 2. 판정 및 제한 로직 (`game/entities/player.ts`)

플레이어는 Y 좌표가 고정(`PLAYER_Y`)이므로, Block이 플레이어 높이 범위(`PLAYER_Y` ~ `PLAYER_Y + PLAYER_HEIGHT`)와 겹치는 경우에만 좌우 이동을 막으면 된다.

```ts
import type { Block } from './block'

function blockOverlapsPlayerHeight(block: Block): boolean {
  return block.y < PLAYER_Y + PLAYER_HEIGHT && block.y + block.height > PLAYER_Y
}

export function updatePlayer(
  player: Player,
  keys: Set<string>,
  dt: number,
  blocks: Block[],
): void {
  if (keys.has('ArrowLeft')) {
    player.x -= PLAYER_SPEED * dt
  }
  if (keys.has('ArrowRight')) {
    player.x += PLAYER_SPEED * dt
  }
  player.x = Math.max(0, Math.min(player.x, CANVAS_WIDTH - PLAYER_WIDTH))

  for (const block of blocks) {
    if (!blockOverlapsPlayerHeight(block)) continue
    if (player.x + PLAYER_WIDTH > block.x && player.x < block.x + block.width) {
      const cameFromLeft = player.x < block.x
      player.x = cameFromLeft ? block.x - PLAYER_WIDTH : block.x + block.width
    }
  }
}
```

- 화면 좌/우 벽 클램프와 같은 방식으로, Block과 겹치면 Block 바로 앞에서 멈춘다
- `cameFromLeft` 판단은 "플레이어 중심이 Block보다 왼쪽에 있었는가"가 아니라 "겹친 후 플레이어 x가 Block x보다 작은가"로 단순화 — 플레이어 이동 속도가 Block 두께보다 훨씬 작으므로(한 프레임에 Block을 통과할 만큼 빠르지 않음) 이 근사로 충분

## 3. 호출부 수정 (`screens/Mission1Screen.tsx`)

```ts
updatePlayer(state.player, keys, dt, state.blocks)
```

---

## 4. 확인 방법

1. 플레이어를 Block 방향으로 이동시키면 Block 앞에서 멈추고 더 이상 그 방향으로 못 가는지
2. 반대 방향(Block을 등지는 방향)으로는 정상 이동 가능한지
3. Block 높이 범위에 걸치지 않는 위치(플레이어 키 높이보다 위에 뜬 Block이 있다면)에서는 플레이어가 그 밑으로 자유롭게 지나다닐 수 있는지

---

## 5. 검토 요청 사항

- 별도 없음 — [PRD-v2.md](../PRD-v2.md) 2.2절 규칙을 그대로 구현하는 단계입니다.
