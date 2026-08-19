# 04 — Critic Quality Audit & Targeted JSON Patching

**What to build:** Critic Agent performs a 5-dimension CMO evaluation (0-100) and emits targeted JSON patches to repair identified schema defects in-place.

**Blocked by:** 03 — Strategy & Finance Reasoning Pipeline

**Status:** ready-for-agent

## Acceptance criteria

- [ ] Critic evaluates relevance, financial balance, differentiation, feasibility, and conviction
- [ ] applyProposalPatch deeply merges localized patches without regressing intact fields
- [ ] Critic score and highlights card render in the workbench
