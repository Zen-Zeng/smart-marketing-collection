# 0004: Strongly-Typed Numerical ProposalSchema

## Context
A marketing proposal is both a narrative pitch and a financial business plan. If numbers (budgets, dates, ROI, conversion rates) are embedded as unstructured prose, downstream charts and slide generators fail or render hallucinated metrics.

## Decision
We decided that `ProposalSchema` must enforce strictly typed numerical data for budget splits, timeline phases, influencer pricing matrices, and KPI funnels.

## Why
1. Allows Critic Agent to programmatically verify mathematical invariants (e.g. sum of channel budgets == 100%).
2. Enables PptxGenJS and Chart.js to render native vector charts and tables directly without brittle regex extraction.
3. Guarantees professional credibility when presented to client decision-makers.
