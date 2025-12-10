# 委内瑞拉化妆品贸易项目方案

## 项目概述
这是一个关于委内瑞拉化妆品贸易项目方案的静态网站，展示了从市场背景到风险行动的完整方案内容。

## 部署指南

### 方法一：通过Netlify网页界面部署（推荐）

1. **准备GitHub仓库**
   - 创建一个新的GitHub仓库
   - 将本项目的所有文件推送到GitHub仓库
   ```bash
   git remote add origin https://github.com/your-username/venezuela-cosmetic-trade.git
   git push -u origin main
   ```

2. **部署到Netlify**
   - 访问 [Netlify官网](https://www.netlify.com/)
   - 注册/登录您的Netlify账号
   - 点击"Add new site" > "Import an existing project"
   - 选择"GitHub"并授权访问您的仓库
   - 选择您的仓库名称
   - 配置部署设置：
     - Build command: 留空（这是静态网站）
     - Publish directory: . (根目录)
   - 点击"Deploy site"

3. **完成部署**
   - 部署完成后，Netlify会提供一个自动生成的URL
   - 您可以在Netlify控制台中自定义域名

### 方法二：本地开发

```bash
# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000 查看网站
```

## 项目结构
```
├── index.html          # 主页面文件
├── .gitignore          # Git忽略配置
├── netlify.toml        # Netlify部署配置
├── package.json        # 项目配置
└── README.md           # 项目说明文档
```

## 技术栈
- HTML5
- Tailwind CSS (CDN)
- Font Awesome (CDN)
- Chart.js (CDN)

## 注意事项
- 本网站使用了Tailwind CSS、Font Awesome和Chart.js的CDN链接
- 页面包含响应式设计，支持移动端和桌面端
- 所有图片使用了picsum.photos的占位图