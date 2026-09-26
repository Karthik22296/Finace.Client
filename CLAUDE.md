# CLAUDE.md — Finace.Client Engineering Guidelines

> Universal AI Adapter for **Claude Code** and Anthropic AI assistants.
> Inherits all team roles, invariants, and protocols from [.agents/AGENTS.md](.agents/AGENTS.md).

---

## 1. Primary Commands

Always use these non-interactive commands for verification:

```bash
# Production build (must succeed with 0 errors)
npm run build

# Automated unit tests (must pass with 0 failures)
npm test -- --watch=false --browsers=ChromeHeadless

# Regenerate API client from swagger.json (NEVER edit src/api/ manually)
npm run generate-api
```

---

## 2. Architecture & Source of Truth

The repository operates on a specialized squad system defined in `.agents/`:
- **Master Specification**: [.agents/AGENTS.md](.agents/AGENTS.md)
- **Localized Project Context**: [.agents/project-context.md](.agents/project-context.md)
- **Frontend Squad Rules**: [.agents/rules/frontend-swe-subagents.md](.agents/rules/frontend-swe-subagents.md)
- **Signals & OnPush Invariants**: [.agents/rules/angular-signals-onpush.md](.agents/rules/angular-signals-onpush.md)
- **Knowledge Base**: [.agents/knowledge/](.agents/knowledge/) (signals gotchas, material styling, contract sync, build issues)
- **Skills Directory**: [.agents/skills/](.agents/skills/) (`swe-team-orchestrator`, `swe-meta-agent`, `codebase-graphify`)
- **Technology Radar**: [.agents/knowledge/skill-scout-radar.md](.agents/knowledge/skill-scout-radar.md)

---

## 3. Mandatory Engineering Invariants

### 3.1 Angular 19 & Reactivity Standards ([.agents/rules/angular-signals-onpush.md](.agents/rules/angular-signals-onpush.md))
- **Signal-First**: Component local state must use `signal()`, `computed()`, `input()`, `model()`, or `linkedSignal()`.
- **ChangeDetectionStrategy.OnPush**: Mandatory on every component.
- **Zero In-Place Mutation**: Never mutate signal arrays/objects in place (`items().push(x)` is forbidden). Always update immutably: `items.update(list => [...list, x])`.
- **Template Hygiene**: Zero function calls in templates (`{{ getStatus() }}` forbidden; use `computed()` or pure pipes). All `@for` loops must specify a `track` expression (never track `$index` if unique ID exists).
- **API Client Isolation**: Never manually edit files in `src/api/`. Regenerate via `npm run generate-api`. Import models and services exclusively from barrel files (`../api/models`, `../api/services`).
- **No `!important`**: Never use `!important` in component styles. Use scoped CSS specificity.

### 3.2 Anti-Bloat & LOC Reduction ([AGENTS.md §2.8, §2.9](.agents/AGENTS.md))
Evaluate the **7-Rung Decision Ladder** before adding code:
1. *Does this need to exist?* → No: Skip (YAGNI).
2. *Already in this codebase?* → Reuse it.
3. *Native language/standard library feature?* → Use native TypeScript / ES2022 APIs.
4. *Platform/runtime feature?* → Use native DOM / Web platform APIs.
5. *Installed dependency?* → Reuse Angular CDK or Angular Material primitives.
6. *One line?* → Keep it inline.
7. *Only then:* Write the minimum lines of code that work.

### 3.3 Boundary Model ([.agents/rules/frontend-swe-subagents.md](.agents/rules/frontend-swe-subagents.md))
- **Always**: Read code, modify components/services/templates/specs on task branches, run builds and tests.
- **Ask First**: Modifying `angular.json`, `tsconfig.json`, `package.json`, environment files, routing guards or interceptors.
- **Never**: Commit directly to `main` or default branches; manually edit `src/api/`; use `!important`; bypass `DomSanitizer`; store secrets in client code.

---

## 4. Execution Workflow

When fulfilling any coding task:
1. **Pre-Flight**: Check [.agents/knowledge/](.agents/knowledge/) for known traps in relevant feature areas.
2. **Implement**: Make surgical edits strictly within task scope.
3. **Verify**: Run `npm run build` and headless tests. Zero warnings/errors required.
4. **Audit**: Verify against the 4 Quality Pillars (AGENTS.md §1, Role 5).
5. **Git Commit / PR**: Format with the mandatory 4-part structure:
   - **Title**: Concise feature/fix summary
   - **Summary**: Key changes made
   - **Why the changes**: Architectural or contract rationale
   - **What are the changes to do if any**: Follow-up tasks or pending items
