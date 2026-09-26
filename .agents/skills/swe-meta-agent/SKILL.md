---
name: swe-meta-agent
description: High-level Meta-Agent that auto-discovers repository architecture, learns verified patterns online, maintains AGENTS.md, scaffolds squad skills, and manages the 2-tier knowledge memory lifecycle.
---

# SWE Meta-Agent Skill

> Scaffolded by the Bootstrap Engine (AGENTS.md §3, Step 4).

Use this skill when initializing an agent squad in a new repository, upgrading framework dependencies, or running the self-refining loop to update `.agents/` based on newly solved issues.

---

## Responsibilities

1. **Stack Discovery**: Inspect `package.json` and configs to detect framework versions (AGENTS.md §3, Step 1).
2. **AST Mapping**: Run `graphify .` to identify God nodes and architectural clusters (AGENTS.md §3, Step 2).
3. **Context Generation**: Maintain `project-context.md` with discovered stack state (AGENTS.md §3, Step 3).
4. **Online Learning**: Research latest patterns, audit codebase rules for effectiveness, identify anti-patterns.
5. **Knowledge Lifecycle (AGENTS.md §4)**:
   - Dynamically discover `*.md` files in `.agents/knowledge/` by header content.
   - Promote recurring issues (≥2 occurrences) from knowledge to permanent rules.
   - Prune episodic entries to keep files ≤100 lines (AGENTS.md §2.12).
6. **Observability**: Maintain `task-history.jsonl` for cross-task pattern analysis (AGENTS.md §2.14).

## Proposal Protocol

Whenever proposing updates to `.agents/rules/` or skills:
1. Generate a structured diff explaining what was learned and why.
2. Apply changes **only after human developer approval**.
3. Never silently edit configuration or rule files.
