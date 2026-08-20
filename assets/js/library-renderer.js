
(function(global) {
    'use strict';
    global.LibraryRenderer = {
        render: function(wrap, items, lib, refreshCb) {
            wrap.innerHTML = '';
            items.forEach(function (f) {
                const slug = f.name.replace(/[.]html$/i, '');
                const row = document.createElement('div');
                row.className = 'flex items-center justify-between gap-2 p-2 border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all';
                const label = f.account ? f.account + ' / ' + slug : slug;
                const pagesUrl = 'https://zen-zeng.github.io/smart-marketing-collection/' + f.path;
                row.innerHTML = '<span class="text-xs font-medium text-slate-700 truncate">' + label + '</span>'
                    + '<span class="flex items-center gap-1">'
                    + '<button class="text-slate-400 hover:text-amber-600 text-xs p-0.5 btn-toggle-public" data-slug="' + slug + '" data-path="' + f.path + '" title="公开/私密"><i class="fa-solid fa-lock"></i></button>'
                    + '<a class="text-indigo-600 hover:text-indigo-800 text-xs eye-preview" target="_blank" rel="noopener noreferrer" href="' + pagesUrl + '" title="在新标签页打开"><i class="fa-solid fa-eye"></i></a>'
                    + '<button class="text-emerald-600 hover:text-emerald-800 text-xs p-0.5" data-slug="' + slug + '" title="download"><i class="fa-solid fa-download"></i></button>'
                    + '<button class="text-rose-500 hover:text-rose-700 text-xs p-0.5" data-slug="' + slug + '" title="delete"><i class="fa-solid fa-trash"></i></button>'
                    + '</span>';
                
                row.addEventListener('click', function (ev) {
                    if (ev.target.closest('.eye-preview, button')) return;
                    (async function () {
                        var frame = document.getElementById('preview-frame');
                        if (frame) frame.src = pagesUrl;
                        try {
                            var jsonText = await lib.readFile(f.path.replace(/[.]html$/i, '.data.json'));
                            var parsed = JSON.parse(jsonText);
                            if (parsed.schema) {
                                global.activeSchema = parsed.schema;
                                document.getElementById('proposal-json').textContent = JSON.stringify(parsed.schema, null, 2);
                            }
                            if (parsed.html) {
                                global.activeHtml = parsed.html;
                                document.getElementById('proposal-html').textContent = parsed.html;
                            }
                            var criticEl = document.getElementById('critic-content');
                            if (criticEl) criticEl.innerHTML = '<div class="p-4 rounded-lg border border-slate-200 bg-slate-50 text-center"><i class="fa-solid fa-info-circle text-slate-400 mr-1.5"></i><span class="text-slate-500">已加载方案数据</span></div>';
                            ['btn-save-site','btn-export-pptx','btn-download-html','btn-copy'].forEach(function (id) {
                                var el = document.getElementById(id);
                                if (el) el.classList.remove('hidden');
                            });
                            global.showToast('已加载方案: ' + slug, 'success');
                        } catch (e) {
                             try {
                                var htmlText = await lib.readFile(f.path);
                                global.activeHtml = htmlText;
                                document.getElementById('proposal-html').textContent = htmlText;
                            } catch (e2) {}
                            document.getElementById('proposal-json').innerHTML = '<p class="text-slate-400 text-center p-8">该方案无结构化数据</p>';
                            var criticEl = document.getElementById('critic-content');
                            if (criticEl) criticEl.innerHTML = '<div class="p-4 rounded-lg border border-slate-200 bg-slate-50 text-center"><span class="text-slate-500">手动上传方案无质检</span></div>';
                        }
                        document.getElementById('tab-preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    })();
                });

                row.querySelector('.btn-toggle-public').addEventListener('click', async function(ev) {
                    ev.stopPropagation();
                    const btn = ev.currentTarget;
                    const icon = btn.querySelector('i');
                    const newPublic = !icon.classList.contains('fa-lock-open');
                    btn.disabled = true; icon.classList.add('fa-spin');
                    try {
                        await lib.togglePublic(f.path, newPublic);
                        icon.classList.remove('fa-lock', 'fa-lock-open', 'fa-spin');
                        icon.classList.add(newPublic ? 'fa-lock-open' : 'fa-lock');
                        global.showToast(newPublic ? '已设为公开' : '已设为私密', 'success');
                    } catch(e) { global.showToast('切换失败', 'error'); icon.classList.remove('fa-spin'); }
                    finally { btn.disabled = false; }
                });

                row.querySelectorAll('button[data-slug]').forEach(function (btn) {
                    btn.addEventListener('click', async function () {
                        if (btn.title === 'download') {
                            try {
                                const data = await lib.readFile(f.path.replace(/[.]html$/i, '.data.json'));
                                const parsed = JSON.parse(data);
                                const blob = new Blob([parsed.html], { type: 'text/html;charset=utf-8' });
                                const url = URL.createObjectURL(blob);
                                const a = Object.assign(document.createElement('a'), { href: url, download: slug + '.html' });
                                a.click();
                                URL.revokeObjectURL(url);
                            } catch (e) { global.showToast('下载失败: ' + e.message, 'error'); }
                        } else if (btn.title === 'delete') {
                            if (!confirm('确认删除方案 ' + slug + ' 吗？')) return;
                            const btn = this;
                            const icon = btn.querySelector('i');
                            btn.disabled = true; icon.className = 'fa-solid fa-spinner fa-spin';
                            try {
                                await lib.deleteProposal(f.path);
                                global.showToast('删除成功', 'success');
                                refreshCb();
                            } catch(e) { global.showToast('删除失败: ' + e.message, 'error'); icon.className = 'fa-solid fa-trash'; btn.disabled = false; }
                        }
                    });
                });
                wrap.appendChild(row);
            });
        }
    };
})(window);
