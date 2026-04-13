/**
 * shared.js — 全局公共 JavaScript
 * 所有方案页面均应在 </body> 前引入此文件
 *
 * 功能：
 *   1. 回到顶部按钮
 *   2. 滚动淡入动画（IntersectionObserver）
 *   3. 导航栏滚动阴影
 * ------------------------------------------------------------------ */

(function () {
    'use strict';

    /* ================================================================
       1. 回到顶部按钮
       自动在 body 末尾插入按钮，无需在 HTML 中手动添加
       ================================================================ */
    function initBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.setAttribute('aria-label', '回到顶部');
        btn.setAttribute('title', '回到顶部');
        btn.innerHTML = '&#8679;'; /* ↑ */
        document.body.appendChild(btn);

        const SHOW_THRESHOLD = 400; // px

        function toggleVisibility() {
            if (window.scrollY > SHOW_THRESHOLD) {
                btn.classList.add('is-visible');
            } else {
                btn.classList.remove('is-visible');
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        toggleVisibility();

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ================================================================
       2. 滚动淡入（section-fade）
       监听带有 .section-fade 类的元素，进入视口后添加 .is-visible
       ================================================================ */
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) {
            // 降级：直接显示所有元素
            document.querySelectorAll('.section-fade').forEach(function (el) {
                el.classList.add('is-visible');
            });
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // 动画只触发一次
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.section-fade').forEach(function (el) {
            observer.observe(el);
        });
    }

    /* ================================================================
       3. 导航栏滚动阴影
       为 <header> 或 <nav> 添加/移除 scrolled 类，通过 CSS 控制阴影
       ================================================================ */
    function initNavShadow() {
        var nav = document.querySelector('header') || document.querySelector('nav');
        if (!nav) return;

        function onScroll() {
            if (window.scrollY > 10) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ================================================================
       启动
       ================================================================ */
    function init() {
        initBackToTop();
        initScrollReveal();
        initNavShadow();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
