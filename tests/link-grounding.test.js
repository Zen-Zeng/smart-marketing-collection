const assert = require('assert');
require('../assets/js/schema.js');
require('../assets/js/agent-pipeline.js');

function mockAdapter() {
    return {
        streamChatCompletion: async function* (params) {
            if (params.system && params.system.indexOf('HTML') >= 0) {
                yield '<!DOCTYPE html><html><body>ok</body></html>';
                return;
            }
            yield JSON.stringify({
                meta: { brand_name: 'X', industry: '美妆个护' },
                executive_summary: { core_takeaways: ['a'] },
                market_insight: { market_opportunities: [], market_challenges: [], competitors: [], personas: [] },
                core_strategy: { strategic_framework_4p: {} },
                channel_matrix: [],
                influencer_matrix: { tier_breakdown: [] },
                timeline_phases: [],
                finance_and_kpi: { budget_breakdown: [] }
            });
        },
        chatCompletion: async function () {
            return JSON.stringify({ total_score: 90, verdict: 'ok', patch: null });
        }
    };
}

(async function () {
    let capturedFacts = '';
    const core = global.ProposalSchemaCore;
    const origBuild = core.buildGroundedContext;
    core.buildGroundedContext = function (files, keywords) {
        capturedFacts = JSON.stringify(files.map(function (f) { return f.name; }));
        return origBuild.call(core, files, keywords);
    };
    const runner = new global.AgentPipelineRunner({ llmAdapter: mockAdapter(), schemaCore: core });
    await runner.execute({
        formValues: { brand: 'X', industry: '美妆个护', background: 'test' },
        uploadedFiles: [{ name: '本地.md', text: '本地资料' }],
        linkMaterials: [{ status: 'ready', title: '官网', url: 'https://example.com', text: '在线资料正文' }]
    }, {});
    assert.ok(capturedFacts.indexOf('[链接] 官网') >= 0, 'link material must be merged');
    assert.ok(capturedFacts.indexOf('本地.md') >= 0, 'local file must remain');
    console.log('Link grounding merge passed');
    console.log('ALL LINK GROUNDING TESTS PASSED');
    core.buildGroundedContext = origBuild;
})().catch(function (err) { console.error(err); process.exit(1); });
