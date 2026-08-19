# 0005: Targeted JSON Patching for Critic Remediation

## Context
When the Critic Agent discovers defects (such as an unbalanced budget or unrealistic influencer cost assumptions), re-running the entire Strategy and Research pipeline costs excessive time, tokens, and risks regressing already satisfactory narrative sections.

## Decision
We decided that the Critic Agent will emit localized JSON Patches (e.g., replacement objects for `budget_allocation` or `kpi_targets`) to repair specific schema subtrees in-place.

## Why
1. Reduces remediation latency and Token consumption by ~80%.
2. Preserves confirmed strategic positioning while selectively correcting mathematical or domain errors.
3. Provides an auditable remediation trace.
