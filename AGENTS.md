# Repository Guidelines

## Project Structure & Module Organization

This is a zero-build, static HTML/CSS/JS repository deployed to GitHub Pages. There is no package manager, no bundler, and no compile step.

- Root `.html`: Standalone marketing proposal pages (e.g., `helian.html`, `jdlx.html`, `ai_pingce.html`) and the catalog entry `index.html`.
- `generator.html`: AI marketing proposal workbench (multi-agent pipeline UI, per-account library).
- `assets/js/`: Core JS modules — `agent-pipeline.js` (multi-agent LLM pipeline), `schema.js` (8-pillar ProposalSchema), `pptx-compiler.js` (PPTX export), `collection-publisher.js` (per-account proposal store via GitHub API).
- `assets/css/`: Shared stylesheets and Tailwind CDN configuration.
- `projects/<username>/`: Per-account saved proposals (HTML + `.data.json`).
- `eos-demo/`: EOS multi-platform e-commerce demo pages.
- `docs/`: Raw background materials, briefs, reference documents.
- `images/`: Visual assets, charts, campaign screenshots.
- `tests/`: Node-based unit tests for pipeline, schema, provider config, and publisher logic.
- `.github/workflows/deploy.yml`: GitHub Pages deployment pipeline.

## Build, Test, and Development Commands

All third-party libraries (Tailwind CSS, Chart.js, ECharts, PptxGenJS) load via CDN. No install step required.

```bash
# Local dev server (any static server works)
python3 -m http.server 8000
npx serve .

# Run tests
node tests/schema.test.js
node tests/pipeline.test.js
node tests/link-grounding.test.js
node tests/provider-config.test.js
node tests/collection-publisher.test.js
```

## Coding Style & Naming Conventions

Enforced via `.editorconfig`:

- **Indentation**: 4 spaces for HTML/CSS/JS; 2 spaces for JSON/YAML/Markdown.
- **Encoding**: UTF-8 with LF line endings. Trim trailing whitespace (except Markdown).
- **File naming**: Lowercase kebab-case for new HTML files (e.g., `brand-campaign.html`). Image files: `brandname_purpose.png` (no spaces).
- **New proposal pages** must import `assets/css/shared.css` before custom styles, and `assets/js/shared.js` before `</body>`. Title pattern: `[方案名称] | 智能营销方案集合`.
- **JS modules**: Use IIFE pattern `(function(global) { 'use strict'; ... })(window);` to avoid polluting global scope. Use `window.` prefix for all global references (never bare `global`).
- **LLM provider configuration**: Default base URLs are `https://api.deepseek.com/v1`, `https://api.openai.com/v1`, `https://api.anthropic.com`. SDK and fetch paths handle URL resolution separately.

## Testing Guidelines

Tests are plain Node scripts (no test framework). Each file is self-contained with `assert`-based checks and exits non-zero on failure.

```bash
# Run all tests
for f in tests/*.test.js; do node "$f" || exit 1; done
```

Test files follow the naming convention `<module>.test.js`. Coverage targets: schema validation, pipeline agent flow, provider URL resolution, link grounding via Jina Reader, and collection publisher CRUD logic.

## Commit & Pull Request Guidelines

Follow **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `ci:`. Chinese descriptions are acceptable (e.g., `feat: 新增在线链接素材注入`).

PR requirements:

1. Summarize which pages or modules changed and why.
2. Confirm local browser testing across desktop and mobile viewports.
3. No hardcoded API keys or tokens in client code.
4. Merging to `main` triggers automatic GitHub Pages deployment.

## Architecture Overview

The proposal generator follows a **browser-orchestrated multi-agent pipeline**:

1. **Research Agent** — parses user input, augments with document knowledge and Jina Reader link grounding.
2. **Strategy Agent** — formulates positioning, personas, platform battle plans.
3. **Critic Agent** — audits consistency and emits Proposal Patches (JSON deltas).
4. **Compiler** — dual-engine renderer producing interactive HTML + on-demand PPTX (via PptxGenJS).

All LLM calls go through `LlmAdapter` which prioritizes official SDKs (OpenAI, Anthropic) and falls back to raw `fetch`. The entire pipeline runs client-side — no backend required.

Per-account proposal storage uses the GitHub Contents API (PAT-authenticated) to commit HTML + metadata JSON under `projects/<username>/`. The `admin` account can view all users' proposals; regular accounts see only their own.

