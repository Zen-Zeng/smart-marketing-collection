const assert = require('assert');
require('../assets/js/schema.js');
require('../assets/js/agent-pipeline.js');
require('../assets/js/pptx-compiler.js');

const sampleSchema = {
    meta: { brand_name: 'DR.COSMO', proposal_title: '2026品牌营销战役', industry: '美妆个护' },
    executive_summary: { core_takeaways: ['要点1', '要点2'], action_slogan: '胶原抗衰' },
    market_insight: { industry_background: '市场大盘增长', market_opportunities: ['机会1'], market_challenges: ['挑战1'], competitors: [], personas: [] },
    core_strategy: { brand_positioning: '院线抗衰专家', strategic_framework_4p: {} },
    channel_matrix: [],
    influencer_matrix: { tier_breakdown: [] },
    timeline_phases: [],
    finance_and_kpi: { budget_breakdown: [{ channel: '达人', percentage: 100, amount: '100万', note: 'KOL' }] }
};

function mockAdapter() {
    return {
        streamChatCompletion: async function* (params) {
            if ((params.system && params.system.indexOf('HTML') >= 0) || (params.userMsg && params.userMsg.indexOf('HTML') >= 0)) {
                yield '<!DOCTYPE html><html><body>ok</body></html>';
                return;
            }
            yield JSON.stringify(sampleSchema);
        },
        chatCompletion: async function () {
            return JSON.stringify({
                total_score: 91,
                verdict: 'pass',
                patch: { meta: { slogan: 'patched' } }
            });
        }
    };
}

(async function () {
    console.log('--- Pipeline mock execute ---');
    const runner = new global.AgentPipelineRunner({
        llmAdapter: mockAdapter(),
        schemaCore: global.ProposalSchemaCore
    });
    const stages = [];
    const result = await runner.execute({
        formValues: { brand: 'DR.COSMO', industry: '美妆个护', background: 'test' },
        uploadedFiles: []
    }, {
        onStageChange: function (stage, status) { stages.push(stage + ':' + status); }
    });
    assert.strictEqual(result.schema.meta.brand_name, 'DR.COSMO');
    assert.strictEqual(result.schema.meta.slogan, 'patched');
    assert.ok(result.html.indexOf('<!DOCTYPE html>') >= 0);
    assert.ok(stages.indexOf('research:done') >= 0);
    assert.ok(stages.indexOf('compiler:done') >= 0);
    console.log('pipeline mock execute passed');

    console.log('--- Utils extract ---');
    assert.ok(global.AgentPipelineUtils.extractHtml('<!DOCTYPE html><html></html>').indexOf('<!DOCTYPE html>') === 0);
    console.log('extract helpers passed');

    console.log('--- Slide registry ---');
    const ids = global.PptxCompiler.listSlideRenderers();
    assert.strictEqual(ids.length, 11);
    assert.ok(ids.indexOf('cover') >= 0);
    assert.ok(ids.indexOf('closing') >= 0);
    console.log('slide registry passed');

    console.log('ALL PIPELINE TESTS PASSED');
})().catch(function (err) {
    console.error(err);
    process.exit(1);
});
