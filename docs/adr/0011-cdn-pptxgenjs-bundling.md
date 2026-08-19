# 0011: PptxGenJS CDN Integration

## Context
PPTX compilation requires a reliable, client-side Office Open XML generator.

## Decision
We decided to load `pptxgen.bundle.js` (v3.12.0) via CDN (`https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js`).

## Why
Maintains zero npm build setup and aligns with the project's existing CDN dependency strategy (Tailwind, PDF.js, Mammoth, Chart.js).
