# 0010: Modular Schema and Compiler Separation

## Context
As the proposal engine expands to handle multi-agent orchestration and dual-format compilation (Web + PPTX), maintaining all interfaces, validation logic, and PPTX compilation rules inside a single monolithic HTML file harms maintainability.

## Decision
We decided to modularize core data structures into `assets/js/schema.js` and compiler routines into `assets/js/pptx-compiler.js`, while keeping `generator.html` focused on UI orchestration and stream handling.

## Why
1. Clean separation of concerns between domain schema, presentation rendering, and UI workflow.
2. Reusable schema validation and PPTX compilation for both interactive generator and offline batch processing.
