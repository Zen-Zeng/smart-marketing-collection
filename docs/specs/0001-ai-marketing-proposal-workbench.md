# Specification: AI Marketing Proposal Workbench (AI 方案大师)

## Problem Statement

Marketing directors, brand consultants, and 4A account leads spend days manually compiling client-facing pitch proposals, researching competitors, structuring 4P strategies, calculating influencer allocation budgets, and designing presentation slide decks. Existing AI chatbots produce fragmented, generic text without numerical grounding or editable slide deliverables, while complex enterprise SaaS tools require extensive server infrastructure and subscription lock-in. Marketing professionals need an instant, privacy-safe, browser-based intelligent workbench that transforms high-level client briefs and background documents into executive-ready, mathematically sound proposals delivered both as interactive web portals and editable native PowerPoint decks.

## Solution

The AI Marketing Proposal Workbench (AI 方案大师) provides an in-browser multi-agent orchestration pipeline that takes raw marketing inputs, parses client-uploaded reference files (PDF, DOCX, Markdown), extracts high-signal factual context using client-side TF-IDF and heading chunking, and executes a 4-stage pipeline (Research -> Strategy -> Critic -> Compiler). The workbench enforces a strongly-typed 8-pillar schema (`ProposalSchema`) ensuring mathematical budget closure and strategic coherence. It features single-pass Critic audit and targeted JSON patching, enabling dual-delivery of both a responsive interactive web presentation and an editable native 16:9 widescreen PowerPoint deck with zero server infrastructure.

## User Stories

1. As a marketing consultant, I want to input brand identity, industry vertical, campaign budget, and timeline in a clean web form, so that the AI understands my core proposal constraints.
2. As an account executive, I want to drag and drop client-provided briefs (PDF, Word, or Markdown) into the workbench, so that the AI automatically extracts relevant factual grounding without manual copy-pasting.
3. As a growth strategist, I want the system to extract key heading outlines and TF-IDF scored paragraphs up to a 6k token budget, so that the AI strategy engine stays within model context limits while referencing crucial brand facts.
4. As an agency lead, I want the Strategy Agent to generate an 8-pillar strongly-typed `ProposalSchema` JSON, so that all strategic, numerical, and narrative data is structured and validated.
5. As a brand manager, I want the proposal to automatically include structured competitor comparison tables (advantages, weaknesses, and破局 points), so that I can demonstrate clear differentiation to my client.
6. As a media planner, I want the system to generate a tiered influencer matrix (Top KOL, Mid-tier, KOC) with unit price estimates, percentage allocations, and selection criteria, so that influencer procurement is actionable.
7. As a financial controller, I want the Finance Agent to ensure channel budget percentage allocations sum to exactly 100%, so that mathematical consistency is guaranteed across the entire proposal.
8. As a pitch director, I want the Critic Agent to conduct a 5-dimension CMO-level quality audit (Relevance, Financial Balance, Differentiation, Feasibility, Conviction), so that weak or ungrounded claims are caught before client presentation.
9. As an efficiency-focused strategist, I want the Critic Agent to emit localized JSON Patches for identified defects rather than rerunning the whole pipeline, so that I save 80% of regeneration time and preserve satisfactory strategic sections.
10. As a presenter, I want to immediately preview the full interactive web presentation inside a live sandbox iframe, so that I can interactively inspect charts and scroll-triggered animations.
11. As a presenter, I want to click "Export PPTX" on-demand to compile the structured schema into a 15-20 slide native PowerPoint presentation, so that I have an editable 16:9 slide deck ready for offline board meetings.
12. As a brand designer, I want the PPTX export to automatically adopt industry-specific design tokens and color palettes (Beauty, 3C/Tech, B2B, Healthcare, Cross-border, F&B, Classic Business), so that the slides look on-brand without manual restyling.
13. As an agency operator, I want to switch between DeepSeek, OpenAI, Anthropic Claude, and custom OpenAI-compatible proxies in the settings modal, so that I can utilize my preferred LLM provider.
14. As a privacy-conscious professional, I want my API keys and configurations stored exclusively in browser local storage and never transmitted to an intermediate proxy, so that client confidentiality is preserved.
15. As a technical evaluator, I want to inspect the raw `ProposalSchema` JSON and raw compiled HTML source in dedicated workbench tabs, so that I can audit or copy the underlying code at any time.
16. As a pitch presenter, I want to print or save the interactive proposal as a clean PDF using browser print styles, so that I have a printable handout for in-person meetings.

## Implementation Decisions

- **Client-Side Multi-Agent Orchestration**: The entire pipeline (Research, Strategy, Critic, Compiler) runs directly in browser JavaScript, making direct HTTPS calls to LLM endpoints and keeping the repository completely static and zero-cost on GitHub Pages (ADR-0001).
- **8-Pillar ProposalSchema Contract**: Decoupled reasoning from presentation by enforcing a rigid schema with 8 top-level pillars: `meta`, `executive_summary`, `market_insight`, `core_strategy`, `channel_matrix`, `influencer_matrix`, `timeline_phases`, and `finance_and_kpi` (ADR-0002, ADR-0007).
- **In-Browser Native PPTX Compilation via PptxGenJS**: Embedded PptxGenJS via CDN to translate `ProposalSchema` directly into Open XML `.pptx` files with vector cards, native tables, and 16:9 layout hierarchy on-demand (ADR-0003, ADR-0008, ADR-0009, ADR-0011).
- **Targeted Critic JSON Patching**: The Critic Agent audits schema invariants and emits field-level replacement objects that are merged in-place via `applyProposalPatch`, avoiding wasteful full retries (ADR-0004, ADR-0005).
- **Hybrid Grounding & Token Budgeting**: Implemented client-side text chunking combining heading hierarchy extraction with TF-IDF keyword scoring against prompt keywords, capping injected context at 6,000 tokens (ADR-0006).
- **Modular Architecture**: Separated domain definitions and schema validation into `assets/js/schema.js`, slide compilation into `assets/js/pptx-compiler.js`, and UI pipeline handling into `generator.html` (ADR-0010).

## Testing Decisions

- **Behavioral Boundary & Testing Seam**: Testing is centered on the canonical intermediate contract: `ProposalSchemaCore.validateProposalSchema(data)` and `ProposalSchemaCore.applyProposalPatch(data, patch)`. All mathematical invariants (e.g., 100% budget closure, non-empty 8 pillars) are tested against raw objects without DOM dependencies.
- **Client Parsing Verification**: File extraction routines for PDF and DOCX are verified by evaluating extracted text length and chunk boundary integrity under browser-compatible runtimes.
- **PPTX Generation Validation**: The slide compiler is verified by ensuring `exportProposalToPptx` accepts any valid `ProposalSchema` and resolves without throwing unhandled exceptions.
- **Visual Presentation QA**: HTML compilation output is validated for mandatory stylesheet linkage (`assets/css/shared.css`), auth guards, script tags, responsive Tailwind utility classes, and absence of inline script closing syntax collisions.

## Out of Scope

- Hosting a dedicated server-side database or Python backend (all state is browser-local).
- Multi-user real-time collaborative editing sessions over WebSockets.
- Direct programmatic publishing of social media ads or automated influencer outreach.
- Vector database embedding generation requiring external paid embedding APIs.

## Further Notes

- The workbench is backwards-compatible with existing static proposal showcases in the repository.
- Default model provider is DeepSeek-Chat, providing fast reasoning latency and cost efficiency for Chinese marketing contexts.
