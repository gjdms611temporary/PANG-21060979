# Phase 11 설계 — 스테이지 클리어 처리

> 대상: [docs/PLAN.md](../PLAN.md) Phase 11

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 화면 내 모든 풍선(분열체 포함)을 제거하면 클리어 상태로 전환 및 클리어 화면 표시

---

## 2. 상태 설계

Phase 10에서 도입한 `GameStatus`를 확장한다.

```ts
type GameStatus = 'playing' | 'dead' | 'clear'
```

- 매 프레임(`status === 'playing'`일 때): `gameStateRef.balloons.length === 0` 이면 → `setStatus('clear')`
- `status === 'clear'`가 되면 게임 루프의 엔티티 업데이트를 멈춘다 (Phase 10의 `dead`와 동일한 정지 패턴)

## 3. 클리어 화면 컴포넌트

```
src/screens/
└── ClearScreen.tsx   # "Mission 1 클리어!" 문구 표시 (오버레이 또는 canvas 위 안내)
```

- `Mission1Screen`에서 `status === 'clear'`일 때 canvas 위에 `<ClearScreen />`을 오버레이로 렌더링
- 이번 Phase에서는 클리어 화면에 별도 버튼(메인으로 돌아가기 등)은 아직 없음 — 화면 전환 흐름은 Phase 13에서 메인 화면과 함께 연결

---

## 4. 확인 방법

1. 화면에 있는 풍선(분열로 생긴 작은 풍선 포함)을 모두 제거하면 "클리어" 화면이 뜨는지
2. 클리어 후 캐릭터/Wire/풍선 갱신이 멈추고 어색하게 계속 진행되지 않는지
3. 분열된 풍선 중 하나만 남았을 때는 아직 클리어되지 않는지 (모든 풍선 제거 조건이 정확히 동작하는지)

---

## 5. 검토 요청 사항

- 이번 Phase의 클리어 화면은 문구 표시까지만 구현하고, "메인으로 돌아가기" 등 버튼 연결은 Phase 13에서 진행하는 범위 분리에 대한 동의 여부
