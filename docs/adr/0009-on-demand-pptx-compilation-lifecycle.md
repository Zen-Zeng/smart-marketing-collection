# 0009: On-Demand PPTX Compilation Lifecycle

## Context
Generating complex binary PPTX files with vector shapes and tables consumes browser memory and CPU time. Generating it eagerly alongside HTML generation delays the first visible result.

## Decision
We decided to adopt an on-demand compilation pattern: render the interactive HTML presentation immediately when the Agent Pipeline finishes, while offering an "Export PPTX" action that compiles the `ProposalSchema` into `.pptx` in ~1-2 seconds on-demand.

## Why
Improves perceived response speed, allows users to inspect the generated proposal first, and avoids unnecessary binary packaging overhead.
