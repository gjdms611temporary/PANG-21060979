# Phase 15 설계 — HUD 표시

> 대상: [docs/PLAN.md](../PLAN.md) Phase 15

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 화면에 현재 점수(Phase 14)와 남은 목숨(Phase 12)을 실시간으로 표시

---

## 2. 아키텍처 — Canvas 위 DOM 오버레이

점수/목숨 텍스트는 canvas 안에 직접 그릴 수도 있지만, React 컴포넌트로 다루는 편이
스타일링(폰트, 위치 조정)과 향후 유지보수에 더 간단하다.

→ **HUD는 canvas 위에 절대 위치(position: absolute)로 겹치는 별도 DOM 컴포넌트**로 구현한다.

```
src/screens/
└── Mission1Screen.tsx    # canvas + <HUD /> 함께 렌더 (컨테이너에 position: relative)
src/components/
├── HUD.tsx                # 점수/목숨 표시
└── HUD.css
```

```tsx
<div className="mission1-container">
  <canvas ref={canvasRef} />
  <HUD score={score} lives={lives} />
</div>
```

## 3. ref → state 동기화

`score`(Phase 14, ref에 누적), `lives`(Phase 12, 이미 React state)를 HUD에 실시간 반영하려면
ref에만 있는 `score`를 주기적으로 React state로 끌어올려야 한다.

```ts
const [displayScore, setDisplayScore] = useState(0)

// 게임 루프 콜백 내부, 풍선 제거(점수 변경) 이벤트가 발생한 프레임에만 갱신
if (scoreChangedThisFrame) {
  setDisplayScore(gameStateRef.score)
}
```

- 매 프레임 `setState`를 호출하지 않고, **점수가 실제로 바뀐 프레임에만** state를 갱신하여 불필요한 리렌더를 최소화한다.
- `lives`는 이미 Phase 12에서 React state로 관리하므로 그대로 `HUD`에 props로 전달한다.

---

## 4. 확인 방법

1. 화면 상단(또는 지정 위치)에 점수와 목숨이 표시되는지
2. 풍선을 제거할 때마다 점수 표시가 즉시(끊김 없이) 갱신되는지
3. 목숨이 줄어들 때 목숨 표시도 즉시 갱신되는지
4. HUD가 게임 플레이(캐릭터/풍선 시야)를 가리지 않는 위치에 있는지

---

## 5. 검토 요청 사항

- HUD 표시 위치(예: 좌측 상단에 점수, 우측 상단에 목숨 등)에 대한 선호가 있으면 알려주세요. 없으면 좌측 상단에 점수, 그 옆에 목숨을 나란히 배치하겠습니다.
