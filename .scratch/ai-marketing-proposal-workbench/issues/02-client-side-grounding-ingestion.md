# 02 — Client-Side Grounding & Multi-Format Ingestion

**What to build:** In-browser drag-and-drop parsing of PDF, Word (.docx), and Markdown files, extracting heading outlines and TF-IDF scored paragraphs within a 6k token budget.

**Blocked by:** 01 — Core Schema Specification & Model Configuration

**Status:** ready-for-agent

## Acceptance criteria

- [ ] PDF, DOCX, and MD files are parsed asynchronously on the client
- [ ] buildGroundedContext extracts headings and computes keyword relevance
- [ ] Context injection is safely capped at 6,000 tokens
