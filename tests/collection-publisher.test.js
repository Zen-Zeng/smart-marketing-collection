const assert = require('assert');
require('../assets/js/collection-publisher.js');
const U = global.CollectionPublisherUtils;

assert.strictEqual(U.normalizeFileName('天问山黄精天猫运营方案'), '天问山黄精天猫运营方案.html');
assert.strictEqual(U.normalizeFileName('Brand: X/2026'), 'Brand X2026.html');
assert.strictEqual(U.normalizeFileName(''), 'proposal.html');
console.log('normalizeFileName passed');

const html = '<!DOCTYPE html>\n<html><head><link rel="stylesheet" href="shared.css"></head><body>x</body></html>';
const guarded = U.ensureSiteGuards(html);
assert.ok(guarded.indexOf('assets/css/shared.css') >= 0);
assert.ok(guarded.indexOf('assets/js/auth-check.js') >= 0);
assert.ok(guarded.indexOf('assets/js/shared.js') >= 0);
assert.strictEqual(guarded.indexOf('href="shared.css"'), -1);
console.log('ensureSiteGuards passed');

const schema = {
    meta: { brand_name: '天问山', proposal_title: '天问山黄精天猫自营店铺年度运营方案', industry: '食品/滋补' },
    executive_summary: { core_takeaways: ['以信任建立品牌，以差异化实现增长'] }
};
const card = U.buildIndexCard(schema, '天问山黄精天猫运营方案.html');
assert.ok(card.indexOf('天问山黄精天猫自营店铺年度运营方案') >= 0);
assert.ok(card.indexOf('tianwenshan') < 0 || card.indexOf('天问山黄精天猫运营方案.html') >= 0);
assert.ok(card.indexOf('以信任建立品牌') >= 0);
console.log('buildIndexCard passed');

const row = U.buildReadmeRow(schema, '天问山黄精天猫运营方案.html');
assert.ok(row.indexOf('| 天问山黄精天猫自营店铺年度运营方案 | [天问山黄精天猫自营店铺年度运营方案](天问山黄精天猫运营方案.html) | 食品/滋补 |') >= 0);
console.log('buildReadmeRow passed');

const idxHtml = '        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">\n                <!-- 夸克智能 -->\n                <a>q</a>';
const injected = U.injectIndexCard(idxHtml, card);
assert.ok(injected.indexOf('<!-- 天问山黄精天猫自营店铺年度运营方案 -->') >= 0);
assert.ok(injected.indexOf('<!-- 夸克智能 -->') >= 0);
console.log('injectIndexCard passed');

const readme = '| 夸克智能全域资产增值方案 | [QuarkAI.html](QuarkAI.html) | 科技/营销 |';
const readmeInjected = U.injectReadmeRow(readme, row);
assert.ok(readmeInjected.indexOf(row) === 0);
assert.ok(readmeInjected.indexOf('| 夸克智能全域资产增值方案 |') > 0);
console.log('injectReadmeRow passed');

console.log('ALL PUBLISHER TESTS PASSED');
