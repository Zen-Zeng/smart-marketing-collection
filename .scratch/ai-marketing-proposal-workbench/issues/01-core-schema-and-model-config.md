# 01 — Core Schema Specification & Model Configuration

**What to build:** Establish the 8-pillar ProposalSchema validator, industry color themes, and multi-provider LLM API communication layer (DeepSeek, OpenAI, Claude, Custom) with localStorage persistence.

**Blocked by:** None — can start immediately

**Status:** ready-for-agent

## Acceptance criteria

- [ ] ProposalSchemaCore exposes INDUSTRY_THEMES with 7 vertical palettes
- [ ] validateProposalSchema correctly validates all 8 pillars and detects non-100% budget sums
- [ ] API settings modal persists Provider, Base URL, Key, and Model name to localStorage
- [ ] Test Connection button verifies endpoint connectivity
