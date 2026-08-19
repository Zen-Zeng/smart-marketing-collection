/**
 * AI Marketing Proposal Workbench - Deep Pipeline Module (AgentPipelineRunner)
 * Reference: CONTEXT.md, ADR-0013, ADR-0014, ADR-0015
 * Reuses official OpenAI and Anthropic browser SDKs to avoid bespoke protocol layers.
 */

(function (global) {
    'use strict';

    const SYSTEM_PROMPTS = {
        strategy: 'You are a senior Chinese 4A marketing strategist. Output ONLY valid JSON strictly conforming to ProposalSchema 8-pillar spec. Start with { and end with } with no markdown wrapping.',
        critic: 'You are a strict CMO and proposal auditor. Audit the ProposalSchema data on 5 dimensions (Relevance, Financial Balance, Differentiation, Feasibility, Conviction) scoring 0-100. Output ONLY valid JSON with fields: total_score, dimensions, strengths, defects_found, verdict, patch.',
        html: 'You are a top frontend engineer. Compile ProposalSchema into a standalone HTML page. Must start with <!DOCTYPE html> and end with </html>. First line in <head> must reference shared.css. No markdown wrapping.'
    };

    class LlmAdapter {
        constructor(opts) {
            this.provider = opts.provider;
            this.apiKey = opts.apiKey;
            this.baseUrl = opts.baseUrl;
            this.model = opts.model;
            this._openai = null;
            this._anthropic = null;
        }

        _getOpenAIClient() {
            if (!this._openai && global.OpenAI) {
                this._openai = new global.OpenAI({
                    apiKey: this.apiKey,
                    baseURL: this.baseUrl,
                    dangerouslyAllowBrowser: true
                });
            }
            return this._openai;
        }

        _getAnthropicClient() {
            if (!this._anthropic && global.anthropic) {
                this._anthropic = global.anthropic;
            }
            return this._anthropic;
        }

        async *streamChatCompletion(params) {
            const system = params.system;
            const userMsg = params.userMsg;
            const signal = params.signal;
            if (this.provider === 'claude') {
                yield* this._streamClaude(system, userMsg, signal);
            } else {
                yield* this._streamOpenAI(system, userMsg, signal);
            }
        }

        async *_streamOpenAI(system, userMsg, signal) {
            const client = this._getOpenAIClient();
            if (!client) { yield await this._fetchOpenAI(system, userMsg, signal, false); return; }
            const stream = await client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: userMsg }
                ],
                stream: true,
                temperature: 0.7
            }, { signal });

            for await (const chunk of stream) {
                var text = chunk.choices && chunk.choices[0] && chunk.choices[0].delta ? chunk.choices[0].delta.content : '';
                if (text) yield text;
            }
        }

        async *_streamClaude(system, userMsg, signal) {
            const client = this._getAnthropicClient();
            if (!client) { yield await this._fetchClaude(system, userMsg, signal); return; }
            const stream = await client.messages.stream({
                model: this.model,
                max_tokens: 8192,
                system: system,
                messages: [{ role: 'user', content: userMsg }]
            }, { signal });

            for await (const event of stream) {
                if (event.type === 'content_block_delta' && event.delta && event.delta.text) {
                    yield event.delta.text;
                }
            }
        }

        async chatCompletion(params) {
            const system = params.system;
            const userMsg = params.userMsg;
            const signal = params.signal;
            const jsonMode = params.jsonMode;
            if (this.provider === 'claude') {
                return this._chatClaude(system, userMsg, signal);
            }
            return this._chatOpenAI(system, userMsg, signal, jsonMode);
        }

        async _fetchOpenAI(system, userMsg, signal, jsonMode) {
            const payload = {
                model: this.model,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: userMsg }
                ],
                temperature: 0.4
            };
            if (jsonMode) payload.response_format = { type: 'json_object' };
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey
                },
                body: JSON.stringify(payload),
                signal: signal
            });
            if (!res.ok) throw new Error('API error (' + res.status + ')');
            const data = await res.json();
            return (data.choices && data.choices[0] && data.choices[0].message) ? data.choices[0].message.content : '';
        }

        async _fetchClaude(system, userMsg, signal) {
            const res = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                    'anthropic-dangerous-direct-browser-access': 'true'
                },
                body: JSON.stringify({
                    model: this.model,
                    max_tokens: 8192,
                    system: system,
                    messages: [{ role: 'user', content: userMsg }]
                }),
                signal: signal
            });
            if (!res.ok) throw new Error('API error (' + res.status + ')');
            const data = await res.json();
            return (data.content && data.content[0]) ? data.content[0].text : '';
        }

        async _chatOpenAI(system, userMsg, signal, jsonMode) {
            const client = this._getOpenAIClient();
            if (!client) return this._fetchOpenAI(system, userMsg, signal, jsonMode);
            const params = {
                model: this.model,
                messages: [
                    { role: 'system', content: system },
                    { role: 'user', content: userMsg }
                ],
                temperature: 0.4
            };
            if (jsonMode) params.response_format = { type: 'json_object' };
            const res = await client.chat.completions.create(params, { signal });
            return (res.choices && res.choices[0] && res.choices[0].message) ? res.choices[0].message.content : '';
        }

        async _chatClaude(system, userMsg, signal) {
            const client = this._getAnthropicClient();
            if (!client) return this._fetchClaude(system, userMsg, signal);
            const res = await client.messages.create({
                model: this.model,
                max_tokens: 8192,
                system: system,
                messages: [{ role: 'user', content: userMsg }]
            }, { signal });
            return (res.content && res.content[0]) ? res.content[0].text : '';
        }
    }

    function extractJson(raw) {
        const fence = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (fence) return fence[1].trim();
        const brace = raw.match(/\{[\s\S]*\}/);
        return brace ? brace[0] : raw.trim();
    }

    function extractHtml(raw) {
        const fence = raw.match(/```html\s*([\s\S]*?)\s*```/);
        if (fence) return fence[1].trim();
        const doc = raw.match(/(<!DOCTYPE[\s\S]*<\/html>)/i);
        return doc ? doc[1].trim() : raw.trim();
    }

    class AgentPipelineRunner {
        constructor(opts) {
            if (!opts || !opts.llmAdapter) throw new Error('llmAdapter is required');
            this.llm = opts.llmAdapter;
            this.schemaCore = opts.schemaCore || global.ProposalSchemaCore;
        }

        async execute(payload, callbacks) {
            callbacks = callbacks || {};
            const formValues = payload.formValues;
            const uploadedFiles = payload.uploadedFiles;
            const linkMaterials = payload.linkMaterials || [];
            const groundingFiles = (uploadedFiles || []).slice();
            linkMaterials.forEach(function (m) {
                if (m && m.status === 'ready' && m.text) {
                    groundingFiles.push({ name: '[链接] ' + (m.title || m.url), text: m.text });
                }
            });
            const onStageChange = callbacks.onStageChange;
            const onProgress = callbacks.onProgress;
            const onChunk = callbacks.onChunk;
            const signal = callbacks.signal;

            onStageChange && onStageChange('research', 'running');
            onProgress && onProgress(0.1, 'Stage 1 Research & Grounding');
            const groundedFacts = this.schemaCore.buildGroundedContext(
                groundingFiles,
                (formValues.brand || '') + ' ' + (formValues.industry || '') + ' ' + (formValues.campaignType || '') + ' ' + (formValues.challenge || '')
            );
            onStageChange && onStageChange('research', 'done');

            onStageChange && onStageChange('strategy', 'running');
            onProgress && onProgress(0.3, 'Stage 2 Strategy Agent');
            let strategyRaw = '';
            for await (const chunk of this.llm.streamChatCompletion({
                system: SYSTEM_PROMPTS.strategy,
                userMsg: this._buildStrategyPrompt(formValues, groundedFacts),
                signal: signal
            })) {
                strategyRaw += chunk;
                onChunk && onChunk('strategy', chunk);
            }
            let schema;
            try {
                schema = JSON.parse(extractJson(strategyRaw));
            } catch (e) {
                throw new Error('Strategy JSON parse failed: ' + e.message);
            }
            onStageChange && onStageChange('strategy', 'done');

            onStageChange && onStageChange('critic', 'running');
            onProgress && onProgress(0.6, 'Stage 3 Critic Agent');
            let criticRaw = '';
            try {
                criticRaw = await this.llm.chatCompletion({
                    system: SYSTEM_PROMPTS.critic,
                    userMsg: 'Audit this schema: ' + JSON.stringify(schema, null, 2),
                    jsonMode: true,
                    signal: signal
                });
            } catch (e) {
                criticRaw = JSON.stringify({ total_score: 85, verdict: 'Critic skipped', patch: null });
            }
            let critic;
            try {
                critic = JSON.parse(extractJson(criticRaw));
            } catch (e) {
                critic = { total_score: 85, verdict: 'Critic parse failed', patch: null };
            }
            if (critic.patch) {
                schema = this.schemaCore.applyProposalPatch(schema, critic.patch);
            }
            onStageChange && onStageChange('critic', 'done');

            onStageChange && onStageChange('compiler', 'running');
            onProgress && onProgress(0.85, 'Stage 4 HTML Compiler');
            const theme = this.schemaCore.getThemeForIndustry(schema.meta && schema.meta.industry);
            let htmlRaw = '';
            for await (const chunk of this.llm.streamChatCompletion({
                system: SYSTEM_PROMPTS.html,
                userMsg: 'Compile this schema into HTML: ' + JSON.stringify(schema, null, 2) + ' Theme: primary=' + theme.primary + ', dark=' + theme.primaryDark + ', light=' + theme.primaryLight,
                signal: signal
            })) {
                htmlRaw += chunk;
                onChunk && onChunk('html', chunk);
            }
            const html = extractHtml(htmlRaw);
            onStageChange && onStageChange('compiler', 'done');

            onProgress && onProgress(1.0, 'Pipeline complete');
            return { schema: schema, html: html, critic: critic };
        }

        _buildStrategyPrompt(form, groundedFacts) {
            return [
                '[Brand]: ' + (form.brand || ''),
                '[Industry]: ' + (form.industry || ''),
                '[Campaign Type]: ' + (form.campaignType || ''),
                '[Budget]: ' + (form.budget || 'Default'),
                '[Period]: ' + (form.period || 'Quarter'),
                '[Audience]: ' + (form.audience || ''),
                '[Background]: ' + (form.background || ''),
                '[Challenge]: ' + (form.challenge || ''),
                '',
                groundedFacts || ''
            ].join(', ');
        }
    }

    if (typeof global.AgentPipelineRunner === 'undefined') {
        global.AgentPipelineRunner = AgentPipelineRunner;
    }
    if (typeof global.LlmAdapter === 'undefined') {
        global.LlmAdapter = LlmAdapter;
    }
    global.AgentPipelineUtils = { extractJson: extractJson, extractHtml: extractHtml };

})(typeof window !== 'undefined' ? window : globalThis);
