# Phase 10 설계 — 플레이어-풍선 충돌 (사망 처리)

> 대상: [docs/PLAN.md](../PLAN.md) Phase 10

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 플레이어와 풍선(크기 무관)의 충돌 판정
- 충돌 시 플레이어 사망 처리 (상세 연출/목숨 차감/게임 오버는 Phase 12에서 다듬음 — 이번 Phase는 "사망 감지 및 최소한의 반응"까지)

---

## 2. 충돌 판정 — 사각형 vs 원

플레이어는 사각형(placeholder)이므로 **사각형 vs 원** 판정을 사용한다.

```ts
// game/collision.ts에 추가
function rectIntersectsCircle(
  rectX: number, rectY: number, rectW: number, rectH: number,
  cx: number, cy: number, r: number,
): boolean {
  const closestX = clamp(cx, rectX, rectX + rectW)
  const closestY = clamp(cy, rectY, rectY + rectH)
  const dx = cx - closestX
  const dy = cy - closestY
  return dx * dx + dy * dy <= r * r
}
```

## 3. 상태 설계 — gameStatus 도입

이번 Phase부터 Mission 1 진행 상태를 표현하는 **React state**(저빈도 갱신)를 `Mission1Screen`에 추가한다.
(충돌 여부 자체는 매 프레임 `ref` 기준으로 검사하되, "사망했다"는 사실은 화면 전체에 영향을 주므로 React state로 끌어올린다.)

```ts
type GameStatus = 'playing' | 'dead'   // Phase 11~12에서 'clear' | 'gameover' 추가 예정

const [status, setStatus] = useState<GameStatus>('playing')
```

- 매 프레임: `status === 'playing'`이고 플레이어와 풍선 중 하나라도 충돌하면 → `setStatus('dead')`
- `status !== 'playing'`이면 게임 루프에서 엔티티 업데이트를 멈추고(정지 화면), 이번 Phase에서는 사망 시 간단한 문구(예: "사망!")만 canvas 위에 표시 — 재시작/목숨 차감 UX는 Phase 12에서 완성

---

## 4. 확인 방법

1. 플레이어가 대(大)/소(小) 풍선 중 어느 것에 닿아도 사망 반응(움직임 정지 + "사망" 표시)이 일어나는지
2. 풍선에 닿지 않는 한 자유롭게 이동/발사가 가능한지 (오탐 충돌이 없는지)
3. 사망 후 화면이 멈추고, 아직 재시작 기능은 없다는 점(= 다음 Phase에서 추가됨)을 확인

---

## 5. 검토 요청 사항

- 이번 Phase의 "사망 반응"을 문구 표시 + 정지 정도의 최소 구현으로 두고, 실제 재시작/게임 오버 흐름은 Phase 12로 미루는 범위 분리에 대한 동의 여부
