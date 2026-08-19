# 0007: Eight-Pillar ProposalSchema Specification

## Context
Downstream renderers (Tailwind HTML layouts and PptxGenJS slide builder) require a deterministic, complete schema contract. If sections appear or disappear arbitrarily across runs, visual layouts break and crucial commercial sections may be omitted.

## Decision
We decided to mandate an 8-pillar schema specification for all generated proposals:
1. `meta` (brand, title, industry, date, version, palette)
2. `executive_summary` (key strategic takeaways, campaign slogan)
3. `market_insight` (industry dynamics, competitive matrix, buyer personas)
4. `core_strategy` (positioning, 4P battle plan, core proposition)
5. `channel_matrix` (platform-specific tactics, cadence, formats)
6. `influencer_matrix` (tier breakdown, rate cards, candidate profiles)
7. `timeline_phases` (prep, launch, sustain phases, milestones)
8. `finance_and_kpi` (100% budget breakdown, conversion funnel, ROI targets)

## Why
Guarantees comprehensive, professional coverage matching 4A agency standards and ensures safe rendering across all output targets.
