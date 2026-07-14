# Phase 21 설계 — 비주얼: 캐릭터/오브젝트 스프라이트 교체

> 대상: [docs/PLAN.md](../PLAN.md) Phase 21
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 3절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 플레이어/대·소 풍선/Wire/Block의 도형 placeholder(`drawPlayer`/`drawBalloon`/`drawWire`/`drawBlock`)를 이미지 스프라이트로 교체

**이번 Phase에서 만들지 않는 것**
- 배경 이미지 (Phase 22)
- 충돌 판정 로직 변경 (히트박스는 기존 크기/좌표 그대로 유지, 그림만 바뀜)

---

## 2. 스프라이트 로딩 (`game/render/sprites.ts` 신규)

```ts
function loadImage(src: string): HTMLImageElement {
  const img = new Image()
  img.src = src
  return img
}

export const sprites = {
  player: loadImage('/src/assets/player.png'),
  balloonLarge: loadImage('/src/assets/balloon-large.png'),
  balloonSmall: loadImage('/src/assets/balloon-small.png'),
  block: loadImage('/src/assets/block.png'),
}
```

- 모듈 로드 시점에 이미지 다운로드를 시작 (브라우저가 캐시), `img.complete`로 로드 완료 여부 확인 가능
- 실제 이미지 파일은 `src/assets/`에 배치 — 파일 확보 방법(직접 제작/에셋 구매/AI 생성)은 검토 시 논의

## 3. 각 draw 함수 수정 (fallback 유지)

이미지가 아직 로드되지 않은 프레임에 빈 화면이 나오지 않도록, 로드 전에는 기존 도형을 그대로 그린다.

```ts
// game/render/drawPlayer.ts
import { sprites } from './sprites'

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  if (sprites.player.complete) {
    ctx.drawImage(sprites.player, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT)
  } else {
    ctx.fillStyle = '#aa3bff'
    ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT)
  }
}
```

- `drawBalloon.ts`: `balloon.size`에 따라 `sprites.balloonLarge`/`sprites.balloonSmall` 선택, `drawImage`는 중심 좌표 기준으로 `balloon.x - radius, balloon.y - radius, radius*2, radius*2`
- `drawBlock.ts`: `sprites.block`을 `block.width x block.height`로 `drawImage`
- `drawWire.ts`: Wire는 선(line) 형태 유지가 더 단순하므로, 스프라이트 대신 색상/굵기만 다듬는 것으로 대체 가능 (와이어 이미지가 준비되면 동일 패턴 적용)

---

## 4. 확인 방법

1. 플레이어/대풍선/소풍선/Block이 도형이 아닌 이미지로 보이는지
2. 스프라이트 교체 후에도 충돌(Wire로 풍선 맞히기, 풍선-Block 반사, 플레이어-Block 차단 등)이 이전과 동일하게 동작하는지 (히트박스는 좌표/크기 그대로이므로 회귀 없어야 함)
3. 새로고침 직후 이미지가 아직 로드되지 않은 짧은 순간에도 화면이 비어 보이지 않는지 (fallback 도형 확인)

---

## 5. 검토 요청 사항

- 스프라이트 이미지 파일을 직접 준비해서 전달해주실지, 이번 Phase는 placeholder 도형을 유지한 채 다음 기회에 실제 리소스를 넣을지 확인 부탁드립니다.
- 스타일(색감/선 굵기/만화풍·픽셀풍 등)은 [PRD-v2.md](../PRD-v2.md) 3절에 "후속 상세 기획에서 확정"이라 명시되어 있어, 실제 이미지 확보 전에는 방향성 컨펌이 필요합니다.
