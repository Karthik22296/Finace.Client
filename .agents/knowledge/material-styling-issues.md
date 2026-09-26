# Angular Material & UI/UX Styling Knowledge Memory

Curated lookup of verified gotchas, anti-patterns, and proven fixes for Angular Material components, monochrome theming, and responsive layouts.

---

### 1. Breaking Cascade with `!important` on Material Overrides
- **Symptom**: Child components cannot modify button or input styles; dark/light mode transitions break; styles become unmaintainable.
- **Root Cause**: Using `!important` overrides Angular Material's CSS specificity rules and prevents component theme propagation.
- **Proven Fix**:
  ```diff
  // WRONG: Forcing style with !important
  - .custom-button {
  -   background-color: #000000 !important;
  -   color: #ffffff !important;
  - }

  // CORRECT: Target with scoped selector specificity
  + .custom-toolbar button[mat-flat-button] {
  +   background-color: #000000;
  +   color: #ffffff;
  + }
  ```

---

### 2. Horizontal Page Scrolling on Mobile Devices (<360px)
- **Symptom**: Users must scroll horizontally to read cards or submit forms on small smartphone viewports.
- **Root Cause**: Fixed widths (e.g. `width: 500px`), hardcoded multi-column CSS grids without `@media` queries, or uncontained tables.
- **Proven Fix**:
  ```diff
  // WRONG: Fixed pixel width
  - .form-card { width: 450px; }

  // CORRECT: Fluid mobile-first width with max-width
  + .form-card {
  +   width: 100%;
  +   max-width: 480px;
  +   padding: 16px;
  + }
  
  // Wrap wide tables in dedicated overflow container
  + <div class="table-responsive-container">
  +   <table mat-table ...></table>
  + </div>
  ```

---

### 3. Missing Angular Material Directive on Action Buttons
- **Symptom**: Raw HTML `<button>` tags look unstyled, lack ripple animations, have incorrect hover states, and fail accessibility contrast audits.
- **Root Cause**: Omitting Angular Material button directives.
- **Proven Fix**:
  ```diff
  // WRONG: Raw HTML button
  - <button (click)="openDialog()">Add Customer</button>

  // CORRECT: Add mat-flat-button or mat-stroked-button
  + <button mat-flat-button (click)="openDialog()">
  +   <mat-icon>add</mat-icon>
  +   Add Customer
  + </button>
  ```

---

### 4. Low-Contrast Semantic Indicators
- **Symptom**: Status badges (e.g. Approved, Overdue) rely on faint red/green text alone, failing WCAG AA accessibility standards.
- **Root Cause**: Communicating status using color alone without accompanying icons or sufficient background contrast.
- **Proven Fix**:
  ```diff
  // WRONG: Color alone
  - <span class="status-danger">{{ status }}</span>

  // CORRECT: Icon + high-contrast text + semantic chip
  + <span class="status-badge danger">
  +   <mat-icon class="status-icon">error</mat-icon>
  +   {{ status }}
  + </span>
  ```
