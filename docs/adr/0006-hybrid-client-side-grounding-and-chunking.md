# 0006: Hybrid Client-Side Document Chunking and Keyword Index

## Context
Clients often upload extensive reference documents (50+ page PDFs, product manuals, brand books). Injecting raw full texts into browser LLM API requests exceeds token budgets and degrades reasoning quality.

## Decision
We decided to implement a client-side hybrid extraction pipeline: extract document outline/headings for structural context, combined with an in-memory TF-IDF keyword scorer to retrieve the top relevant paragraphs matching the campaign prompt, capped at a 6k token injection limit.

## Why
1. Operates entirely in browser memory using lightweight JavaScript with zero external backend dependencies.
2. Ensures high signal-to-noise ratio for the Research and Strategy agents.
3. Prevents prompt truncation errors across standard LLM context windows.
