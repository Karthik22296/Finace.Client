# Signals & Reactive State Knowledge Memory

Curated lookup of verified gotchas, anti-patterns, and proven fixes for Angular 19+ Signals and reactive state management. Consult this file before refactoring or implementing state logic.

---

### 1. In-Place Signal Mutation in Zoneless/OnPush
- **Symptom**: Calling `.push()`, `.pop()`, or mutating an object property on a signal does not trigger change detection or update downstream views.
- **Root Cause**: Signals rely on reference equality (`Object.is`). In-place mutation preserves the same array/object reference, so signal consumers are never notified.
- **Proven Fix**:
  ```diff
  // WRONG: In-place mutation
  - this.customers().push(newCustomer);
  
  // CORRECT: Immutable update via .update()
  + this.customers.update(list => [...list, newCustomer]);
  ```

---

### 2. Infinite Change Detection Loop in `computed()`
- **Symptom**: `NG0600: Writing to signals is not allowed in a `computed` or `effect` by default`.
- **Root Cause**: Calling `.set()` or `.update()` inside a `computed()` signal causes recursive dependency cycles.
- **Proven Fix**:
  ```diff
  // WRONG: Mutating another signal inside computed
  - readonly total = computed(() => {
  -   this.lastUpdated.set(Date.now());
  -   return this.items().reduce((acc, i) => acc + i.amount, 0);
  - });

  // CORRECT: Pure derivation only
  + readonly total = computed(() => 
  +   this.items().reduce((acc, i) => acc + i.amount, 0)
  + );
  ```

---

### 3. Derived State that Requires Local Overrides (`linkedSignal`)
- **Symptom**: A form or component input needs to initialize from a parent signal, but allows local user edits without permanently breaking the reactive link.
- **Root Cause**: Using `computed()` makes the state read-only; using a standard `signal()` detaches it from future parent changes.
- **Proven Fix**:
  ```diff
  // WRONG: Manual subscribe and local signal assignment
  - readonly selectedOption = signal<string>('');
  - constructor() {
  -   effect(() => this.selectedOption.set(this.defaultOption()));
  - }

  // CORRECT: Use linkedSignal (Angular 19+)
  + readonly selectedOption = linkedSignal(() => this.defaultOption());
  // Can still be locally mutated: this.selectedOption.set('custom');
  ```

---

### 4. Leaking RxJS Subscriptions in Component Logic
- **Symptom**: HTTP calls or observable streams continue firing after component destruction, leading to memory leaks and zombie updates.
- **Root Cause**: Missing teardown logic on manual `.subscribe()`.
- **Proven Fix**:
  ```diff
  // WRONG: Unmanaged subscription
  - this.customerService.getById(id).subscribe(c => this.customer.set(c));

  // CORRECT: takeUntilDestroyed or toSignal
  + private readonly destroyRef = inject(DestroyRef);
  + this.customerService.getById(id)
  +   .pipe(takeUntilDestroyed(this.destroyRef))
  +   .subscribe(c => this.customer.set(c));
  
  // OR PREFERRED: Convert directly to signal
  + readonly customer = toSignal(this.customerService.getById(id));
  ```
