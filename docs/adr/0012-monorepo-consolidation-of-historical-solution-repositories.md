# 0012: Monorepo Consolidation of Historical Solution Repositories

## Context
Originally, 8 separate repositories existed under the Zen-Zeng GitHub account for individual marketing solutions: `dr-cosmo`, `xianxiaozhu`, `binjiangcompany`, `chenshiyiliao`, `helian`, `branding-digital`, `zhongyaokafei`, and `guojimaoyi`. Maintaining individual repositories caused asset duplication, documentation drift, and fragmented deployment lifecycles.

## Decision
We decided to consolidate all historical solution repositories into `smart-marketing-collection` as the single source of truth:
1. Standard single-page solutions reside in the root directory as self-contained HTML showcases.
2. Background documentation, original Word/PDF proposals, and helper scripts reside under `docs/`.
3. High-resolution campaign assets and charts reside under `images/`.
4. Multi-page interactive prototypes (specifically the `branding-digital` Axure project tree) are isolated in `projects/branding-digital/` to avoid polluting the root styling namespace while remaining fully accessible via the web portal.

## Why
1. Eliminates multi-repository maintenance overhead and prevents version drift.
2. Unifies all campaign assets and reference documents into a single grounding library for the AI Marketing Proposal Workbench.
3. Centralizes GitHub Actions deployment to a single GitHub Pages domain.
