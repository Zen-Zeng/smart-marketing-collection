/**
 * AI 方案大师 - 领域核心规约与工具库 (ProposalSchema Specification & Utilities)
 * Reference: CONTEXT.md, ADR-0004, ADR-0007, ADR-0010
 */

(function (global) {
    'use strict';

    const INDUSTRY_THEMES = {
        '美妆个护': { name: '美妆个护', primary: '#db2777', primaryDark: '#9d174d', primaryLight: '#fdf2f8', accent: '#f43f5e', pptxHeaderBg: '9D174D', pptxAccent: 'DB2777', pptxLightBg: 'FDF2F8', textColor: '333333' },
        '3C数码/科技': { name: '3C数码/科技', primary: '#2563eb', primaryDark: '#1e3a8a', primaryLight: '#eff6ff', accent: '#06b6d4', pptxHeaderBg: '1E3A8A', pptxAccent: '2563EB', pptxLightBg: 'EFF6FF', textColor: '1E293B' },
        'B2B制造/企业服务': { name: 'B2B制造/企业服务', primary: '#0284c7', primaryDark: '#0c4a6e', primaryLight: '#f0f9ff', accent: '#f59e0b', pptxHeaderBg: '0C4A6E', pptxAccent: '0284C7', pptxLightBg: 'F0F9FF', textColor: '1E293B' },
        '医疗大健康': { name: '医疗大健康', primary: '#0d9488', primaryDark: '#134e4a', primaryLight: '#f0fdfa', accent: '#10b981', pptxHeaderBg: '134E4A', pptxAccent: '0D9488', pptxLightBg: 'F0FDFA', textColor: '134E4A' },
        '跨境电商/出海': { name: '跨境电商/出海', primary: '#7c3aed', primaryDark: '#4c1d95', primaryLight: '#f5f3ff', accent: '#f97316', pptxHeaderBg: '4C1D95', pptxAccent: '7C3AED', pptxLightBg: 'F5F3FF', textColor: '2E1065' },
        '食品饮料/餐饮': { name: '食品饮料/餐饮', primary: '#ea580c', primaryDark: '#7c2d12', primaryLight: '#fff7ed', accent: '#eab308', pptxHeaderBg: '7C2D12', pptxAccent: 'EA580C', pptxLightBg: 'FFF7ED', textColor: '431407' },
        '经典商务': { name: '经典商务', primary: '#4f46e5', primaryDark: '#312e81', primaryLight: '#eef2ff', accent: '#e11d48', pptxHeaderBg: '312E81', pptxAccent: '4F46E5', pptxLightBg: 'EEF2FF', textColor: '1E1B4B' }
    };

    function getThemeForIndustry(industryName) {
        if (!industryName) return INDUSTRY_THEMES['经典商务'];
        for (const key of Object.keys(INDUSTRY_THEMES)) {
            if (industryName.includes(key) || key.includes(industryName)) return INDUSTRY_THEMES[key];
        }
        if (industryName.includes('美') || industryName.includes('护肤')) return INDUSTRY_THEMES['美妆个护'];
        if (industryName.includes('科技') || industryName.includes('数码') || industryName.includes('AI')) return INDUSTRY_THEMES['3C数码/科技'];
        if (industryName.includes('B2B') || industryName.includes('制造')) return INDUSTRY_THEMES['B2B制造/企业服务'];
        if (industryName.includes('医') || industryName.includes('健康')) return INDUSTRY_THEMES['医疗大健康'];
        if (industryName.includes('跨境') || industryName.includes('出海')) return INDUSTRY_THEMES['跨境电商/出海'];
        if (industryName.includes('食') || industryName.includes('饮')) return INDUSTRY_THEMES['食品饮料/餐饮'];
        return INDUSTRY_THEMES['经典商务'];
    }

    function validateProposalSchema(schema) {
        const errors = [];
        const warnings = [];
        if (!schema || typeof schema !== 'object') return { valid: false, errors: ['ProposalSchema 必须是非空对象'], warnings: [] };
        const requiredPillars = ['meta', 'executive_summary', 'market_insight', 'core_strategy', 'channel_matrix', 'influencer_matrix', 'timeline_phases', 'finance_and_kpi'];
        for (const pillar of requiredPillars) {
            if (!schema[pillar]) errors.push('缺少核心支柱模块: ' + pillar);
        }
        if (schema.finance_and_kpi && Array.isArray(schema.finance_and_kpi.budget_breakdown)) {
            let totalPct = 0;
            schema.finance_and_kpi.budget_breakdown.forEach(item => { totalPct += (parseFloat(item.percentage) || 0); });
            if (Math.abs(totalPct - 100) > 3) warnings.push('预算分配比例总和 (' + Math.round(totalPct) + '%) 与 100% 存在偏差');
        }
        return { valid: errors.length === 0, errors, warnings };
    }

    function applyProposalPatch(target, patch) {
        if (!patch || typeof patch !== 'object') return target;
        const result = JSON.parse(JSON.stringify(target));
        for (const key of Object.keys(patch)) {
            if (patch[key] !== null && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
                result[key] = Object.assign(result[key] || {}, patch[key]);
            } else {
                result[key] = patch[key];
            }
        }
        return result;
    }

    function buildGroundedContext(files, queryKeywords, maxTokens) {
        maxTokens = maxTokens || 6000;
        if (!files || files.length === 0) return '';
        const validFiles = files.filter(f => f.text && f.text.trim().length > 0);
        if (validFiles.length === 0) return '';
        let chunks = [];
        validFiles.forEach(file => {
            const lines = file.text.split(/\r?\n/);
            let currentHeading = '正文概述';
            let currentBuffer = [];
            lines.forEach(line => {
                const trimmed = line.trim();
                if (trimmed.startsWith('#') || /^第[一二三四五六七八九十0-9]+[章节部分]/.test(trimmed)) {
                    if (currentBuffer.length > 0) {
                        chunks.push({ fileName: file.name, heading: currentHeading, text: currentBuffer.join('\n').trim() });
                        currentBuffer = [];
                    }
                    currentHeading = trimmed.replace(/^[#\s]+/, '');
                } else if (trimmed.length > 0) {
                    currentBuffer.push(trimmed);
                }
            });
            if (currentBuffer.length > 0) chunks.push({ fileName: file.name, heading: currentHeading, text: currentBuffer.join('\n').trim() });
        });
        let output = '【客户背景资料高相关段落】\n';
        chunks.slice(0, 15).forEach(c => { output += '\n### [' + c.fileName + '] ' + c.heading + '\n' + c.text.slice(0, 800) + '\n'; });
        return output;
    }

    global.ProposalSchemaCore = { INDUSTRY_THEMES, getThemeForIndustry, validateProposalSchema, applyProposalPatch, buildGroundedContext };
})(typeof window !== 'undefined' ? window : globalThis);
