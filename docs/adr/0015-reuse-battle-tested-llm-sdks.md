# 0015: Reuse Battle-Tested LLM SDKs over Self-Maintained Adapters

## Context
Multi-provider LLM access (DeepSeek, OpenAI, Anthropic Claude, custom OpenAI-compatible proxies) requires normalized streaming chat completion, structured error handling, and abort signal propagation. Building four bespoke adapters would duplicate SDK maintenance work.

## Decision
We decided to compose with industry-standard browser-bundled SDKs:
1. openai official browser bundle for OpenAI, DeepSeek, and any OpenAI-compatible custom endpoint.
2. @anthropic-ai/sdk browser bundle for Claude's /v1/messages endpoint with the anthropic-dangerous-direct-browser-access header requirement.

A single LlmAdapter boundary within agent-pipeline.js chooses the right SDK per provider, leaving the Strategy Agent and Critic Agent oblivious to protocol details.

## Why
1. Avoids reinventing streaming parsers, retry policies, and error normalization.
2. Aligns with the "don't repeat yourself" architectural constraint.
3. Keeps our long-term maintenance cost minimal as SDK vendors evolve.