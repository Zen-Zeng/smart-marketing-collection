# 0018: Per-Account Proposal Library (Supersedes ADR-0017)

## Context
One-click 'save to collection' previously committed proposals into the repo root and updated the shared index.html/README. The user clarified the intended logic: proposals should follow the logged-in account, with each account seeing only its own saved proposals.

## Decision
We replaced the collection-page publishing flow with a per-account proposal library:
1. Proposals are stored under `projects/<username>/` in the repo, named by Chinese proposal title slug.
2. The library is read via the GitHub Contents API scoped to the current `sessionStorage.smc_user`; a 404 for a missing account directory is treated as an empty list.
3. Each save writes `<slug>.html` plus `<slug>.data.json` (schema + html snapshot) in one atomic commit via the Git Data API.
4. The old 'save to collection page' button and index/README injection were removed; the GitHub PAT setting is retained solely for per-account library writes.

## Why
1. Account-scoped storage matches the login model and keeps accounts isolated.
2. Saving HTML and data JSON enables later download/re-open of generated proposals.
3. Single atomic commit keeps history clean and Pages deployment automatic.