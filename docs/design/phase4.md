# Phase 4 설계 — Wire 한 발 제한

> 대상: [docs/PLAN.md](../PLAN.md) Phase 4

## 1. 범위 확인

**이번 Phase에서 만드는 것**
- 화면에 Wire가 동시에 한 발만 존재하도록 명시적으로 보장
- Wire가 소멸(천장 도달)해야 재발사 가능하다는 규칙을 테스트 가능하게 다듬음

**참고**: Phase 3에서 이미 `gameStateRef.wire: Wire | null` 구조를 사용했기 때문에,
데이터 구조상으로는 "한 발만 존재"가 자연스럽게 성립한다. 이번 Phase는 그 규칙이
의도한 대로 정확히 동작하는지 **발사 조건 검증 로직을 명확히 코드화하고 테스트**하는 데 집중한다.

---

## 2. 발사 조건 로직

```ts
// Mission1Screen의 게임 루프 내부
if (spacePressed && gameStateRef.wire === null) {
  gameStateRef.wire = createWire(...)
}
```

- `gameStateRef.wire !== null`인 동안 `spacePressed`가 true여도 무시된다 (조건에 `wire === null` 포함)
- Wire가 천장에 닿아 `active = false`가 되는 프레임에 `gameStateRef.wire = null`로 즉시 정리 → 바로 다음 프레임부터 재발사 가능

## 3. 변경 파일
- 신규 파일 없음. `Mission1Screen.tsx`(또는 게임 루프 콜백)의 발사 조건 분기만 확인/보강

---

## 4. 확인 방법

1. Wire를 발사한 직후, Wire가 화면에 남아있는 동안 스페이스바를 여러 번 눌러도 추가로 나가지 않는지
2. Wire가 천장에 닿아 사라진 즉시 스페이스바를 누르면 정상적으로 재발사되는지
3. (Phase 8 이후 연동 예정) Wire가 풍선에 맞아 사라졌을 때도 동일하게 재발사 가능한지는 Phase 8에서 함께 재확인

---

## 5. 검토 요청 사항

- 별도 없음 — Phase 3 구조를 그대로 검증하는 단계이므로, 실제 플레이 테스트로 규칙 준수 여부만 확인 부탁드립니다.
