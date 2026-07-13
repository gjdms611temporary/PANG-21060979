# Phase 14 설계 — 점수 시스템

> 대상: [docs/PLAN.md](../PLAN.md) Phase 14

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 풍선을 제거할 때마다 점수 획득 (소 풍선이 대 풍선보다 높은 점수)
- 내부적으로 점수 값 누적 관리 (화면 표시는 Phase 15)

---

## 2. 점수 테이블 및 로직

```ts
// game/constants.ts에 추가
const SCORE_TABLE: Record<BalloonSize, number> = {
  large: 100,
  small: 300,
}
```

- [FEATURES/game_rule.md](../FEATURES/game_rule.md) 5절: "풍선 크기가 작을수록 처치 시 획득 점수가 높음" 규칙 반영 (구체적 수치는 예시이며, 검토 시 조정 가능)

## 3. 점수 누적 위치

Phase 8/9의 충돌 처리 로직(Wire-풍선 충돌 시 `splice`)에 점수 가산을 추가한다.

```ts
if (hitIndex !== -1) {
  const hitBalloon = gameStateRef.balloons[hitIndex]
  gameStateRef.score += SCORE_TABLE[hitBalloon.size]   // 점수는 ref에 누적 (고빈도 갱신)
  const children = splitBalloon(hitBalloon)
  gameStateRef.balloons.splice(hitIndex, 1, ...children)
  gameStateRef.wire = null
}
```

- 점수는 매 프레임이 아니라 "풍선이 제거되는 이벤트" 시점에만 바뀌므로 `gameStateRef.score`(mutable ref)에 누적한다.
- 화면에 실시간으로 보여주는 것은 Phase 15에서 React state와 동기화하는 방식으로 처리한다.

---

## 4. 확인 방법

(화면 표시는 Phase 15에서 붙으므로, 이번 Phase는 개발자 도구 콘솔 로그 등으로 임시 확인)

1. 풍선을 제거할 때마다 콘솔에 누적 점수가 올바르게 증가해 찍히는지
2. 대(大) 풍선보다 소(小) 풍선을 제거했을 때 더 많은 점수가 오르는지
3. 스테이지 재시작(Phase 12) 시 점수가 0으로 초기화되는지

---

## 5. 검토 요청 사항

- 점수 테이블 값(대 100점 / 소 300점)은 예시 수치입니다. 특정 값을 원하시면 알려주시고, 없으면 이 값으로 진행 후 Phase 16에서 최종 조정하겠습니다.
