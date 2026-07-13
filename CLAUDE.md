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

## 테스트 방법

현재 이 저장소에는 별도의 테스트 프레임워크(Vitest/Jest 등)가 설정되어 있지 않다. `package.json`에도 `test` 스크립트가 없다. 변경 사항을 검증할 때는 다음으로 대체한다:

- `npm run build` — TypeScript 타입 에러와 빌드 실패 여부 확인
- `npm run lint` — Oxlint 규칙 위반 확인
- `npm run dev`로 직접 브라우저에서 동작 확인

## 구조 및 아키텍처

- `src/main.tsx` — 엔트리 포인트. `StrictMode`로 감싼 `App`을 `#root`에 렌더링
- `src/App.tsx` — 최상위 컴포넌트 (현재 단일 컴포넌트 구조, 별도 라우팅/상태관리 라이브러리 없음)
- `vite.config.ts` — `@vitejs/plugin-react` 플러그인만 등록된 기본 설정
- `tsconfig.json`은 `tsconfig.app.json`(앱 코드)과 `tsconfig.node.json`(Vite 설정 등 Node 환경 코드)으로 프로젝트 레퍼런스 분리
- `public/` — 그대로 정적 서빙되는 파일 (favicon, icons.svg 등)
- `src/assets/` — 빌드 시 번들링되는 이미지 등 정적 자원

## Windows 환경 관련 참고사항

이 프로젝트를 Windows에서 `npm install`할 때 optional native binding(`@rolldown/binding-win32-x64-msvc`, `@oxlint/binding-win32-x64-msvc`)이 npm 자체 버그로 설치되지 않고 누락되는 경우가 있었다. 이 경우 `npm run dev`/`vite build` 실행 시 `Cannot find module '@rolldown/binding-win32-x64-msvc'` 에러가 발생한다. 해결이 안 되면 해당 패키지를 레지스트리에서 직접 받아 `node_modules`에 수동으로 풀어 넣는 방식으로 우회했다.
