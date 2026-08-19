/**
 * AI Marketing Proposal Workbench - Collection Publisher
 * One-click save of a generated proposal into the GitHub repo and the collection page.
 * Reference: CONTEXT.md, ADR-0017
 */
(function (global) {
    'use strict';

    function utf8ToBase64(str) {
        var bytes = new TextEncoder().encode(str);
        var bin = '';
        bytes.forEach(function (b) { bin += String.fromCharCode(b); });
        return btoa(bin);
    }

    function normalizeFileName(title) {
        var name = String(title || 'proposal').trim();
        name = name.replace(/[\\/:\*\?"<>|]/g, '').replace(/\s+/g, ' ').trim();
        if (!name) name = 'proposal';
        if (!/\.html$/i.test(name)) name += '.html';
        return name;
    }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function ensureSiteGuards(html) {
        var out = String(html || '');
        if (out.indexOf('assets/css/shared.css') < 0) {
            out = out.replace(/href="shared.css"/g, 'href="assets/css/shared.css"');
        }
        if (out.indexOf('assets/js/auth-check.js') < 0) {
            out = out.replace('<head>', '<head>\n<script src="assets/js/auth-check.js"></script>');
        }
        if (out.indexOf('assets/js/shared.js') < 0) {
            var bodyEnd = out.lastIndexOf('</body>');
            if (bodyEnd >= 0) {
                out = out.slice(0, bodyEnd) + '<script src="assets/js/shared.js"></script>\n' + out.slice(bodyEnd);
            }
        }
        return out;
    }

    function buildIndexCard(schema, fileName) {
        var title = esc(schema.meta && schema.meta.proposal_title) || esc(schema.meta && schema.meta.brand_name) || '营销方案';
        var summary = '';
        if (schema.executive_summary && schema.executive_summary.core_takeaways && schema.executive_summary.core_takeaways.length) {
            summary = esc(schema.executive_summary.core_takeaways[0]);
        } else if (schema.core_strategy && schema.core_strategy.brand_positioning) {
            summary = esc(schema.core_strategy.brand_positioning);
        } else {
            summary = esc((schema.meta && schema.meta.brand_name) || '方案详情');
        }
        return [
            '                <!-- ' + title + ' -->',
            '                <a href="' + esc(fileName) + '" class="project-card bg-white p-8 rounded-lg shadow-sm border-t-4 border-indigo-500">',
            '                    <h3 class="text-xl font-bold mb-3">' + title + '</h3>',
            '                    <p class="text-gray-600 mb-4">' + summary + '</p>',
            '                    <div class="inline-flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors">',
            '                        查看详情',
            '                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">',
            '                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>',
            '                        </svg>',
            '                    </div>',
            '                </a>',
            ''
        ].join('\n');
    }

    function buildReadmeRow(schema, fileName) {
        var title = esc(schema.meta && schema.meta.proposal_title) || esc(schema.meta && schema.meta.brand_name) || '营销方案';
        var industry = esc(schema.meta && schema.meta.industry) || '营销';
        return '| ' + title + ' | [' + title + '](' + esc(fileName) + ') | ' + industry + ' |';
    }

    function injectIndexCard(indexHtml, cardBlock) {
        var anchor = '                <!-- 夸克智能 -->';
        if (indexHtml.indexOf(anchor) >= 0) {
            return indexHtml.replace(anchor, cardBlock + '\n' + anchor, 1);
        }
        var grid = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">';
        var idx = indexHtml.indexOf(grid);
        if (idx >= 0) {
            var insertAt = idx + grid.length;
            return indexHtml.slice(0, insertAt) + '\n' + cardBlock + indexHtml.slice(insertAt);
        }
        return indexHtml;
    }

    function injectReadmeRow(readme, row) {
        var anchor = '| 夸克智能全域资产增值方案 |';
        if (readme.indexOf(anchor) >= 0) {
            return readme.replace(anchor, row + '\n' + anchor, 1);
        }
        return readme;
    }

    async function ghFetch(token, url, options) {
        options = options || {};
        options.headers = Object.assign({
            'Accept': 'application/vnd.github+json',
            'Authorization': 'Bearer ' + token
        }, options.headers || {});
        var res = await fetch(url, options);
        if (!res.ok) {
            var body = '';
            try { body = await res.text(); } catch (e) { body = ''; }
            throw new Error('GitHub API (' + res.status + '): ' + body.slice(0, 200));
        }
        return res.json();
    }

    function CollectionPublisher(opts) {
        opts = opts || {};
        this.owner = opts.owner || 'Zen-Zeng';
        this.repo = opts.repo || 'smart-marketing-collection';
        this.token = opts.token || '';
        this.branch = opts.branch || 'main';
    }

    CollectionPublisher.prototype.apiBase = function () {
        return 'https://api.github.com/repos/' + this.owner + '/' + this.repo;
    };

    CollectionPublisher.prototype.readFile = async function (path) {
        var data = await ghFetch(this.token, this.apiBase() + '/contents/' + encodeURIComponent(path) + '?ref=' + this.branch);
        if (!data.content) throw new Error('文件为空: ' + path);
        var bin = atob(data.content);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8').decode(bytes);
    };

    CollectionPublisher.prototype.createCommit = async function (files, message) {
        var api = this.apiBase();
        var ref = await ghFetch(this.token, api + '/git/refs/heads/' + this.branch);
        var commitSha = ref.object.sha;
        var commit = await ghFetch(this.token, api + '/git/commits/' + commitSha);
        var baseTree = commit.tree.sha;

        var treeItems = [];
        for (var i = 0; i < files.length; i++) {
            var blob = await ghFetch(this.token, api + '/git/blobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: utf8ToBase64(files[i].content), encoding: 'base64' })
            });
            treeItems.push({ path: files[i].path, mode: '100644', type: 'blob', sha: blob.sha });
        }

        var tree = await ghFetch(this.token, api + '/git/trees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base_tree: baseTree, tree: treeItems })
        });

        var newCommit = await ghFetch(this.token, api + '/git/commits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, tree: tree.sha, parents: [commitSha] })
        });

        await ghFetch(this.token, api + '/git/refs/heads/' + this.branch, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sha: newCommit.sha, force: false })
        });
        return newCommit.sha;
    };

    CollectionPublisher.prototype.latestRun = async function () {
        var data = await ghFetch(this.token, this.apiBase() + '/actions/runs?per_page=1&branch=' + this.branch);
        return data.workflow_runs && data.workflow_runs.length ? data.workflow_runs[0] : null;
    };

    CollectionPublisher.prototype.saveProposal = async function (schema, html) {
        var fileName = normalizeFileName(schema.meta && schema.meta.proposal_title);
        var pageHtml = ensureSiteGuards(html);
        var indexHtml = await this.readFile('index.html');
        var readme = await this.readFile('README.md');
        var card = buildIndexCard(schema, fileName);
        var row = buildReadmeRow(schema, fileName);
        var newIndex = injectIndexCard(indexHtml, card);
        var newReadme = injectReadmeRow(readme, row);
        var title = (schema.meta && schema.meta.proposal_title) || (schema.meta && schema.meta.brand_name) || 'proposal';
        var sha = await this.createCommit([
            { path: fileName, content: pageHtml },
            { path: 'index.html', content: newIndex },
            { path: 'README.md', content: newReadme }
        ], 'feat: publish ' + title + ' to collection page');
        return { fileName: fileName, commitSha: sha };
    };

    global.CollectionPublisher = CollectionPublisher;
    global.CollectionPublisherUtils = {
        normalizeFileName: normalizeFileName,
        ensureSiteGuards: ensureSiteGuards,
        buildIndexCard: buildIndexCard,
        buildReadmeRow: buildReadmeRow,
        injectIndexCard: injectIndexCard,
        injectReadmeRow: injectReadmeRow
    };

})(typeof window !== 'undefined' ? window : globalThis);
