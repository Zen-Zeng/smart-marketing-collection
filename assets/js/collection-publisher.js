/**
 * AI Marketing Proposal Workbench - Account Proposal Library
 * Per-account proposal storage under projects/<username>/ in the repo.
 * Reference: CONTEXT.md, ADR-0018
 */
(function (global) {
    'use strict';

    function utf8ToBase64(str) {
        var bytes = new TextEncoder().encode(str);
        var bin = '';
        bytes.forEach(function (b) { bin += String.fromCharCode(b); });
        return btoa(bin);
    }

    function normalizeSlug(title) {
        var name = String(title || 'proposal').trim();
        name = name.replace(/[\\\\/:\\*\\?\"<>|]/g, '').replace(/\\s+/g, ' ').trim();
        if (!name) name = 'proposal';
        return name;
    }

    async function ghFetch(token, url, options) {
        options = options || {};
        options.headers = Object.assign({
            'Accept': 'application/vnd.github+json'
        }, options.headers || {});
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        var res = await fetch(url, options);
        if (!res.ok) {
            var body = '';
            try { body = await res.text(); } catch (e) { body = ''; }
            throw new Error('GitHub API (' + res.status + '): ' + body.slice(0, 200));
        }
        return res.json();
    }

    function AccountLibrary(opts) {
        opts = opts || {};
        this.owner = opts.owner || 'Zen-Zeng';
        this.repo = opts.repo || 'smart-marketing-collection';
        this.token = opts.token || '';
        this.branch = opts.branch || 'main';
        this.username = opts.username || '';
    }

    AccountLibrary.prototype.apiBase = function () {
        return 'https://api.github.com/repos/' + this.owner + '/' + this.repo;
    };

    AccountLibrary.prototype.dirPath = function () {
        return 'projects/' + this.username;
    };

    AccountLibrary.prototype.listProposals = async function () {
        if (this.username === 'admin') {
            return this._listAllAccounts();
        }
        return this._listDir(this.dirPath(), this.username);
    };

   AccountLibrary.prototype._listAllAccounts = async function () {
       var self = this;
        var results = [];
        // 1. 扫描根目录方案页面（排除系统页面）
        var skipPages = { 'generator.html': 1, 'login.html': 1, 'index.html': 1 };
        try {
            var rootFiles = await ghFetch(this.token, this.apiBase() + '/contents/?ref=' + this.branch);
            if (Array.isArray(rootFiles)) {
                rootFiles.forEach(function (item) {
                    if (item.type === 'file' && /[.]html$/i.test(item.name) && !skipPages[item.name]) {
                        results.push({ name: item.name, path: item.path, download_url: item.download_url, sha: item.sha, account: 'root' });
                    }
                });
            }
        } catch (e) {
            if (String(e.message).indexOf('404') < 0) throw e;
        }
        // 2. 扫描 projects/ 下各账号子目录
        try {
            var projectsRoot = await ghFetch(this.token, this.apiBase() + '/contents/projects?ref=' + this.branch);
            if (Array.isArray(projectsRoot)) {
                var accounts = projectsRoot.filter(function (item) { return item.type === 'dir'; });
                for (var i = 0; i < accounts.length; i++) {
                    var dirItems = await self._listDir('projects/' + accounts[i].name, accounts[i].name);
                    results = results.concat(dirItems);
                }
            }
        } catch (e) {
            if (String(e.message).indexOf('404') < 0) throw e;
        }
       return results;
   };

    AccountLibrary.prototype._listDir = async function (dirPath, account) {
        var path = encodeURIComponent(dirPath);
        var data;
        try {
            data = await ghFetch(this.token, this.apiBase() + '/contents/' + path + '?ref=' + this.branch);
        } catch (e) {
            if (String(e.message).indexOf('404') >= 0) return [];
            throw e;
        }
        if (!Array.isArray(data)) return [];
        return data.filter(function (item) { return item.type === 'file' && /[.]html$/i.test(item.name); }).map(function (item) {
            return { name: item.name, path: item.path, download_url: item.download_url, sha: item.sha, account: account };
        });
    };

    AccountLibrary.prototype.readFile = async function (path) {
        var enc = path.split('/').map(encodeURIComponent).join('/');
        var data = await ghFetch(this.token, this.apiBase() + '/contents/' + enc + '?ref=' + this.branch);
        if (!data.content) throw new Error('文件为空: ' + path);
        var bin = atob(data.content);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8').decode(bytes);
    };

    AccountLibrary.prototype.createCommit = async function (files, message) {
        var api = this.apiBase();
        if (!this.token) throw new Error('缺少 GitHub Token，无法写入方案库');
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

    AccountLibrary.prototype.saveProposal = async function (schema, html) {
        var slug = normalizeSlug((schema.meta && schema.meta.proposal_title) || (schema.meta && schema.meta.brand_name) || 'proposal');
        var dir = this.dirPath();
        var page = String(html || '');
        if (page.indexOf('assets/css/shared.css') < 0) page = page.replace(/href=\"shared.css\"/g, 'href=\"assets/css/shared.css\"');
        var isPublic = false;
        if (page.indexOf('smc-public') >= 0) {
            page = page.replace(/<meta name=['"]smc-public['"] content=['"][^'"]*['"]>/i, '<meta name="smc-public" content="' + isPublic + '">');
        } else {
            page = page.replace(/<head>/i, '<head>\n<meta name="smc-public" content="' + isPublic + '">');
        }
        var files = [
            { path: dir + '/' + slug + '.html', content: page },
            { path: dir + '/' + slug + '.data.json', content: JSON.stringify({ schema: schema, html: page, savedAt: new Date().toISOString(), public: isPublic }, null, 2) }
        ];
        var sha = await this.createCommit(files, 'feat(' + this.username + '): save proposal ' + slug);
        return { slug: slug, commitSha: sha, htmlPath: dir + '/' + slug + '.html', isPublic: isPublic };
    };

    AccountLibrary.prototype.togglePublic = async function (htmlPath, isPublic) {
        var jsonPath = htmlPath.replace(/[.]html$/i, '.data.json');
        var files = [];
        var hasJson = false;
        
        // 尝试读取 .data.json，如果不存在则直接操作 HTML
        try {
            var dataText = await this.readFile(jsonPath);
            var data = JSON.parse(dataText);
            data.public = isPublic;
            var page = data.html || '';
            hasJson = true;
        } catch (e) {
            // .data.json 不存在，直接读取 HTML 文件
            var page = await this.readFile(htmlPath);
            var data = null;
        }
        
        // 更新 HTML 中的 meta 标签
        if (page.indexOf('smc-public') >= 0) {
            page = page.replace(/<meta name=['"]smc-public['"] content=['"][^'"]*['"]>/i, '<meta name="smc-public" content="' + isPublic + '">');
        } else {
            page = page.replace(/<head>/i, '<head>\n<meta name="smc-public" content="' + isPublic + '">');
        }
        
        files.push({ path: htmlPath, content: page });
        
        if (hasJson && data) {
            data.html = page;
            files.push({ path: jsonPath, content: JSON.stringify(data, null, 2) });
        }
        
        await this.createCommit(files, 'chore: toggle public=' + isPublic + ' for ' + htmlPath);
        return { isPublic: isPublic };
    };

    global.AccountLibrary = AccountLibrary;
    global.AccountLibraryUtils = { normalizeSlug: normalizeSlug };


    AccountLibrary.prototype.isPublic = async function (htmlPath) {
        var jsonPath = htmlPath.replace(/[.]html$/i, '.data.json');
        try {
            var dataText = await this.readFile(jsonPath);
            var data = JSON.parse(dataText);
            if (data && typeof data.public !== 'undefined') return !!data.public;
        } catch (e) {}
        try {
            var page = await this.readFile(htmlPath);
            var m = page.match(/<meta name=['"]smc-public['"] content=['"]([^'"]*)['"]/i);
            return m ? m[1] === 'true' : false;
        } catch (e) {
            return false;
        }
    };

    AccountLibrary.prototype.deleteProposal = async function (htmlPath) {
        var self = this;
        async function del(path) {
            var enc = path.split('/').map(encodeURIComponent).join('/');
            try {
                var info = await ghFetch(self.token, self.apiBase() + '/contents/' + enc + '?ref=' + self.branch);
                if (!info.sha) throw new Error('无法获取文件 sha: ' + path);
                await ghFetch(self.token, self.apiBase() + '/contents/' + enc, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'chore: delete ' + path, sha: info.sha, branch: self.branch })
                });
            } catch (e) {
                if (String(e.message).indexOf('404') < 0) throw e;
            }
        }
        await del(htmlPath);
        await del(htmlPath.replace(/[.]html$/i, '.data.json'));
        return true;
    };

})(typeof window !== 'undefined' ? window : globalThis);

