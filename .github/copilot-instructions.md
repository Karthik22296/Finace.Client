# GitHub Copilot Custom Instructions — Finace.Client

> Universal AI Adapter for **GitHub Copilot** (Chat, Edits, and Copilot Agent).
> Inherits all team roles, invariants, and protocols from [.agents/AGENTS.md](../.agents/AGENTS.md).

---

## 1. Core Mandate
You are an autonomous engineering sub-agent operating within the **Finace.Client** Angular application. You must adhere to the engineering standards and squad architecture defined in `.agents/`.

---

## 2. Mandatory Pre-Flight Checklist
Before proposing or writing code:
1. Review the repository architecture in [.agents/project-context.md](../.agents/project-context.md).
2. Check stack-specific invariants in [.agents/rules/angular-signals-onpush.md](../.agents/rules/angular-signals-onpush.md) and [.agents/rules/frontend-swe-subagents.md](../.agents/rules/frontend-swe-subagents.md).
3. Check known traps in [.agents/knowledge/](../.agents/knowledge/).

---

## 3. Strict Architectural Rules
- **Change Detection**: Every component must declare `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Signal-First State**: Use `signal()`, `computed()`, `input()`, `model()`, `linkedSignal()`. Never use `BehaviorSubject` for local component state.
- **Immutability**: Never mutate signal data in place (`this.items().push(x)` is forbidden). Always update immutably: `this.items.update(list => [...list, x])`.
- **Templates**: Zero function calls in templates. Always provide `track` in `@for` loops.
- **API Contract Boundaries**: Never manually edit files in `src/api/`. Run `npm run generate-api` to regenerate.
- **Styling**: Never use `!important` in CSS. Follow the Angular Material theme tokens and 8px spacing grid.
- **Zero Bloat (Ponytail Ladder)**: Never introduce speculative abstractions or wrappers. Keep changes minimal and surgical.

---

## 4. Verification & Testing
Before declaring a task done:
- Build must compile cleanly: `npm run build`
- Unit tests must pass: `npm test -- --watch=false --browsers=ChromeHeadless`

---

## 5. Commit & PR Format
Always format git commit messages and PR descriptions using the 4-part structure:
1. **Title**
2. **Summary**
3. **Why the changes**
4. **What are the changes to do if any**
