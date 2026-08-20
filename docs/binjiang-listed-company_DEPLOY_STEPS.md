# GitHub Pages部署步骤

## 1. 手动创建GitHub仓库

1. 打开GitHub网站：https://github.com/
2. 登录您的GitHub账号
3. 点击页面右上角的"+"图标，选择"New repository"
4. 在"Repository name"字段中输入：`binjiangcompany`
5. 选择仓库可见性（建议选择"Public"）
6. 不要勾选"Initialize this repository with a README"
7. 点击"Create repository"按钮

## 2. 推送代码到GitHub仓库

创建仓库后，执行以下命令推送代码：

```bash
cd /Users/andornot/iCloud云盘/Documents/工作资料/AOT/DAO/智能营销/滨江上市公司
git push -u origin main
```

## 3. 配置GitHub Pages

1. 进入GitHub仓库页面
2. 点击顶部导航栏的"Settings"
3. 在左侧边栏中点击"Pages"
4. 在"Source"部分：
   - 选择"Deploy from a branch"
   - 在"Branch"下拉菜单中选择"gh-pages"
   - 在"Folder"下拉菜单中选择"/ (root)"
5. 点击"Save"

## 4. 等待部署完成

GitHub Actions工作流会自动执行并部署网站到GitHub Pages。您可以在仓库的"Actions"标签页查看部署进度。

部署完成后，您将看到一个URL，格式为：`https://your-username.github.io/binjiangcompany/`

## 5. 访问网站

使用GitHub Pages提供的URL访问您的网站。

## 注意事项

- 如果gh-pages分支不存在，GitHub Actions工作流会自动创建它
- 首次部署可能需要几分钟时间
- 如果遇到404错误，请等待片刻后刷新页面