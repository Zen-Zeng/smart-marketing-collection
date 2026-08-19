# 智能营销方案集合

> 多行业品牌营销解决方案的静态展示平台，每个方案为独立的自包含 HTML 页面，通过 GitHub Pages 对外访问。

**线上地址**：[https://zen-zeng.github.io/smart-marketing-collection/](https://zen-zeng.github.io/smart-marketing-collection/)

---

## 目录

- [项目结构](#项目结构)
- [方案列表](#方案列表)
- [本地开发](#本地开发)
- [新增方案指南](#新增方案指南)
- [开发规范](#开发规范)
- [部署说明](#部署说明)
- [许可证](#许可证)

---

## 项目结构

```
smart-marketing-collection/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── assets/
│   ├── css/
│   │   └── shared.css          # 全局公共样式（设计 Token、工具类）
│   └── js/
│       └── shared.js           # 全局公共脚本（回到顶部、滚动动画）
├── docs/                        # 各方案原始素材（PDF、Word、Markdown）
├── images/                      # 品牌数据图片资源
├── index.html                   # 首页导航（方案入口）
├── *.html                       # 各方案独立页面
├── .editorconfig                # 编辑器代码风格统一配置
└── README.md
```

---

## 方案列表

| 方案名称 | 文件 | 行业 |
|---------|------|------|
| **AI 方案大师**（生成工具） | [generator.html](generator.html) | — |
| 天问山黄精天猫运营方案 | [tianwenshan.html](projects/zhangyiding/tianwenshan.html) | 食品/滋补 |
| 夸克智能全域资产增值方案 | [QuarkAI.html](QuarkAI.html) | 科技/营销 |
| DR.COSMO 品牌抖音执行规划 | [DR.COSMO.html](DR.COSMO.html) | 美妆 |
| 滨江上市公司发展报告 | [binjiang-listed-company.html](binjiang-listed-company.html) | 区域经济 |
| 辰时医疗方案 | [chenshiyiliao.html](chenshiyiliao.html) | 医疗 |
| 国际贸易方案 | [guojimaoyi.html](guojimaoyi.html) | 跨境贸易 |
| 赫联牛仔小红书运营方案 | [helian.html](helian.html) | 服装 |
| 仙小主品牌战略提案 | [xianxiaozhu.html](xianxiaozhu.html) | 美妆 |
| 仙域普·品牌库存资产方案 | [xianyupro.html](xianyupro.html) | 电商 |
| 中药咖啡市场研究报告 | [zhongyaokafei.html](zhongyaokafei.html) | 食品/饮品 |
| 灵稀×元易空间 数字化文化资产方案 | [jdlx.html](jdlx.html) | 文化/NFT |
| OPC小龙虾·AI智能评测方案 | [ai_pingce.html](ai_pingce.html) | AI/测评 |
| 跨境医美出海方案 | [kuajingyimei.html](kuajingyimei.html) | 医美 |
| 顺鑫农业×程前IP 商业方案 | [shunxin_agriculture.html](projects/zhangyiding/shunxin_agriculture.html) | 农业/食品 |

---

## 本地开发

无需安装任何依赖，所有库均通过 CDN 加载：

```bash
# 克隆仓库
git clone https://github.com/zen-zeng/smart-marketing-collection.git
cd smart-marketing-collection

# 启动本地 HTTP 服务器（任选其一）
python3 -m http.server 8000
# 或
npx serve .
```

访问 [http://localhost:8000](http://localhost:8000) 查看首页。

---

## 新增方案指南

### 1. 创建 HTML 文件

在仓库根目录创建 `your-project.html`，按以下模板起始：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="[80字以内的方案简介]">
    <title>[方案名称] | 智能营销方案集合</title>
    <link rel="stylesheet" href="assets/css/shared.css">
    <!-- 在此引入 Tailwind CSS / Chart.js 等第三方库 -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* 页面专属样式 */
    </style>
</head>
<body>
    <!-- 页面内容 -->

    <script src="assets/js/shared.js"></script>
    <!-- 页面专属脚本 -->
</body>
</html>
```

**关键要点**：
- `shared.css` 必须在所有其他样式表之前引入
- `shared.js` 必须在 `</body>` 前最后引入
- `<title>` 格式统一为：`[方案名称] | 智能营销方案集合`
- `<meta name="description">` 不超过 160 个字符

### 2. 更新首页导航

在 `index.html` 的方案列表网格中添加卡片：

```html
<a href="your-project.html" class="project-card bg-white p-8 rounded-lg shadow-sm border-t-4 border-[品牌色]">
    <h3 class="text-xl font-bold mb-3">方案名称</h3>
    <p class="text-gray-600 mb-4">方案简介（2-3 句话）</p>
    <div class="inline-flex items-center gap-2 text-[品牌色] font-medium">
        查看详情
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
    </div>
</a>
```

### 3. 更新 README

在上方方案列表表格中添加对应行。

---

## 开发规范

### HTML

| 项目 | 规范 |
|------|------|
| 文档声明 | `<!DOCTYPE html>` |
| 语言属性 | `<html lang="zh-CN">` |
| 字符集 | `<meta charset="UTF-8">` |
| 视口 | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` |
| 描述 | `<meta name="description">` 必填，≤ 160 字符 |
| 标题格式 | `[方案名称] \| 智能营销方案集合` |
| 无障碍 | 图片须有 `alt`，表单控件须有 `label` |
| 链接 | 外部链接加 `target="_blank" rel="noopener noreferrer"` |

### CSS

| 项目 | 规范 |
|------|------|
| 公共样式 | 使用 `assets/css/shared.css` 中定义的 CSS 变量（间距、圆角、阴影、动画） |
| 框架 | 优先使用 Tailwind CSS，页面专属样式写在 `<style>` 块中 |
| 图表容器 | 使用 `.chart-container` 类统一 Chart.js / ECharts 容器尺寸 |
| 悬停动效 | 使用 `.card-hover` 类实现统一卡片悬浮效果 |
| 滚动淡入 | 给需要淡入的区块添加 `.section-fade` 类（由 shared.js 自动处理） |

### JavaScript

| 项目 | 规范 |
|------|------|
| 公共功能 | 回到顶部按钮、滚动淡入、导航阴影由 `assets/js/shared.js` 统一提供 |
| 图表 | Chart.js（折线/柱状/饼图）或 ECharts（复杂业务图表） |
| 运行时编译 | 禁止在生产页面使用 Babel standalone 编译 JSX（影响性能） |
| 安全 | 禁止在前端 HTML 中硬编码 API Key |

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 方案页面 | 小写，单词间用连字符 | `my-project.html` |
| 图片资源 | 品牌名+描述，禁止空格 | `brandname_用途.png` |
| 文档素材 | `项目名_文件说明` | `helian_README.md` |

### 代码风格

详见 [`.editorconfig`](.editorconfig)：
- 缩进：4 空格（HTML/CSS/JS），2 空格（YAML/JSON/Markdown）
- 换行：LF
- 编码：UTF-8
- 文件末尾：保留空行

---

## 部署说明

项目通过 **GitHub Actions** 自动部署到 **GitHub Pages**。

**触发条件**：
- 推送到 `main` 分支
- 手动触发（Actions 页面 → `workflow_dispatch`）

**部署流程**：

```
push to main
    → actions/checkout@v4
    → actions/configure-pages@v5
    → actions/upload-pages-artifact@v3  (上传整个仓库根目录)
    → actions/deploy-pages@v4
    → https://zen-zeng.github.io/smart-marketing-collection/
```

配置文件：[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

## 许可证

[MIT License](LICENSE)

© 2025 智能营销方案集合
