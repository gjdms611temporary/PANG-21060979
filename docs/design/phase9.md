# Phase 9 설계 — 풍선 분열 규칙

> 대상: [docs/PLAN.md](../PLAN.md) Phase 9

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 대(大) 풍선을 맞히면 소멸 대신 소(小) 풍선 2개로 분열
- 소(小) 풍선을 맞히면 Phase 8과 동일하게 분열 없이 소멸

---

## 2. 로직 설계

```ts
// game/entities/balloon.ts
function splitBalloon(balloon: Balloon): Balloon[] {
  if (balloon.size === 'small') return []   // 소 풍선은 분열 없이 소멸(빈 배열 = 대체 풍선 없음)

  const speed = Math.abs(balloon.vx) || BALLOON_SPEED_X
  return [
    createBalloonAt(balloon.x, balloon.y, 'small', -speed),  // 왼쪽으로
    createBalloonAt(balloon.x, balloon.y, 'small', +speed),  // 오른쪽으로
  ]
}
```

- `createBalloonAt(x, y, size, vx)`: 분열 시점의 위치를 그대로 물려받고, 좌/우 반대 방향 `vx`를 지정하는 생성 함수 (기존 `createBalloon`을 확장하거나 별도 helper로 분리)
- 수직 속도(`vy`)는 분열 시점 값을 그대로 유지 (분열 전 풍선이 낙하 중이었다면 낙하 중인 상태 그대로 이어짐)

## 3. 게임 루프 연동 (Phase 8 로직 확장)

```ts
if (hitIndex !== -1) {
  const hitBalloon = gameStateRef.balloons[hitIndex]
  const children = splitBalloon(hitBalloon)
  gameStateRef.balloons.splice(hitIndex, 1, ...children)  // 제거 후 자식 풍선(있으면)으로 교체
  gameStateRef.wire = null
}
```

---

## 4. 확인 방법

1. 대(大) 풍선을 맞히면 같은 위치에서 소(小) 풍선 2개가 생기는지
2. 분열된 두 풍선이 서로 반대 방향(좌/우)으로 움직이기 시작하는지
3. 소(小) 풍선을 맞히면 더 분열하지 않고 바로 사라지는지 (Phase 8과 동일 동작 유지 확인)

---

## 5. 검토 요청 사항

- 별도 없음 — [FEATURES/game_rule.md](../FEATURES/game_rule.md) 3.1/3.3절 규칙을 그대로 구현하는 단계입니다.
