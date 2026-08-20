# 0017: One-Click Collection Publishing via GitHub Git Data API

## Context
Generated proposals previously had to be manually copied into the repo, added to index.html and README, committed, and pushed. The workbench is a pure static frontend with no backend, so the only way to write into the repository is the browser calling GitHub REST APIs directly.

## Decision
We added a 'save to collection' action that composes a single atomic commit through the GitHub Git Data API (blobs -> tree -> commit -> update ref) containing the proposal HTML page, an inserted index.html card, and a README table row. The user supplies a Personal Access Token with contents:write scope, stored only in localStorage. File names use the full Chinese proposal title (Q3-B) and overwrite on re-save (Q4-A); after commit the workbench polls the Actions run and reports deployment status (Q5-A).

## Why
1. Full closed loop: generate -> commit -> auto-deploy to Pages with no manual steps.
2. Single atomic commit keeps the repo history clean instead of three sequential commits.
3. Token stays in the browser, matching the existing API key pattern.