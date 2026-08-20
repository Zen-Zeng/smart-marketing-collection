/**
 * AI 方案大师 - 原生 PPTX 编译导出引擎 (PptxGenJS Compiler)
 * Reference: CONTEXT.md, ADR-0003, ADR-0008, ADR-0010, ADR-0011
 */

(function (global) {
    'use strict';

    function exportProposalToPptx(schema, options) {
        options = options || {};
        if (!global.PptxGenJS) {
            throw new Error('未检测到 PptxGenJS 库，请检查网络或 CDN 加载');
        }

        const pptx = new global.PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'AI 方案大师';
        pptx.company = schema.meta?.brand_name || '智能营销';
        pptx.title = schema.meta?.proposal_title || '营销方案提案';

        const theme = global.ProposalSchemaCore?.getThemeForIndustry(schema.meta?.industry) || {
            pptxHeaderBg: '1E1B4B',
            pptxAccent: '4F46E5',
            pptxLightBg: 'EEF2FF',
            textColor: '1E293B'
        };

        const FONT_TITLE = 'Microsoft YaHei';
        const FONT_BODY = 'Microsoft YaHei';

        // 通用辅助函数：添加标准头部导航
        function addSlideHeader(slide, title, category) {
            // 顶部装饰条
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.5, y: 0.4, w: 0.15, h: 0.45,
                fill: { color: theme.pptxAccent }
            });
            slide.addText(category || schema.meta?.brand_name || 'MARKETING PROPOSAL', {
                x: 0.8, y: 0.35, w: 8.0, h: 0.25,
                fontSize: 10, fontFace: FONT_BODY, color: '64748B', bold: true
            });
            slide.addText(title, {
                x: 0.8, y: 0.6, w: 10.0, h: 0.4,
                fontSize: 20, fontFace: FONT_TITLE, color: '0F172A', bold: true
            });
        }

        const slidePlan = listSlideRenderers();
        var activeSlidePlan = slidePlan;

        // 1. 封面页 (Cover Slide)
        const sCover = pptx.addSlide();
        sCover.background = { color: theme.pptxHeaderBg };
        sCover.addShape(pptx.ShapeType.rect, {
            x: 0.8, y: 1.8, w: 0.2, h: 2.2, fill: { color: theme.pptxAccent }
        });
        sCover.addText(schema.meta?.industry ? `【${schema.meta.industry}】营销全链路方案` : 'BRAND MARKETING PROPOSAL', {
            x: 1.2, y: 1.8, w: 11.0, h: 0.4,
            fontSize: 14, fontFace: FONT_BODY, color: theme.pptxAccent, bold: true
        });
        sCover.addText(schema.meta?.proposal_title || '品牌全域营销增长解决方案', {
            x: 1.2, y: 2.3, w: 11.0, h: 1.2,
            fontSize: 32, fontFace: FONT_TITLE, color: 'FFFFFF', bold: true
        });
        if (schema.meta?.slogan || schema.executive_summary?.action_slogan) {
            sCover.addText(schema.meta?.slogan || schema.executive_summary?.action_slogan, {
                x: 1.2, y: 3.6, w: 11.0, h: 0.6,
                fontSize: 16, fontFace: FONT_BODY, color: '94A3B8'
            });
        }
        sCover.addText(`提案客户：${schema.meta?.brand_name || '贵品牌'}    |    提案周期：${schema.meta?.target_period || '季度/年度'}    |    日期：${new Date().toLocaleDateString()}`, {
            x: 1.2, y: 6.2, w: 11.0, h: 0.4,
            fontSize: 11, fontFace: FONT_BODY, color: '64748B'
        });

        // 2. 执行摘要 (Executive Summary)
        const sSummary = pptx.addSlide();
        addSlideHeader(sSummary, '执行摘要 · 核心策略总览', 'EXECUTIVE SUMMARY');
        const takeaways = schema.executive_summary?.core_takeaways || [];
        takeaways.slice(0, 4).forEach((item, idx) => {
            const col = idx % 2;
            const row = Math.floor(idx / 2);
            const cardX = 0.8 + col * 5.8;
            const cardY = 1.4 + row * 2.5;
            sSummary.addShape(pptx.ShapeType.roundRect, {
                x: cardX, y: cardY, w: 5.4, h: 2.2,
                fill: { color: theme.pptxLightBg }, line: { color: theme.pptxAccent, width: 1 }
            });
            sSummary.addText(`0${idx + 1}`, {
                x: cardX + 0.3, y: cardY + 0.2, w: 1.0, h: 0.4,
                fontSize: 18, fontFace: FONT_TITLE, color: theme.pptxAccent, bold: true
            });
            sSummary.addText(typeof item === 'string' ? item : (item.description || item.title || ''), {
                x: cardX + 0.3, y: cardY + 0.7, w: 4.8, h: 1.3,
                fontSize: 12, fontFace: FONT_BODY, color: '334155', lineSpacing: 18
            });
        });

        // 3. 市场与机遇洞察 (Market Insight)
        const sMarket = pptx.addSlide();
        addSlideHeader(sMarket, '市场大盘与破局机会', 'MARKET INSIGHT');
        if (schema.market_insight?.industry_background) {
            sMarket.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.3, w: 11.4, h: 1.4,
                fill: { color: 'F8FAFC' }, line: { color: 'E2E8F0', width: 1 }
            });
            sMarket.addText('行业发展现状与宏观趋势', {
                x: 1.1, y: 1.45, w: 10.8, h: 0.3, fontSize: 11, fontFace: FONT_TITLE, color: theme.pptxAccent, bold: true
            });
            sMarket.addText(schema.market_insight.industry_background, {
                x: 1.1, y: 1.8, w: 10.8, h: 0.8, fontSize: 11, fontFace: FONT_BODY, color: '334155', lineSpacing: 16
            });
        }
        // 机遇 vs 挑战
        const opps = (schema.market_insight?.market_opportunities || []).slice(0, 3);
        const chals = (schema.market_insight?.market_challenges || []).slice(0, 3);
        sMarket.addShape(pptx.ShapeType.roundRect, {
            x: 0.8, y: 3.0, w: 5.5, h: 3.2, fill: { color: 'F0FDF4' }, line: { color: '86EFAC', width: 1 }
        });
        sMarket.addText('🚀 核心破局机遇 (Opportunities)', { x: 1.1, y: 3.2, w: 5.0, h: 0.4, fontSize: 13, bold: true, color: '15803D' });
        sMarket.addText(opps.map((o, i) => `${i+1}. ${o}`).join('\n\n'), { x: 1.1, y: 3.7, w: 4.9, h: 2.3, fontSize: 11, color: '166534', lineSpacing: 16 });

        sMarket.addShape(pptx.ShapeType.roundRect, {
            x: 6.7, y: 3.0, w: 5.5, h: 3.2, fill: { color: 'FEF2F2' }, line: { color: 'FECACA', width: 1 }
        });
        sMarket.addText('⚠️ 核心行业挑战 (Challenges)', { x: 7.0, y: 3.2, w: 5.0, h: 0.4, fontSize: 13, bold: true, color: 'B91C1C' });
        sMarket.addText(chals.map((c, i) => `${i+1}. ${c}`).join('\n\n'), { x: 7.0, y: 3.7, w: 4.9, h: 2.3, fontSize: 11, color: '991B1B', lineSpacing: 16 });

        // 4. 竞品对标矩阵 (Competitors)
        const sComp = pptx.addSlide();
        addSlideHeader(sComp, '竞品对标与差异化切入点', 'COMPETITIVE ANALYSIS');
        const comps = schema.market_insight?.competitors || [];
        if (comps.length > 0) {
            const compRows = [
                [
                    { text: '竞品/对标品牌', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                    { text: '核心优势与打法', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                    { text: '局限与痛点', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                    { text: '我方破局机会', options: { bold: true, fill: { color: theme.pptxAccent }, color: 'FFFFFF' } }
                ]
            ];
            comps.slice(0, 4).forEach(c => {
                compRows.push([
                    { text: c.name || '竞品', options: { bold: true, fill: { color: 'F8FAFC' } } },
                    { text: c.advantage || '-', options: { fill: { color: 'FFFFFF' } } },
                    { text: c.weakness || '-', options: { fill: { color: 'FFFFFF' } } },
                    { text: c.our_opportunity || '-', options: { fill: { color: theme.pptxLightBg }, bold: true, color: theme.textColor } }
                ]);
            });
            sComp.addTable(compRows, {
                x: 0.8, y: 1.4, w: 11.4, colW: [2.2, 3.1, 3.1, 3.0],
                fontSize: 10, fontFace: FONT_BODY, border: { pt: 1, color: 'CBD5E1' }
            });
        }

        // 5. 目标人群画像 (Personas)
        const sPersona = pptx.addSlide();
        addSlideHeader(sPersona, '目标受众画像与消费心智', 'TARGET PERSONAS');
        const personas = schema.market_insight?.personas || [];
        personas.slice(0, 3).forEach((p, idx) => {
            const pX = 0.8 + idx * 3.9;
            sPersona.addShape(pptx.ShapeType.roundRect, {
                x: pX, y: 1.4, w: 3.6, h: 4.9, fill: { color: 'FFFFFF' }, line: { color: theme.pptxAccent, width: 1 }
            });
            sPersona.addShape(pptx.ShapeType.rect, {
                x: pX, y: 1.4, w: 3.6, h: 0.8, fill: { color: theme.pptxHeaderBg }
            });
            sPersona.addText(p.name || `核心人群 ${idx+1}`, {
                x: pX + 0.2, y: 1.5, w: 3.2, h: 0.3, fontSize: 13, bold: true, color: 'FFFFFF'
            });
            sPersona.addText(p.age_range ? `年龄: ${p.age_range}` : '主力消费群体', {
                x: pX + 0.2, y: 1.8, w: 3.2, h: 0.3, fontSize: 10, color: '94A3B8'
            });
            const bodyText = [
                `🏷️ 核心特征:\n${Array.isArray(p.tags) ? p.tags.join('、') : (p.tags || '-')}`,
                `💡 核心痛点:\n${Array.isArray(p.pain_points) ? p.pain_points.join('\n') : (p.pain_points || '-')}`,
                `📱 媒介偏好:\n${Array.isArray(p.channel_preference) ? p.channel_preference.join('、') : (p.channel_preference || '-')}`
            ].join('\n\n');
            sPersona.addText(bodyText, {
                x: pX + 0.2, y: 2.3, w: 3.2, h: 3.8, fontSize: 10, color: '334155', lineSpacing: 14
            });
        });

        // 6. 核心战略定位 (Core Strategy)
        const sStrat = pptx.addSlide();
        addSlideHeader(sStrat, '品牌核心战略定位与价值主张', 'STRATEGIC POSITIONING');
        if (schema.core_strategy?.brand_positioning) {
            sStrat.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 1.4, w: 11.4, h: 1.3, fill: { color: theme.pptxLightBg }, line: { color: theme.pptxAccent, width: 1.5 }
            });
            sStrat.addText('🎯 核心定位定位 (Brand Positioning)', { x: 1.1, y: 1.55, w: 10.8, h: 0.3, fontSize: 12, bold: true, color: theme.pptxAccent });
            sStrat.addText(schema.core_strategy.brand_positioning, { x: 1.1, y: 1.9, w: 10.8, h: 0.7, fontSize: 13, bold: true, color: '0F172A' });
        }
        // 4P 框架
        const fp = schema.core_strategy?.strategic_framework_4p || {};
        const pList = [
            { k: 'Product (产品策略)', v: fp.product, icon: '📦' },
            { k: 'Price (价格策略)', v: fp.price, icon: '💰' },
            { k: 'Place (渠道策略)', v: fp.place, icon: '🌐' },
            { k: 'Promotion (推广策略)', v: fp.promotion, icon: '📣' }
        ];
        pList.forEach((item, idx) => {
            const pX = 0.8 + idx * 2.9;
            sStrat.addShape(pptx.ShapeType.roundRect, {
                x: pX, y: 3.0, w: 2.7, h: 3.2, fill: { color: 'F8FAFC' }, line: { color: 'CBD5E1', width: 1 }
            });
            sStrat.addText(`${item.icon} ${item.k}`, { x: pX + 0.15, y: 3.15, w: 2.4, h: 0.35, fontSize: 11, bold: true, color: theme.pptxHeaderBg });
            sStrat.addText(item.v || '暂无具体描述', { x: pX + 0.15, y: 3.6, w: 2.4, h: 2.4, fontSize: 10, color: '475569', lineSpacing: 14 });
        });

        // 7. 渠道矩阵打法 (Channel Matrix)
        const sChan = pptx.addSlide();
        addSlideHeader(sChan, '全域营销平台与内容矩阵', 'CHANNEL MATRIX');
        const channels = schema.channel_matrix || [];
        const chanRows = [
            [
                { text: '营销渠道/平台', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '平台角色定位', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '核心内容形式', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '运营节奏与打法', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '考核重点 (KPI)', options: { bold: true, fill: { color: theme.pptxAccent }, color: 'FFFFFF' } }
            ]
        ];
        channels.slice(0, 5).forEach(ch => {
            chanRows.push([
                { text: ch.platform || '渠道', options: { bold: true, fill: { color: 'F8FAFC' } } },
                { text: ch.role || '-', options: { fill: { color: 'FFFFFF' } } },
                { text: Array.isArray(ch.content_types) ? ch.content_types.join('、') : (ch.content_types || '-'), options: { fill: { color: 'FFFFFF' } } },
                { text: Array.isArray(ch.key_tactics) ? ch.key_tactics.join('；') : (ch.key_tactics || '-'), options: { fill: { color: 'FFFFFF' } } },
                { text: ch.kpi_focus || '-', options: { fill: { color: theme.pptxLightBg }, bold: true, color: theme.textColor } }
            ]);
        });
        sChan.addTable(chanRows, {
            x: 0.8, y: 1.4, w: 11.4, colW: [1.8, 2.2, 2.4, 3.4, 1.6],
            fontSize: 10, fontFace: FONT_BODY, border: { pt: 1, color: 'CBD5E1' }
        });

        // 8. 达人与KOL策略 (Influencer Matrix)
        const sKOL = pptx.addSlide();
        addSlideHeader(sKOL, 'KOL/KOC 达人矩阵与采买模型', 'INFLUENCER STRATEGY');
        const inf = schema.influencer_matrix || {};
        const tiers = inf.tier_breakdown || [];
        const kolRows = [
            [
                { text: '达人层级 (Tier)', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '预算占比', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '单价区间', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '合作数量/频次', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '核心合作目的', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } }
            ]
        ];
        tiers.forEach(t => {
            kolRows.push([
                { text: t.tier || '层级', options: { bold: true, fill: { color: 'F8FAFC' } } },
                { text: t.percentage ? `${t.percentage}%` : '-', options: { fill: { color: 'FFFFFF' }, bold: true, color: theme.pptxAccent } },
                { text: t.unit_price_range || '-', options: { fill: { color: 'FFFFFF' } } },
                { text: String(t.count || '-'), options: { fill: { color: 'FFFFFF' } } },
                { text: t.purpose || '-', options: { fill: { color: 'FFFFFF' } } }
            ]);
        });
        sKOL.addTable(kolRows, {
            x: 0.8, y: 1.4, w: 11.4, colW: [2.0, 1.8, 2.2, 2.0, 3.4],
            fontSize: 10, fontFace: FONT_BODY, border: { pt: 1, color: 'CBD5E1' }
        });
        // 达人筛选标准
        if (inf.selection_criteria && inf.selection_criteria.length > 0) {
            sKOL.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 4.8, w: 11.4, h: 1.5, fill: { color: theme.pptxLightBg }, line: { color: theme.pptxAccent, width: 1 }
            });
            sKOL.addText('⭐ 达人筛选与品控标准 (Selection Criteria):', { x: 1.1, y: 4.95, w: 10.8, h: 0.3, fontSize: 11, bold: true, color: theme.pptxAccent });
            sKOL.addText(inf.selection_criteria.join('  |  '), { x: 1.1, y: 5.3, w: 10.8, h: 0.8, fontSize: 10, color: '334155' });
        }

        // 9. 执行排期甘特 (Timeline)
        const sTime = pptx.addSlide();
        addSlideHeader(sTime, '分阶段推进路线图与里程碑', 'TIMELINE & PHASES');
        const phases = schema.timeline_phases || [];
        phases.slice(0, 4).forEach((ph, idx) => {
            const phX = 0.8 + idx * 2.9;
            sTime.addShape(pptx.ShapeType.roundRect, {
                x: phX, y: 1.4, w: 2.7, h: 4.9, fill: { color: 'FFFFFF' }, line: { color: theme.pptxAccent, width: 1 }
            });
            sTime.addShape(pptx.ShapeType.rect, {
                x: phX, y: 1.4, w: 2.7, h: 0.8, fill: { color: theme.pptxHeaderBg }
            });
            sTime.addText(`Phase 0${idx+1}: ${ph.phase_name}`, {
                x: phX + 0.1, y: 1.5, w: 2.5, h: 0.3, fontSize: 11, bold: true, color: 'FFFFFF'
            });
            sTime.addText(ph.period || '周期', {
                x: phX + 0.1, y: 1.8, w: 2.5, h: 0.3, fontSize: 9, color: '94A3B8'
            });
            const msText = [
                `🎯 阶段重点:\n${ph.focus || '-'}`,
                `🚩 核心里程碑:\n${Array.isArray(ph.milestones) ? ph.milestones.join('\n') : (ph.milestones || '-')}`,
                `📦 阶段交付物:\n${Array.isArray(ph.deliverables) ? ph.deliverables.join('\n') : (ph.deliverables || '-')}`
            ].join('\n\n');
            sTime.addText(msText, {
                x: phX + 0.15, y: 2.3, w: 2.4, h: 3.8, fontSize: 9.5, color: '334155', lineSpacing: 13
            });
        });

        // 10. 财务预算分配与 ROI (Budget & Finance)
        const sFin = pptx.addSlide();
        addSlideHeader(sFin, '营销预算分配与财务规划', 'BUDGET ALLOCATION');
        const fin = schema.finance_and_kpi || {};
        const bList = fin.budget_breakdown || [];
        const bRows = [
            [
                { text: '投放渠道/支出项目', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '预算占比 (%) ', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '预算预估金额', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } },
                { text: '使用说明与预期产出', options: { bold: true, fill: { color: theme.pptxHeaderBg }, color: 'FFFFFF' } }
            ]
        ];
        bList.forEach(b => {
            bRows.push([
                { text: b.channel || '渠道', options: { bold: true, fill: { color: 'F8FAFC' } } },
                { text: b.percentage ? `${b.percentage}%` : '-', options: { fill: { color: 'FFFFFF' }, bold: true, color: theme.pptxAccent } },
                { text: b.amount ? String(b.amount) : '根据总预算配比', options: { fill: { color: 'FFFFFF' } } },
                { text: b.note || '-', options: { fill: { color: 'FFFFFF' } } }
            ]);
        });
        sFin.addTable(bRows, {
            x: 0.8, y: 1.4, w: 11.4, colW: [2.5, 1.8, 2.5, 4.6],
            fontSize: 10, fontFace: FONT_BODY, border: { pt: 1, color: 'CBD5E1' }
        });
        if (fin.expected_roi) {
            sFin.addShape(pptx.ShapeType.roundRect, {
                x: 0.8, y: 4.8, w: 11.4, h: 1.5, fill: { color: 'F0FDF4' }, line: { color: '86EFAC', width: 1 }
            });
            sFin.addText('📈 综合 ROI 预期与财务回报模型:', { x: 1.1, y: 4.95, w: 10.8, h: 0.3, fontSize: 11, bold: true, color: '15803D' });
            sFin.addText(fin.expected_roi, { x: 1.1, y: 5.3, w: 10.8, h: 0.8, fontSize: 12, bold: true, color: '166534' });
        }

        // 11. 风险防范与封底 (Risk & Closing)
        const sClose = pptx.addSlide();
        sClose.background = { color: theme.pptxHeaderBg };
        sClose.addText('THANKS FOR WATCHING', { x: 1.0, y: 2.0, w: 11.0, h: 0.5, fontSize: 16, color: theme.pptxAccent, bold: true });
        sClose.addText('携手共创 · 驱动品牌全域确定性增长', { x: 1.0, y: 2.6, w: 11.0, h: 0.8, fontSize: 28, bold: true, color: 'FFFFFF' });
        sClose.addText(`提案品牌：${schema.meta?.brand_name || '贵公司'}\n方案生成时间：${new Date().toLocaleString()}`, {
            x: 1.0, y: 4.0, w: 11.0, h: 0.8, fontSize: 12, color: '94A3B8', lineSpacing: 18
        });

        // 导出文件
        const fileName = `${(schema.meta?.brand_name || 'proposal').replace(/\s+/g, '_')}_营销方案.pptx`;
        return pptx.writeFile({ fileName });
    }

    function listSlideRenderers() {
        return [
            "cover", "summary", "market", "competitors", "personas",
            "strategy", "channels", "influencers", "timeline", "finance", "closing"
        ];
    }

    function compileWithRegistry(schema, options) {
        return exportProposalToPptx(schema, options);
    }

    global.PptxCompiler = {
        exportProposalToPptx: exportProposalToPptx,
        listSlideRenderers: listSlideRenderers,
        compileWithRegistry: compileWithRegistry
    };
})(typeof window !== 'undefined' ? window : globalThis);
