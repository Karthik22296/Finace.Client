# Angular Signals, OnPush & Zoneless Invariants

> **Scaffolded by the Bootstrap Engine (AGENTS.md §3, Step 4)**
> Inherits universal protocols from [AGENTS.md](../AGENTS.md). This file adds Angular 19-specific reactivity rules only.

---

## 1. Signal-First Reactivity

- All component local state must use `signal()`, `computed()`, `input()`, `model()`, or `linkedSignal()`.
- `BehaviorSubject` + manual `.subscribe()` is prohibited for local component state — use signals.
- When RxJS is required (e.g., complex async streams), use `takeUntilDestroyed()` for lifecycle management or prefer `async` pipe in templates.

## 2. Change Detection: OnPush Mandatory

- Every component must declare `changeDetection: ChangeDetectionStrategy.OnPush`.
- Angular 21+ zoneless: flag direct mutation of signal-backed state (`this.items.push(x)`, `this.obj.prop = x`) — use `.set()` / `.update()` instead.

## 3. Immutability Under OnPush

- **Zero in-place mutations**: `this.items().push(...)` is a critical defect.
- Always replace references: `this.items.update(list => [...list, newItem])`.
- Mutating an `@Input()` object/array in place will not trigger OnPush change detection.

## 4. Template Hygiene

- **Zero function calls in templates**: `{{ getStatus() }}` → use `computed()` signal or pure pipe.
- **All `@for` blocks must have `track`**: `@for (item of items(); track item.id)` — never track by index.
- **Deeply nested `@if`**: extract to a child component or a computed signal.

## 5. Deferred Loading

- Heavy/below-fold standalone components → wrap in `@defer (on viewport)`.
- Routes must lazy-load via `loadComponent`, not eager import.

## 6. HTTP & Data Fetching

- New data-fetching: prefer `resource()` / `httpResource()` over manual `subscribe()` + signal assignment.
- All HTTP calls must have explicit `catchError` / error state — no silent failures.
- Use `HttpClient.get<T>()` — never untyped calls.
- Prefer functional interceptors (`HttpInterceptorFn`).

## 7. Forms

- Reactive forms must be typed: `FormControl<T>`, not implicit `any`.
