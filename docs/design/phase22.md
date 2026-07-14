# Phase 22 설계 — 비주얼: 배경 테마 적용

> 대상: [docs/PLAN.md](../PLAN.md) Phase 22
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 3절, [docs/FEATURES/mission1.md](../FEATURES/mission1.md) 5절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 단색 그라디언트 placeholder 배경(`drawBackground.ts`)을 도시/랜드마크 테마 이미지로 교체

---

## 2. 배경 이미지 로딩/렌더링 (`game/render/drawBackground.ts`)

Phase 21의 `sprites.ts` 패턴을 그대로 확장한다.

```ts
// game/render/sprites.ts 에 추가
export const sprites = {
  // ...기존 항목
  background: loadImage('/src/assets/mission1-bg.png'),
}
```

```ts
// game/render/drawBackground.ts
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants'
import { sprites } from './sprites'

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  if (sprites.background.complete) {
    ctx.drawImage(sprites.background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    return
  }
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#8fd3f4')
  gradient.addColorStop(1, '#e8f9ff')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}
```

- 이미지 로드 전에는 기존 그라디언트를 fallback으로 유지 (빈 화면 방지)
- 이미지 파일은 `src/assets/mission1-bg.png` (800x500 비율에 맞춘 정적 이미지)

---

## 3. 확인 방법

1. Mission 1 진입 시 배경이 도시/랜드마크 테마로 보이는지
2. 배경 교체 후에도 플레이어/풍선/Wire/Block(placeholder 또는 Phase 21 스프라이트) 가독성이 유지되는지 (대비가 너무 약해 안 보이는 요소가 없는지)

---

## 4. 검토 요청 사항

- 배경 이미지 에셋을 직접 준비해서 전달해주실지, 임시 플레이스홀더(그라디언트)로 계속 진행할지 확인 부탁드립니다 (Phase 16 설계 문서에서도 동일하게 확인 요청했던 사항으로, 아직 실제 이미지가 반영되지 않은 상태입니다).
