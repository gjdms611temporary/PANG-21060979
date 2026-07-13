# Phase 7 설계 — 풍선 좌우 이동 및 벽 반사

> 대상: [docs/PLAN.md](../PLAN.md) Phase 7

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 풍선의 좌/우 수평 이동 추가 (Phase 6의 수직 바운스와 결합)
- 화면 좌/우 벽에 닿으면 진행 방향 반전
- 풍선이 화면 밖(좌/우/상/하)으로 벗어나지 않도록 경계 처리 마무리

**만들지 않는 것**: Wire/플레이어와의 충돌(Phase 8~)

---

## 2. 로직 설계

```ts
// game/entities/balloon.ts
function updateBalloonHorizontal(balloon: Balloon, dt: number): void {
  balloon.x += balloon.vx * dt

  const radius = BALLOON_RADIUS[balloon.size]
  if (balloon.x - radius <= 0) {
    balloon.x = radius
    balloon.vx = -balloon.vx
  } else if (balloon.x + radius >= CANVAS_WIDTH) {
    balloon.x = CANVAS_WIDTH - radius
    balloon.vx = -balloon.vx
  }
}

function updateBalloon(balloon: Balloon, dt: number): void {
  updateBalloonVertical(balloon, dt)    // Phase 6 로직
  updateBalloonHorizontal(balloon, dt)  // 이번 Phase 로직
}
```

- 초기 `vx`는 풍선 생성 시 방향(좌/우)과 속도 상수(`BALLOON_SPEED_X`)로 결정 (Phase 5의 `createBalloon`에 `vx` 초기값 지정 추가)
- 화면 상/하 경계는 Phase 6에서 바닥 처리가 이미 있고, 천장 쪽은 풍선이 도달할 만큼 높이 튀지 않는 한 별도 처리 불필요 — 다만 안전장치로 `y - radius <= 0`일 때도 클램프 처리를 추가해 어떤 속도값에도 화면 밖으로 나가지 않도록 방어

---

## 3. 확인 방법

1. 풍선이 공처럼 좌우로 튕기며 이동하는지 (Phase 6의 수직 바운스와 자연스럽게 결합되는지)
2. 화면 좌/우 벽에 부딪히면 반대 방향으로 튕기는지
3. 어떤 경우에도 풍선이 화면 경계를 벗어나 보이지 않게 되지 않는지
4. 이 단계에서는 플레이어나 Wire와 풍선이 겹쳐도 아무 반응이 없는 것이 정상 (Phase 8에서 충돌 처리)

---

## 4. 검토 요청 사항

- 별도 없음 — Phase 5/6에서 정의한 구조에 수평 이동만 추가하는 단계입니다.
