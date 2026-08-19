# 0014: SlideRenderer Registry Architecture for PptxCompiler

## Context
pptx-compiler.js currently serializes 15 slide layouts in a single 350-line function. Single-slide layout tweaks risk breaking adjacent slides, and there is no isolation between composition steps.

## Decision
We decided to factor PptxCompiler into a SlideRegistry table plus per-slide SlideRenderer implementations. Each Renderer encapsulates the coordinate math, color tokens, and vector primitives for one logical page.

## Why
1. Provides strong locality - changes to one slide remain bounded to its Renderer file.
2. Improves testability - each Renderer accepts a pptx instance and a ProposalSchema subobject.
3. Future extensions (e.g. investor deck variant) register new Renderers without touching existing code.