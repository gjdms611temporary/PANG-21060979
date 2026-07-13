# Phase 6 설계 — 풍선 낙하 및 바운스 (수직 움직임)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 6

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 풍선이 중력을 받아 낙하
- 바닥에 닿으면 같은 높이까지 다시 튀어 오름 (감쇠 없음)

**만들지 않는 것**: 좌우 이동(Phase 7), 벽/충돌 처리(Phase 7~)

---

## 2. 물리 모델 — 완전탄성 반사로 "동일 높이" 구현

풍선이 "튕길 때마다 이전과 동일한 높이까지 재상승"하려면, 에너지 손실이 없는 **완전탄성 충돌**로 모델링하면 자연스럽게 만족된다.

```ts
// game/entities/balloon.ts
function updateBalloonVertical(balloon: Balloon, dt: number): void {
  balloon.vy += GRAVITY * dt         // 중력 가속도 적용 (아래 방향 +)
  balloon.y += balloon.vy * dt

  const floorY = FLOOR_Y - BALLOON_RADIUS[balloon.size]
  if (balloon.y >= floorY) {
    balloon.y = floorY
    balloon.vy = -balloon.vy         // 속도 반전 (크기 유지 = 에너지 보존 = 동일 높이 재상승)
  }
}
```

- `GRAVITY`, 초기 `vy`(또는 초기 낙하 시작 높이)는 `game/constants.ts`에 상수로 정의
- 감쇠(damping)를 적용하지 않는 것이 핵심 — `vy = -vy * damping`(damping < 1)을 쓰면 점점 낮아지므로 사용하지 않는다.
- 화면 상단으로 벗어나는 것은 이번 Phase 범위 밖(풍선은 항상 화면 안에서 시작하고 바닥에서만 반사되므로 자연스럽게 발생하지 않음) — 상단/좌우 경계 처리는 Phase 7에서 함께 다룸

---

## 3. 확인 방법

1. 풍선이 위아래로 통통 튀는지 (좌우 이동 없이 제자리에서 수직으로만 움직이는 것이 이번 단계에서는 정상)
2. 여러 번 튕겨도 튀어 오르는 높이가 점점 낮아지지 않고 일정하게 유지되는지
3. 바닥을 뚫고 내려가거나 반대로 튕긴 후 위로 계속 날아가지 않는지

---

## 4. 검토 요청 사항

- 감쇠 없는 완전탄성 반사 모델(에너지 보존)로 "동일 높이 재상승" 규칙을 구현하는 방식에 대한 동의 여부
