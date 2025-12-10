# 杭州市滨江区上市公司发展报告

## 项目说明

本项目是将两个网页合并后的结果，以现代化设计风格展示杭州市滨江区74家上市公司的发展情况。

## 文件说明

- **merged.html**：带高德地图的完整版本
  - 包含所有原始内容
  - 集成高德地图展示企业分布
  - 使用现代化卡片式布局

- **merged_no_map.html**：不带地图的简化版本
  - 包含所有原始内容
  - 移除了高德地图依赖
  - 适合快速访问和分享

## 部署说明

### 本地预览

```bash
# 启动本地HTTP服务器
python3 -m http.server 8080
```

访问地址：
- 完整版本：http://localhost:8080/merged.html
- 简化版本：http://localhost:8080/merged_no_map.html

### 远程部署

```bash
# 添加远程仓库（请替换为实际仓库地址）
git remote add origin <仓库URL>

# 推送代码到远程仓库
git push -u origin main
```

## 技术栈

- HTML5
- Tailwind CSS
- Chart.js
- 高德地图API

## 数据说明

- 基于2025年12月最新统计数据
- 上市公司数量：74家
- 产业结构：软件服务、安防监控、生物医药等

## 版权信息

© 2025 杭州市滨江区上市公司发展报告