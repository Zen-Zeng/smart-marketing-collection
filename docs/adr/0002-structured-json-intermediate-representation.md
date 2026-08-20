# 0002: Structured JSON Intermediate Representation (ProposalSchema)

## Context
Earlier versions generated HTML directly from raw text LLM prompts, leading to layout fragility, unverified numbers, and inability to produce non-HTML formats.

## Decision
We decided to mandate a typed JSON intermediate contract (`ProposalSchema`) as the single source of truth between the agent reasoning phase and the presentation generation phase.

## Why
1. Decouples strategic reasoning from visual formatting.
2. Enables the Critic Agent to perform programmatic and semantic validation on structured data (budget sums, milestone dates, KPI metrics).
3. Makes dual delivery (HTML and PPTX) deterministic, robust, and extensible to future export targets.
