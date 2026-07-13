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
