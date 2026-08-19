const assert = require('assert');
require('../assets/js/agent-pipeline.js');

const d = new global.LlmAdapter({ provider: 'deepseek', apiKey: 'x', baseUrl: 'https://api.deepseek.com/v1', model: 'deepseek-chat' });
assert.strictEqual(d._sdkBaseUrl(), 'https://api.deepseek.com/v1');
assert.strictEqual(d._endpointFor('/chat/completions'), 'https://api.deepseek.com/v1/chat/completions');

const legacy = new global.LlmAdapter({ provider: 'deepseek', apiKey: 'x', baseUrl: 'https://api.deepseek.com/v1/chat/completions', model: 'deepseek-chat' });
assert.strictEqual(legacy._sdkBaseUrl(), 'https://api.deepseek.com/v1');
assert.strictEqual(legacy._endpointFor('/chat/completions'), 'https://api.deepseek.com/v1/chat/completions');

const c = new global.LlmAdapter({ provider: 'claude', apiKey: 'x', baseUrl: 'https://api.anthropic.com', model: 'claude-3-7-sonnet-20250219' });
assert.strictEqual(c._sdkBaseUrl(), 'https://api.anthropic.com');
assert.strictEqual(c._endpointFor('/v1/messages'), 'https://api.anthropic.com/v1/messages');

console.log('Provider URL resolution passed');
console.log('ALL PROVIDER CONFIG TESTS PASSED');
