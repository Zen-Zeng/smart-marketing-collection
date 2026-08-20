# 仙小主项目

这是仙小主品牌的营销方案网页项目。

## 项目结构

```
├── index.html          # 主页面文件
├── 仙小主方案框架.md   # 方案框架文档
├── .gitignore         # Git忽略文件
└── README.md          # 项目说明文件
```

## 本地运行

在项目根目录下执行以下命令启动本地服务器：

```bash
python3 -m http.server 8000
```

然后在浏览器中访问：http://localhost:8000

## 部署到GitHub Pages

### 1. 在GitHub上创建仓库

1. 登录GitHub账户
2. 点击右上角的「+」图标，选择「New repository」
3. 填写仓库名称（建议使用 `xianxiaozhu` 或其他有意义的名称）
4. 选择「Public」或「Private」（GitHub Pages需要Public仓库或GitHub Pro账户）
5. 点击「Create repository」

### 2. 关联本地仓库与GitHub仓库

在本地项目目录下执行以下命令（替换 `<your-github-username>` 和 `<your-repository-name>` 为实际值）：

```bash
git remote add origin https://github.com/<your-github-username>/<your-repository-name>.git
git branch -M main
git push -u origin main
```

### 3. 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击「Settings」选项卡
3. 在左侧菜单中选择「Pages」
4. 在「Source」部分，选择「main」分支，然后选择「/root」目录
5. 点击「Save」按钮
6. 等待几分钟，GitHub Pages将部署完成

部署完成后，您可以通过以下URL访问您的网站：
```
https://<your-github-username>.github.io/<your-repository-name>/
```

## 更新部署

当您对项目进行更改后，执行以下命令更新GitHub Pages部署：

```bash
git add .
git commit -m "Update content"
git push origin main
```

GitHub Pages将自动重新部署您的网站。