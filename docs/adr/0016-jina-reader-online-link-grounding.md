# 0016: Jina Reader for Online Link Grounding

## Context
Client background material may live online rather than as uploaded files. A pure static frontend cannot fetch arbitrary third-party URLs directly due to CORS, and we deliberately avoid standing up a backend proxy.

## Decision
We decided to fetch online link bodies through the Jina Reader endpoint (`https://r.jina.ai/<url>`), which converts pages to Markdown and returns them with permissive CORS. Links are entered one per row in the workbench, fetched immediately on add, and merged into the existing Grounding context (as `Link Material`) alongside parsed local files before the Research stage.

## Why
1. Zero infrastructure: reuses a mature hosted reader instead of self-hosting a fetch proxy.
2. Immediate fetch gives users fast validation of whether the URL is readable.
3. Merging into the existing Grounding seam keeps AgentPipelineRunner's interface unchanged.