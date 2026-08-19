# Marketing Proposal Generator Context

The core domain model for generating client-ready strategic marketing proposals through browser-orchestrated multi-agent intelligence.

## Language

### Core Entities

**Proposal**:
The formal, client-facing strategic marketing document and contract artifact containing market analysis, growth strategies, budget allocations, execution timelines, and ROI forecasts.
_Avoid_: Output, text, article, draft

**ProposalSchema**:
The canonical, strongly-typed JSON data contract structured across 8 standard pillars (`meta`, `executive_summary`, `market_insight`, `core_strategy`, `channel_matrix`, `influencer_matrix`, `timeline_phases`, `finance_and_kpi`) before visual compilation.
_Avoid_: Raw data, payload, JSON blob, state

**Industry Template**:
A curated set of design tokens, color palettes, visual layouts, and KPI frameworks tuned for specific vertical markets (Beauty, Consumer Tech, B2B, Healthcare, Cross-border).
_Avoid_: Theme, skin, style pack

**Budget Funnel**:
The mathematically closed quantitative structure within ProposalSchema where channel cost allocations sum to exactly 100% and map directly to tiered conversion metrics and ROI projections.
_Avoid_: Budget sheet, cost estimate, rough numbers

### Pipeline & Agents

**Agent Pipeline**:
The sequenced multi-stage client-side orchestration of specialized AI agents running within the browser.
_Avoid_: Prompt chain, batch runner, macro

**Research Agent**:
The pipeline role responsible for parsing user inputs, extracting core entities, and augmenting context with document knowledge and live search data.
_Avoid_: Parser, scraper, searcher

**Strategy Agent**:
The pipeline role responsible for formulating business positioning, target personas, platform battle plans, and core narrative angles.
_Avoid_: Copywriter, generator, thinker

**Finance Agent**:
The pipeline role responsible for calculating influencer matrix tiers, channel budget splits, conversion funnels, and projected ROI figures.
_Avoid_: Calculator, budgeter

**Critic Agent**:
The pipeline role that performs single-pass logical consistency, numerical feasibility, and industry fit audits against the draft Proposal, emitting targeted Proposal Patches when discrepancies are found.
_Avoid_: Validator, checker, linter

**Proposal Patch**:
A localized, field-specific JSON delta emitted by the Critic Agent to repair verified defects without re-running the upstream generation pipeline.
_Avoid_: Full retry, rewrite, diff

**Compiler**:
The dual-engine renderer that transforms a validated ProposalSchema into an interactive HTML page and a native PPTX deck.
_Avoid_: Exporter, converter, builder

### Deliverables & Data

**Dual Delivery**:
The concurrent generation and export of both a responsive interactive web presentation and an editable native PPTX slide deck from one ProposalSchema.
_Avoid_: Multi-export, file download

**Slide Deck Pacing**:
The 15-20 slide narrative sequence in PPTX export where each slide communicates a single core strategic thesis, matrix, or visual data representation.
_Avoid_: Slide bundle, slide count, deck dump

**On-Demand Compilation**:
The lifecycle pattern where the interactive Web presentation renders immediately upon pipeline completion, and binary PPTX artifacts compile on-demand when requested by the user.
_Avoid_: Async build, deferred save

**Grounding**:
The process of injecting verified facts and constraints from client-provided documents and live search results into agent context windows.
_Avoid_: Prompt stuffing, context injection

**Document Chunk Index**:
The browser-resident extracted heading structure and TF-IDF scored text segments sourced from uploaded client background files (PDF/DOCX/MD).
_Avoid_: Vector store, raw text dump


### Pipeline & Agents (Extended)

**AgentPipelineRunner**:
The deep module responsible for orchestrating all Agent Pipeline stages behind a single execute(payload, callbacks) -> Promise<ProposalSchema> seam, isolating DOM state from inference logic.
_Avoid_: Pipeline manager, runner script

### Deep Modules & Architecture

**LlmAdapter**:
The integration boundary for any third-party LLM client (OpenAI SDK, Anthropic SDK) that standardizes the streaming chat completion surface to the Agent Pipeline.
_Avoid_: API wrapper, LLM client

**SlideRenderer**:
The internal contract for a single PPTX slide layout builder registered into the SlideRegistry, encapsulating coordinate math, vector cards, and table rendering for one logical page.
_Avoid_: Slide template, slide maker

**SlideRegistry**:
The internal table of SlideRenderer implementations that the PptxCompiler dispatches against a ProposalSchema to produce the 15 standard deliverable pages.
_Avoid_: Slide map, slide list
