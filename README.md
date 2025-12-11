# 智能营销方案集合

这是一个智能营销方案的集合，包含多个行业和品牌的营销方案，每个方案都有独立的HTML页面，可以通过GitHub Pages访问。

## 项目结构

```
智能营销/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions部署配置
├── docs/                  # 文档文件目录
│   ├── 各种PDF、Word和Markdown文档...
├── images/                # 图片资源目录
│   ├── 各种项目图片...
├── DR.COSMO.html              # DR.COSMO品牌抖音执行规划
├── binjiang-listed-company.html # 滨江上市公司方案
├── branding-digital.html       # 品牌数字化方案
├── chenshiyiliao.html          # 辰时医疗方案
├── guojimaoyi.html             # 国际贸易方案
├── helian.html                 # 赫联牛仔方案
├── xianxiaozhu.html            # 仙小主方案
├── xianyupro.html              # 仙域普方案
└── zhongyaokafei.html          # 中药咖啡方案
```

## 访问链接

所有方案页面都已部署到GitHub Pages，可以通过以下链接访问：

### 营销方案页面

| 方案名称 | 访问链接 |
|---------|---------|
| DR.COSMO品牌抖音执行规划 | [DR.COSMO.html](https://zen-zeng.github.io/smart-marketing-collection/DR.COSMO.html) |
| 滨江上市公司方案 | [binjiang-listed-company.html](https://zen-zeng.github.io/smart-marketing-collection/binjiang-listed-company.html) |
| 品牌数字化方案 | [branding-digital.html](https://zen-zeng.github.io/smart-marketing-collection/branding-digital.html) |
| 辰时医疗方案 | [chenshiyiliao.html](https://zen-zeng.github.io/smart-marketing-collection/chenshiyiliao.html) |
| 国际贸易方案 | [guojimaoyi.html](https://zen-zeng.github.io/smart-marketing-collection/guojimaoyi.html) |
| 赫联牛仔方案 | [helian.html](https://zen-zeng.github.io/smart-marketing-collection/helian.html) |
| 仙小主方案 | [xianxiaozhu.html](https://zen-zeng.github.io/smart-marketing-collection/xianxiaozhu.html) |
| 仙域普方案 | [xianyupro.html](https://zen-zeng.github.io/smart-marketing-collection/xianyupro.html) |
| 中药咖啡方案 | [zhongyaokafei.html](https://zen-zeng.github.io/smart-marketing-collection/zhongyaokafei.html) |

## 部署说明

项目使用GitHub Actions自动部署到GitHub Pages，部署配置位于 `.github/workflows/deploy.yml`。

部署规则：
- 当代码推送到 `main` 分支时，自动触发部署
- 部署到 `gh-pages` 分支
- 访问URL：https://zen-zeng.github.io/smart-marketing-collection/

## 本地开发

1. 克隆仓库到本地
2. 在项目根目录启动HTTP服务器
   ```bash
   python3 -m http.server 8000
   ```
3. 在浏览器中访问 `http://localhost:8000`

## 贡献指南

欢迎提交新的营销方案或改进现有方案！

1. Fork本仓库
2. 创建新的分支
3. 添加或修改文件
4. 提交PR

## 许可证

MIT License
