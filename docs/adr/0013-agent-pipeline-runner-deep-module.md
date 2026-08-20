# 0013: AgentPipelineRunner Deep Module with Progress Callback Seam

## Context
The marketing proposal pipeline currently lives inline in generator.html (870+ lines), mixing DOM state updates, multi-provider LLM requests, JSON parsing, and Patch merging. The codebase cannot unit-test the agent lifecycle headlessly, and any change risks regressing UI behaviour.

## Decision
We decided to extract the entire pipeline behind a single AgentPipelineRunner deep module with a strictly typed callback seam:

execute(formValues, uploadedFiles, { onStageChange, onProgress, onChunk, signal }) -> Promise<{ schema, html, critic }>

The UI retains only the thin presentation layer. All Prompt orchestration, streaming, and Patch reconciliation live behind the seam.

## Why
1. Decouples UI rendering from inference logic, enabling headless Node test coverage.
2. Maximizes leverage for callers while minimizing implementation surface exposed.
3. Aligns with the codebase-design "small interface, deep module" principle.