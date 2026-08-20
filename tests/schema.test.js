const assert = require('assert');
require('../assets/js/schema.js');
const core = globalThis.ProposalSchemaCore;
assert(core, 'ProposalSchemaCore must be defined');

console.log('--- Test 1: Industry Themes ---');
assert.strictEqual(typeof core.INDUSTRY_THEMES, 'object');
const industries = ['美妆个护', '3C数码/科技', 'B2B制造/企业服务', '医疗大健康', '跨境电商/出海', '食品饮料/餐饮', '经典商务'];
industries.forEach(ind => {
    assert(core.INDUSTRY_THEMES[ind], 'Missing theme for: ' + ind);
    assert(core.INDUSTRY_THEMES[ind].pptxHeaderBg, 'Missing pptxHeaderBg for: ' + ind);
    assert(core.INDUSTRY_THEMES[ind].primary, 'Missing primary color for: ' + ind);
});
assert.strictEqual(core.getThemeForIndustry('护肤美妆品牌').name, '美妆个护');
assert.strictEqual(core.getThemeForIndustry('AI人工智能数码').name, '3C数码/科技');
console.log('✓ Industry themes verified');

console.log('--- Test 2: Schema Validation ---');
const emptyRes = core.validateProposalSchema({});
assert.strictEqual(emptyRes.valid, false);
assert.strictEqual(emptyRes.errors.length, 8);

const sampleSchema = {
    meta: { brand_name: 'DR.COSMO', proposal_title: '2026品牌营销战役', industry: '美妆个护' },
    executive_summary: { core_takeaways: ['要点1', '要点2'], action_slogan: '胶原抗衰' },
    market_insight: { industry_background: '市场大盘增长', market_opportunities: ['机会1'], market_challenges: ['挑战1'], competitors: [{ name: '竞品A', advantage: '知名度', weakness: '价格高', our_opportunity: '性价比' }], personas: [{ name: '都市白领', age_range: '25-35', tags: ['抗衰'], pain_points: ['初老'], channel_preference: ['小红书'] }] },
    core_strategy: { brand_positioning: '院线抗衰专家', core_value_prop: '重组胶原', campaign_theme: '胶原奇迹', strategic_framework_4p: { product: '精华', price: '499', place: '天猫/抖音', promotion: '达人种草' }, battle_phases_overview: ['蓄水', '爆发', '沉淀'] },
    channel_matrix: [{ platform: '小红书', role: '种草', content_types: ['图文'], key_tactics: ['爆文'], kpi_focus: '互动率' }],
    influencer_matrix: { tier_breakdown: [{ tier: '头部', percentage: 30, unit_price_range: '10万', count: 2, purpose: '背书' }], selection_criteria: ['粉丝重合度>70%'] },
    timeline_phases: [{ phase_name: '蓄水期', period: '第1-2周', focus: '达人寄样', milestones: ['签约50人'], deliverables: ['清单'] }],
    finance_and_kpi: {
        total_budget_amount: '100万',
        budget_breakdown: [
            { channel: '达人采买', percentage: 60, amount: '60万', note: 'KOL' },
            { channel: '信息流广告', percentage: 30, amount: '30万', note: '千川' },
            { channel: '视觉物料', percentage: 10, amount: '10万', note: '设计' }
        ],
        conversion_funnel: [{ stage: '曝光', metric_name: '总曝光', target_value: '1000万' }],
        expected_roi: '1:4.5',
        risk_mitigations: [{ risk: '达人翻车', mitigation: '预先审核' }]
    }
};
const validRes = core.validateProposalSchema(sampleSchema);
assert.strictEqual(validRes.valid, true);
assert.strictEqual(validRes.errors.length, 0);
console.log('✓ Valid schema passed with 0 errors');

console.log('--- Test 3: Budget Closure Check ---');
const unbalancedSchema = JSON.parse(JSON.stringify(sampleSchema));
unbalancedSchema.finance_and_kpi.budget_breakdown[0].percentage = 80;
const unbalRes = core.validateProposalSchema(unbalancedSchema);
assert(unbalRes.warnings.some(w => w.includes('预算分配比例总和 (120%) 与 100% 存在偏差')));
console.log('✓ Budget imbalance detected accurately');

console.log('--- Test 4: Targeted JSON Patching ---');
const patch = {
    finance_and_kpi: {
        total_budget_amount: '150万',
        budget_breakdown: [{ channel: '达人采买', percentage: 70, amount: '105万', note: '扩大' }]
    }
};
const patched = core.applyProposalPatch(sampleSchema, patch);
assert.strictEqual(patched.finance_and_kpi.total_budget_amount, '150万');
assert.strictEqual(patched.meta.brand_name, 'DR.COSMO');
console.log('✓ Patching applied successfully');

console.log('--- Test 5: Hybrid Grounding Extraction ---');
const sampleDoc = {
    name: '品牌背景.md',
    text: '# 品牌定位与痛点\n客单价较低，急需重塑高端定位。\n\n# 财务预算规划\n总预算为150万。'
};
const grounded = core.buildGroundedContext([sampleDoc], '预算 定位');
assert(grounded.includes('品牌定位与痛点'));
assert(grounded.includes('财务预算规划'));
console.log('✓ Grounded context extraction working');

console.log('=======================================');
console.log('🎉 ALL 5 TEST SUITES PASSED SUCCESSFULLY!');
console.log('=======================================');