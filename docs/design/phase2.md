# Phase 2 설계 — 플레이어 등장 및 좌우 이동

> 대상: [docs/PLAN.md](../PLAN.md) Phase 2

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- `Mission1Placeholder`를 실제 플레이 화면(`Mission1Screen`)으로 교체
- 게임 루프(매 프레임 갱신) 아키텍처 도입
- 키보드 입력(←/→) 처리
- 플레이어 엔티티 등장 및 좌우 이동, 벽 제한

**만들지 않는 것**: Wire, 풍선, 충돌, 점수 등 이후 Phase 전부

---

## 2. 아키텍처 결정 — Canvas 기반 렌더링

Mission 1처럼 다수의 움직이는 엔티티(플레이어, Wire, 풍선 여러 개)를 매 프레임 갱신해야 하는 화면은,
DOM 엘리먼트를 엔티티마다 만들어 React state로 매 프레임 리렌더링하면 성능 문제가 생기기 쉽다.

→ Mission 1 플레이 화면은 **`<canvas>` + 2D Context**로 직접 그리는 방식을 채택한다.
- 엔티티 상태(위치, 속도 등)는 **React state가 아닌 `ref` 객체(mutable)**에 보관
- `requestAnimationFrame` 루프에서 상태 갱신 + canvas에 다시 그리기(clear → draw)를 매 프레임 반복
- React state는 "화면 전환"이나 "점수/목숨 표시"처럼 **저빈도로 바뀌는 값**에만 사용 (Phase 11 이후 등장)

메인 화면(Phase 1)은 메뉴/모달 UI라 기존처럼 일반 DOM/React state 방식을 그대로 유지한다. (Canvas는 Mission 1 플레이 화면에만 적용)

---

## 3. 파일 구조

```
src/
├── screens/
│   └── Mission1Screen.tsx      # canvas mount, 게임 루프 시작
├── game/
│   ├── constants.ts             # CANVAS_WIDTH/HEIGHT, PLAYER_SPEED, PLAYER_Y 등
│   ├── loop.ts                  # useGameLoop(onFrame: (dt) => void) 훅
│   ├── input.ts                 # useKeyboardState() 훅 — 현재 눌린 키 Set 반환
│   ├── entities/
│   │   └── player.ts            # Player 타입, createPlayer(), updatePlayer()
│   └── render/
│       └── drawPlayer.ts        # ctx에 player 그리기
```

- `Mission1Screen`은 mount 시 `gameStateRef`(플레이어 등 엔티티 보관)를 만들고 `useGameLoop`으로 매 프레임 `update → clear → draw`를 실행한다.
- 이후 Phase(Wire, 풍선 등)는 `gameStateRef`에 필드를 추가하고, `entities/`, `render/`에 파일을 추가하는 방식으로 확장한다.

---

## 4. 상태 설계

```ts
// game/entities/player.ts
type Player = {
  x: number   // 좌측 기준 x좌표
  y: number   // 고정 (화면 하단)
}

function createPlayer(): Player { ... }
function updatePlayer(player: Player, keys: Set<string>, dt: number): void {
  // ArrowLeft/ArrowRight 입력에 따라 x를 PLAYER_SPEED * dt 만큼 이동
  // 0 ~ CANVAS_WIDTH - PLAYER_WIDTH 범위로 clamp
}
```

- `dt`(이전 프레임과의 시간 간격, ms 또는 초)를 기준으로 이동량을 계산하여, 프레임레이트(모니터 주사율 등)에 관계없이 이동 속도가 일정하게 유지되도록 한다.

---

## 5. 확인 방법

1. 메인 화면에서 `게임 시작` → Mission 1 화면으로 진입, 캐릭터(사각형 placeholder)가 하단에 보이는지
2. ←/→ 키로 좌우 이동이 자연스러운지, 위아래로는 움직이지 않는지
3. 화면 좌/우 끝에서 캐릭터가 화면 밖으로 나가지 않고 멈추는지
4. 브라우저 창 크기를 바꿔도(또는 재실행해도) 이동 속도가 비슷하게 느껴지는지 (dt 기반 이동 확인용)

---

## 6. 검토 요청 사항

- Mission 1 플레이 화면을 canvas 기반으로 구현하는 방향에 대한 동의 여부
- 플레이어 비주얼은 이번 Phase에서 사각형(placeholder)으로 두고, 실제 스프라이트/이미지는 Phase 16(마무리) 즈음 적용하는 것으로 진행해도 될지
