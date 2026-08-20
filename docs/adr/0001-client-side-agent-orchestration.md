# 0001: Client-Side Multi-Agent Orchestration

## Context
We need to run a multi-stage AI agent pipeline (Research -> Strategy -> Finance -> Critic -> Compiler) to generate professional marketing proposals. We evaluated hosting an independent Python/Node.js backend service vs orchestrating the entire lifecycle client-side in the browser.

## Decision
We decided to implement the entire multi-agent orchestration within browser-side JavaScript, communicating directly with LLM provider APIs (DeepSeek, OpenAI, Claude, custom OpenAI-compatible proxies) using user-configured API keys stored in `localStorage`.

## Why
This preserves the repository's zero-cost, zero-maintenance static architecture on GitHub Pages. It eliminates server infrastructure overhead, minimizes operational attack surface, and allows immediate client-side streaming and feedback without proxy latency.
