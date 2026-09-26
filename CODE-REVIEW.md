# Finace.Client — Code Review

**Review date:** 2026-09-26
**Stack:** Angular 19, Angular Material, standalone components

## Executive summary
The frontend has a good foundation: standalone Angular, lazy-loaded feature areas, Angular Material, core/layout/pages/shared separation, signals/OnPush direction, and a generated API client. The biggest improvements are authentication lifecycle, route/session state, production logging, large-list performance, and consistency between architecture documentation and runtime configuration.

## Priority
- **P0:** Remove token/auth logging; implement refresh-token flow; stop deriving roles from usernames.
- **P1:** Centralize current-user/session state; strengthen route guards; standardize API error/loading states.
- **P1:** Optimize customer/loan/collection tables with server-side filtering/pagination and stable rendering.
- **P2:** Audit bundle size, duplicate API requests, accessibility, and architecture documentation.
- **P3:** Add CI build/test/lint/dependency/secret checks.

## Findings
### 1. Authentication storage — P0
The access token is stored in localStorage. JavaScript-readable tokens increase the impact of XSS. Prefer short-lived access tokens plus a refresh-token strategy backed by a Secure/HttpOnly/SameSite cookie where practical.

### 2. Refresh flow — P0/P1
The backend has refresh-token support, but the interceptor currently logs out on 401 instead of refreshing and retrying the original request. Implement a single-flight refresh flow so concurrent 401s do not create multiple refresh requests.

### 3. Role handling — P0
Do not infer role from username text. Consume server-provided identity/claims. Client-side roles should only control UX; the API must enforce authorization.

### 4. Sensitive logging — P0
Remove request/token authentication diagnostics from production. Never log access tokens, refresh tokens, authorization headers, or sensitive finance payloads.

### 5. Route guards
Use an authenticated-session guard plus role/policy guards. Do not treat token presence in localStorage as proof of authorization.

### 6. Session state
Create one current-user/session state source containing authenticated state, user, role, branch, permissions, token expiry, loading, and session errors. Avoid individual components decoding tokens or inventing identity.

## Optimization opportunities
### Collection/customer/loan tables
- Use OnPush and stable row tracking.
- Debounce search/filter input.
- Prefer server-side filtering, sorting and pagination for growing datasets.
- Avoid one HTTP request per row.
- Avoid repeated calculations directly inside templates.
- Consider virtual scrolling only when row counts justify it.

### API request efficiency
- Audit route initialization for duplicate requests.
- Share dashboard data rather than requesting the same summary independently for every widget.
- Cache short-lived static lookups such as branches and reference data.
- Do not aggressively cache mutable balances or collection totals.

### Bundle size
Lazy-load heavy reports/export/chart functionality. Check Angular production budgets, unused Material modules, duplicate dependencies, large icon sets, and chart/PDF libraries.

### Error and empty states
Every data screen should distinguish loading, empty, loaded, validation error, authorization error, and server/network error. An API failure must not look like an empty table.

## Accessibility
Audit form labels, required-field announcements, keyboard navigation, dialog focus, icon-only button labels, table semantics, mobile touch targets, contrast, and status indicators that currently rely on color.

## Testing gaps
- Login/logout and expired-token behavior.
- Refresh success/failure and concurrent 401 handling.
- Route/role guards.
- Collection validation and API failure recovery.
- Table filtering, pagination, sorting and empty/error states.
- Mobile collection workflow.

## Architecture consistency
app.config.ts currently uses provideZoneChangeDetection({ eventCoalescing: true }). If project documentation claims strict zoneless operation, align documentation and implementation.

## Recommended order
1. Remove sensitive auth logging.
2. Implement refresh-token flow.
3. Replace username-derived role logic.
4. Strengthen route guards and centralized session state.
5. Standardize API error handling.
6. Add server-side pagination/filtering to large lists.
7. Audit duplicate requests and bundle size.
8. Add authentication and collection tests.
9. Add CI quality/security gates.

## Reference files
- src/app/app.config.ts
- src/app/app.routes.ts
- src/app/core/services/auth.service.ts
- src/app/core/interceptors/auth.interceptor.ts

Repository: https://github.com/Karthik22296/Finace.Client