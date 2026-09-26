---
name: codebase-graphify
description: Builds a deterministic AST knowledge graph of the codebase using tree-sitter. Performs instant blast radius analysis, dependency path tracing, and God node identification without burning LLM tokens.
---

# Codebase AST Graphing Skill (Graphify)

> Scaffolded by the Bootstrap Engine (AGENTS.md §3, Step 4).

Use this skill for **pre-flight blast radius analysis** before any implementation task (AGENTS.md §5, Step 2).

---

## Commands

```bash
# Full codebase graph
graphify .

# Trace dependency path between two symbols
graphify path "SourceComponent" "TargetService"

# Natural language query
graphify query "what components depend on CustomerService?"
```

## When to Use

- **Before every Plan-and-Grill (AGENTS.md §2.1)**: Identify all downstream dependents of the files you plan to modify.
- **God Node Detection**: High-centrality services/components that are risky to change.
- **Blast Radius Estimation**: Count affected files before proposing a refactor.

## Output

Graphify returns a deterministic AST-based dependency graph. Parse the output to identify:
1. Direct consumers of modified symbols.
2. Transitive dependency chains.
3. Architectural clusters (feature boundaries).
