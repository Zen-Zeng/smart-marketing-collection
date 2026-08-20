# 智能营销项目集合

一个整合了多个智能营销项目的集合，通过GitHub Pages部署，方便访问和管理不同的项目网页。

## 项目列表

| 项目名称 | 描述 | 访问路径 |
|---------|------|---------|
| DR.COSMO | 品牌中国市场执行框架 | [/DR.COSMO/](/DR.COSMO/) |
| branding-digital | 数字品牌营销平台 | [/branding-digital/](/branding-digital/) |
| 滨江上市公司 | 杭州市滨江区上市公司发展报告 | [/滨江上市公司/](/滨江上市公司/) |
| zhongyaokafei | 中国大陆中药成分类咖啡市场研究报告 | [/zhongyaokafei/](/zhongyaokafei/) |
| helian | 赫联牛仔小红书账号运营规划 | [/helian/](/helian/) |
| 仙小主 | 品牌战略对齐会提案 | [/仙小主/](/仙小主/) |
| chenshiyiliao | 辰时医疗营销方案 | [/chenshiyiliao/](/chenshiyiliao/) |
| guojimaoyi | 国际贸易项目 | [/guojimaoyi/](/guojimaoyi/) |

## 技术栈

- HTML5
- Tailwind CSS
- Font Awesome
- Chart.js (部分项目)
- GitHub Pages

## 部署方式

### 1. 本地部署

直接在浏览器中打开 `index.html` 文件即可查看项目列表页面。

### 2. GitHub Pages 部署

#### 步骤 1: 克隆仓库

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

#### 步骤 2: 初始化仓库 (如果是新建仓库)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

#### 步骤 3: 启用 GitHub Pages

1. 登录 GitHub，进入仓库设置
2. 找到 "Pages" 选项
3. 选择 "main" 分支作为发布源
4. 点击 "Save" 按钮
5. 等待几分钟，GitHub Pages 将会部署完成

#### 步骤 4: 访问部署后的网站

部署完成后，你可以通过以下地址访问项目集合：

```
https://your-username.github.io/your-repo-name/
```

访问具体项目：

```
https://your-username.github.io/your-repo-name/项目名称/
```

## 自动部署

本项目已配置 GitHub Actions 自动部署，当你推送代码到 `main` 分支时，GitHub Actions 会自动构建并部署到 GitHub Pages。

### 工作流配置

工作流配置文件位于 `.github/workflows/deploy.yml`，内容如下：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
```

## 项目结构

```
.
├── index.html              # 项目集合主页
├── .gitignore              # Git忽略文件配置
├── README.md               # 项目说明文档
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions部署配置
├── DR.COSMO/               # DR.COSMO项目
│   ├── index.html
│   └── ...
├── branding-digital/       # branding-digital项目
│   ├── index.html
│   └── ...
├── 滨江上市公司/           # 滨江上市公司项目
│   ├── index.html
│   └── ...
├── zhongyaokafei/          # zhongyaokafei项目
│   ├── index.html
│   └── ...
├── helian/                 # helian项目
│   ├── index.html
│   └── ...
├── 仙小主/                 # 仙小主项目
│   ├── index.html
│   └── ...
├── chenshiyiliao/          # chenshiyiliao项目
│   ├── index.html
│   └── ...
└── guojimaoyi/             # guojimaoyi项目
    ├── index.html
    └── ...
```

## 添加新项目

1. 在根目录下创建新的项目文件夹
2. 将项目文件放入该文件夹
3. 在 `index.html` 中添加新项目的卡片链接
4. 在 `README.md` 中更新项目列表
5. 推送代码到 GitHub

## 开发说明

- 所有项目均为静态HTML文件，无需编译
- 每个项目文件夹独立，互不影响
- 使用相对路径引用资源文件，确保部署后能正常访问
- 建议使用CDN引入第三方库，减少项目体积

## 浏览器兼容性

支持所有现代浏览器（Chrome、Firefox、Safari、Edge等）。

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

如有问题，请通过 GitHub Issues 联系我们。