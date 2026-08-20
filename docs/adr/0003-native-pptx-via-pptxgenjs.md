# 0003: In-Browser Native PPTX Generation via PptxGenJS

## Context
Clients routinely require editable PowerPoint slides for internal executive reviews and offline pitch presentations. We evaluated server-side Python pptx generation, browser print-to-PDF, and client-side PptxGenJS.

## Decision
We decided to bundle `PptxGenJS` on the client to compile `ProposalSchema` directly into native, editable 16:9 `.pptx` files with vector cards, structured tables, and master slide layouts.

## Why
Browser print-to-PDF produces non-editable rasterized or fragmented pages that cannot be edited or customized by marketing executives. PptxGenJS executes entirely in-browser with zero backend dependencies and produces standard Office Open XML files.
