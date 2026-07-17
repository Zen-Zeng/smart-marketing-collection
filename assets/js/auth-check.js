/* auth-check.js — 静态站点访问守卫，在每个页面 <head> 最前面引入 */
(function () {
    'use strict';

    var TOKEN_KEY = 'smc_auth_ok';
    var page = location.pathname.split('/').pop() || 'index.html';

    /* 登录页本身直接放行 */
    if (page === 'login.html') return;

    /* 未登录 → 记录来源页后跳转到登录页 */
    if (sessionStorage.getItem(TOKEN_KEY) !== '1') {
        sessionStorage.setItem('smc_redirect', location.href);
        location.replace('login.html');
        return;
    }

    /* 已登录 → 页面加载完成后插入退出按钮 */
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.createElement('button');
        btn.id = 'smc-logout-btn';
        btn.textContent = '退出登录';
        btn.setAttribute('aria-label', '退出登录');
        btn.setAttribute('style', [
            'position:fixed', 'top:12px', 'right:56px', 'z-index:10000',
            'padding:4px 14px', 'background:rgba(239,68,68,0.88)', 'color:#fff',
            'border:none', 'border-radius:6px', 'font-size:12px', 'font-weight:600',
            'cursor:pointer', 'box-shadow:0 2px 8px rgba(0,0,0,0.18)',
            'letter-spacing:.02em', 'transition:opacity .2s'
        ].join(';'));
        btn.onmouseover = function () { this.style.opacity = '.8'; };
        btn.onmouseout  = function () { this.style.opacity = '1'; };
        btn.onclick = function () {
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem('smc_user');
            location.replace('login.html');
        };
        document.body.appendChild(btn);
    });
})();
