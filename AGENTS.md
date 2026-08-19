# Repository Guidelines

## Project Structure & Module Organization

This repository is a zero-build, static showcase for multi-industry marketing solutions hosted on GitHub Pages.

- `*.html`: Standalone solution pages (e.g., `generator.html`, `QuarkAI.html`) and the entry catalog `index.html`.
- `assets/css/shared.css`: Global design tokens, layout variables, and utility classes (`.section-fade`, `.card-hover`, `.chart-container`).
- `assets/js/shared.js`: Shared runtime scripts (scroll-triggered animations, back-to-top button, dynamic nav shadow).
- `docs/`: Raw background materials, briefs, and reference documents (`.md`, `.docx`, `.pdf`).
- `images/`: Visual assets, charts, and campaign screenshots.
- `.github/workflows/deploy.yml`: GitHub Pages deployment pipeline.

## Build, Test, and Development Commands

Third-party dependencies (Tailwind CSS, Chart.js, ECharts) load via CDN, requiring no package manager install or compile step.

- `python3 -m http.server 8000`: Starts a local HTTP server at `http://localhost:8000`.
- `npx serve .`: Alternative local dev server for static asset preview.

## Coding Style & Naming Conventions

Adhere to `.editorconfig` standards:
- **Indentation**: 4 spaces for HTML, CSS, and JS; 2 spaces for JSON, YAML, and Markdown.
- **Encoding & Line Breaks**: UTF-8 encoding with LF line endings.
- **File Naming**: Lowercase kebab-case for new solution files (e.g., `brand-campaign.html`) and `brandname_purpose.png` (no spaces) for images.
- **HTML Structure**: New pages must import `assets/css/shared.css` before custom styles in `<head>` and `assets/js/shared.js` right before `</body>`. Follow title pattern `[方案名称] | 智能营销方案集合`.

## Testing Guidelines

- **Visual QA**: Test responsive layouts across desktop and mobile viewports in a real browser.
- **Path Verification**: Ensure all asset paths to `assets/` and `images/` are relative, and update navigation entries in `index.html` and `README.md`.
- **Console & Script Audits**: Check browser console for errors, avoid unescaped inline `</script>` strings, and ensure CDN scripts load properly.

## Commit & Pull Request Guidelines

- **Commit Messages**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `ci:`). Concise English or Chinese descriptions are supported (e.g., `feat: add AI方案大师 generator tool` or `fix: API Key filter`).
- **Pull Requests**: Summarize page changes, note local verification results, and ensure no hardcoded API keys exist in client code. Merging into `main` triggers automated deployment to GitHub Pages.
