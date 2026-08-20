const assert = require('assert');
require('../assets/js/collection-publisher.js');
const U = global.AccountLibraryUtils;

assert.strictEqual(U.normalizeSlug('天问山黄精天猫运营方案'), '天问山黄精天猫运营方案');
assert.strictEqual(U.normalizeSlug('Brand: X/2026'), 'Brand X2026');
assert.strictEqual(U.normalizeSlug(''), 'proposal');
console.log('normalizeSlug passed');

const lib = new global.AccountLibrary({ token: 'x', username: 'zhangyiding' });
assert.strictEqual(lib.dirPath(), 'projects/zhangyiding');
console.log('dirPath passed');

console.log('ALL ACCOUNT LIBRARY TESTS PASSED');
