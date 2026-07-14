# Phase 23 설계 — UX: 화면 디자인 시스템 통일

> 대상: [docs/PLAN.md](../PLAN.md) Phase 23
> 참고 기획: [docs/PRD-v2.md](../PRD-v2.md) 4절

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 메인/조작 방법/클리어/게임 오버 화면의 색상/폰트/여백을 `src/index.css`의 기존 디자인 토큰(`:root` 변수)으로 통일

**이번 Phase에서 만들지 않는 것**
- 새로운 색상 팔레트나 폰트 도입 (기존 `index.css`에 이미 정의된 `--accent`, `--text-h`, `--border`, `--bg` 등을 그대로 재사용)
- 레이아웃 구조 변경 (버튼 위치/화면 흐름은 그대로, 스타일 값만 정리)

---

## 2. 현황 확인

`src/index.css`에 이미 디자인 토큰이 정의되어 있으나, 일부 화면은 이를 쓰지 않고 색상을 하드코딩하고 있다.

| 파일 | 문제 | 수정 |
|---|---|---|
| `screens/ClearScreen.css` | `color: #08060d`, `background: #aa3bff` 하드코딩 | `var(--text-h)`, `var(--accent)`로 교체 |
| `screens/GameOverScreen.css` | `color: #08060d`, `background: #aa3bff` 하드코딩 (2곳) | `var(--text-h)`, `var(--accent)`로 교체 |
| `screens/MainScreen.css` | `.modal` 배경/테두리는 이미 `var(--bg)`/`var(--border)` 사용 중 | 변경 없음 (기준 예시로 유지) |
| `screens/HowToPlayScreen.css` | `.how-to-play-back-button`은 이미 `var(--border)`/`var(--bg)` 사용 중 | 변경 없음 |

## 3. 수정 예시 (`screens/ClearScreen.css`)

```css
.clear-screen-text {
  font-size: 3rem;
  font-weight: bold;
  color: var(--text-h);
  background: rgba(255, 255, 255, 0.85);
  padding: 0.5em 1em;
  border-radius: 0.5em;
  margin: 0;
}

.clear-screen-button {
  font-size: 1.25rem;
  padding: 0.5em 1.5em;
  border-radius: 0.5em;
  border: none;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}
```

- `GameOverScreen.css`의 `.gameover-screen-text`, `.gameover-screen-button`도 동일하게 `var(--text-h)`, `var(--accent)`로 교체
- 다크 모드(`prefers-color-scheme: dark`)에서 `--accent`/`--text-h` 값이 이미 `index.css`에 정의되어 있으므로, 이 교체만으로 클리어/게임 오버 화면도 다크 모드에 자동 대응됨 (현재는 하드코딩 때문에 다크 모드에서도 라이트 모드 색이 고정 출력되는 상태)

---

## 4. 확인 방법

1. 메인 → 조작 방법 → Mission 1 클리어 → 게임 오버 화면을 순서대로 오가며, 버튼/텍스트 색상 톤이 통일되어 보이는지
2. OS 다크 모드를 켠 상태에서 클리어/게임 오버 화면도 다른 화면과 동일하게 다크 톤으로 바뀌는지

---

## 5. 검토 요청 사항

- 별도 없음 — 이미 존재하는 `index.css` 토큰을 전 화면에 일관 적용하는 단계입니다.
