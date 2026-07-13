# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기술 스택

- **React 19** + **TypeScript** + **Vite 8** (react-ts 템플릿)
- 번들러: Vite의 rolldown 기반 빌드 (`@rolldown/binding-win32-x64-msvc` optionalDependency로 고정)
- 린터: **Oxlint** (ESLint 대체, `.oxlintrc.json`에서 설정)
- Node 요구 버전: `^20.19.0 || >=22.12.0` (현재 로컬 Node는 20.14.0으로 낮아 EBADENGINE 경고 발생, 동작에는 지장 없음)

## 자주 쓰는 명령어

```
npm install       # 의존성 설치
npm run dev       # 개발 서버 실행 (Vite)
npm run build     # 타입 체크(tsc -b) 후 프로덕션 빌드
npm run preview   # 빌드 결과 로컬 프리뷰
npm run lint      # Oxlint 정적 분석
```

## 기획 문서

- [docs/PRD.md](docs/PRD.md) — 전체 게임 개요 PRD
- [docs/FEATURES/main.md](docs/FEATURES/main.md) — 메인 화면 구성
- [docs/FEATURES/game_rule.md](docs/FEATURES/game_rule.md) — 게임 룰 상세
- [docs/FEATURES/mission1.md](docs/FEATURES/mission1.md) — Mission 1 난이도 규칙
- [docs/PLAN.md](docs/PLAN.md) — Phase 별 목표를 세운 문서
- [docs/design/](docs/design/) — Phase별(phaseN.md) 상세 설계 문서. [docs/PLAN.md](docs/PLAN.md)에 Phase가 추가되면 대응하는 설계 문서도 함께 추가된다.

## 작업 규칙

- 사용자가 지시한 작업이 끝날 때마다 반드시 변경사항을 git commit 후 push한다.
