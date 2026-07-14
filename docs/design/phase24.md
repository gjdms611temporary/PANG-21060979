# Phase 24 설계 — UX: HUD 캔버스 안전영역 검증 및 최종 점검

> 대상: [docs/PLAN.md](../PLAN.md) Phase 24
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 4절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 다양한 화면 비율(레터박스)에서 HUD 및 클리어/게임 오버 오버레이가 항상 캔버스 내부에 위치하도록 점검·수정
- Block 로직(Phase 17~20) + 비주얼(Phase 21~22) + UX(Phase 23) 변경 사항을 포함한 전체 플로우 최종 점검

**이번 Phase는 새 기능을 만들지 않는다.** 회귀 방지 점검과 마무리 단계다.

---

## 2. HUD 자체는 이미 안전 (배경 확인)

`drawHUD(ctx, ...)`는 canvas 좌표계(`CANVAS_WIDTH` 기준) 안에서 `ctx.fillText`로 그려지므로, 캔버스가 `object-fit: contain`으로 레터박스 축소/확대되어도 HUD는 항상 캔버스 내부에 위치한다 (canvas 자체가 그려지는 그림의 일부이기 때문). PRD-v2 4절이 우려하는 "HUD가 캔버스 밖에 그려지는" 회귀는 HUD를 DOM 오버레이(`position: absolute`)로 구현했을 때 발생하는 문제이며, 현재 구현(`Mission1Screen.tsx`의 `drawHUD` 호출)은 이미 이 방식이 아니므로 구조적으로 안전하다.

**점검만 수행**: 다양한 창 크기/비율에서 실제로 HUD가 캔버스 밖으로 나가지 않는지 육안 확인 (코드 변경 없이 확인 항목으로 처리).

## 3. 실제 위험 지점: Clear/GameOver 오버레이

`screens/Mission1Screen.css`를 보면 다음과 같은 구조다.

```css
.mission1-container {
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mission1-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 레터박스로 캔버스가 컨테이너 안에서 축소됨 */
}
```

`ClearScreen`/`GameOverScreen`의 오버레이는 `.mission1-container` 기준 `position: absolute; inset: 0`(각 컴포넌트 CSS 참고)이다. 즉 오버레이는 **컨테이너 전체(뷰포트 크기)** 를 덮지만, 실제 게임 화면은 그 안에서 `object-fit: contain`으로 레터박스 처리된 **더 작은 캔버스 영역**이다. 화면 비율이 800:500과 크게 다른 경우(세로로 긴 모바일 화면 등), 오버레이 텍스트/버튼이 캔버스 바깥의 레터박스(검은 여백) 쪽에 걸치거나 중심이 어긋나 보일 수 있다.

### 수정 방향

컨테이너를 캔버스와 동일한 종횡비로 제한해서, 오버레이 `inset: 0`이 곧 캔버스 영역과 일치하도록 만든다.

```css
/* Mission1Screen.css */
.mission1-container {
  position: relative;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.mission1-frame {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 800 / 500; /* CANVAS_WIDTH / CANVAS_HEIGHT */
  max-width: 100%;
  max-height: 100%;
}

.mission1-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

```tsx
// Mission1Screen.tsx
<div className="mission1-container">
  <div className="mission1-frame">
    <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="mission1-canvas" />
    {status === 'clear' && <ClearScreen onExitToMain={onExitToMain} />}
    {status === 'gameover' && (
      <GameOverScreen onRestart={handleRestart} onExitToMain={onExitToMain} />
    )}
  </div>
</div>
```

- `.mission1-frame`이 `aspect-ratio`로 캔버스와 동일한 비율을 유지하면서 `max-width`/`max-height: 100%`로 컨테이너 안에 맞춰 축소되므로, `object-fit: contain`이 하던 레터박스 역할을 컨테이너 레벨에서 대신한다
- `ClearScreen`/`GameOverScreen`의 `position: absolute; inset: 0`은 이제 `.mission1-frame` 기준이 되어 캔버스 영역과 정확히 일치한다

---

## 4. 최종 점검 체크리스트

- [ ] 다양한 창 크기/비율(가로로 넓은/세로로 긴)에서 HUD가 항상 캔버스 안에 보이는지
- [ ] 같은 조건에서 클리어/게임 오버 화면의 텍스트·버튼이 레터박스 여백이 아닌 실제 캔버스 영역 안(중앙)에 위치하는지
- [ ] Block 관련 Phase 17~20 로직이 스프라이트 교체(Phase 21) 이후에도 동일하게 동작하는지
- [ ] 메인 화면 → Mission 1(Block 포함) → 클리어/게임 오버 → 메인 화면, 전체 흐름이 끊김 없이 동작하는지
- [ ] 콘솔 에러/경고 없이 정상 동작하는지

---

## 5. 확인 방법

1. 브라우저 창 크기를 가로로 넓게/세로로 좁게 바꿔가며 위 체크리스트를 확인
2. 전체 플로우를 처음 접하는 사람 기준으로 플레이해보고 Block 포함 난이도가 튜토리얼로서 적절한지 재확인

---

## 6. 검토 요청 사항

- `.mission1-frame` 도입으로 레이아웃 구조가 한 단계(`div`) 늘어나는데, 이 정도 구조 변경은 회귀 방지 목적상 필요한 수정으로 보고 진행해도 될지 확인 부탁드립니다.
