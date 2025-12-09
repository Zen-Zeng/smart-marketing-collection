#!/bin/bash

# 一键部署脚本 - 整合仓库创建、代码推送和GitHub Actions配置
# 单一仓库部署版本：将所有智能营销项目部署到一个GitHub仓库

echo "==================================="
echo "智能营销项目集合 - 一键GitHub部署脚本"
echo "==================================="

# 定义GitHub用户名为Zen-Zeng
github_username="Zen-Zeng"

# 定义要创建的单一仓库名称
single_repo_name="smart-marketing-collection"

# 注意：GitHub Token已移除以避免安全风险
# 请在使用时手动添加您的GitHub Token
tokens=(
  "YOUR_GITHUB_TOKEN_HERE"
)

# 检查curl是否安装
check_curl() {
  if ! command -v curl &> /dev/null; then
    echo "❌ 错误: curl未安装，请先安装curl"
    return 1
  fi
  return 0
}

# 检查git是否安装
check_git() {
  if ! command -v git &> /dev/null; then
    echo "❌ 错误: git未安装，请先安装git"
    return 1
  fi
  return 0
}

# 使用GitHub API创建仓库
create_github_repo() {
  local repo_name="$1"
  local repo_desc="$2"
  local token_index=0
  
  echo "🔄 正在尝试创建GitHub仓库: $repo_name"
  
  while [ $token_index -lt ${#tokens[@]} ]; do
    local token="${tokens[$token_index]}"
    local response=$(curl -s -w "%{http_code}" -H "Authorization: token $token" \
      -d "{\"name\":\"$repo_name\",\"description\":\"$repo_desc\",\"private\":false}" \
      https://api.github.com/user/repos)
    
    local http_code=${response: -3}
    local response_body=${response%???}
    
    case $http_code in
      201) # 仓库创建成功
        echo "✅ 仓库 $repo_name 创建成功！"
        return 0
        ;;
      422) # 仓库已存在
        echo "ℹ️  仓库 $repo_name 已存在，跳过创建"
        return 0
        ;;
      403) # 权限不足或API请求限制
        echo "⚠️  Token ${token:0:15}... 请求被限制或权限不足，尝试下一个Token"
        ((token_index++))
        ;;
      401) # Token无效
        echo "⚠️  Token ${token:0:15}... 无效，尝试下一个Token"
        ((token_index++))
        ;;
      *) # 其他错误
        echo "❌ 仓库 $repo_name 创建失败，HTTP状态码: $http_code"
        echo "   错误信息: $response_body"
        ((token_index++))
        ;;
    esac
  done
  
  echo "❌ 所有Token都无法创建仓库 $repo_name"
  return 1
}

# 配置Git并推送代码
deploy_project() {
  local repo_name="$1"
  local project_name="$2"
  
  echo "
📂 正在部署智能营销项目集合 ($repo_name)"
  
  # 检查当前目录是否包含index.html文件
  if [ ! -f "index.html" ]; then
    echo "❌ 错误: 当前目录不是智能营销项目集合的根目录！"
    return 1
  fi
  
  # 检查是否已初始化git
  if [ ! -d ".git" ]; then
    echo "🔄 初始化Git仓库..."
    git init
  fi
  
  # 添加.gitignore文件（如果不存在）
  if [ ! -f ".gitignore" ]; then
    echo "📄 创建.gitignore文件..."
    cat > .gitignore << EOF
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~
EOF
  fi
  
  # 确保GitHub Actions配置存在
  if [ ! -d ".github/workflows" ]; then
    echo "⚙️ 添加GitHub Actions自动部署配置..."
    mkdir -p .github/workflows
    cat > .github/workflows/deploy.yml << EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
        publish_branch: gh-pages
EOF
  fi
  
  # 提交所有文件
  echo "📝 提交代码..."
  git add .
  git commit -m "部署智能营销项目集合到单一仓库"
  
  # 配置远程仓库
  echo "🔗 配置远程仓库..."
  git remote rm origin 2>/dev/null || true
  git remote add origin "https://github.com/$github_username/$repo_name.git"
  
  # 推送代码
  echo "🚀 推送代码到GitHub..."
  if git push -u origin main; then
    echo "✅ 代码推送成功！"
    
    # 尝试手动创建并推送gh-pages分支（如果GitHub Actions失败的备选方案）
    echo "🔄 尝试创建并推送gh-pages分支..."
    git checkout -b gh-pages 2>/dev/null || git checkout gh-pages
    git push -u origin gh-pages 2>/dev/null || echo "ℹ️ gh-pages分支可能已经存在或推送失败"
    git checkout main
    
    # 配置GitHub Pages使用gh-pages分支
    echo "⚙️ 配置GitHub Pages使用gh-pages分支..."
    local token_index=0
    local pages_configured=false
    
    while [ $token_index -lt ${#tokens[@]} ] && [ "$pages_configured" = false ]; do
      local token="${tokens[$token_index]}"
      local response=$(curl -s -w "%{http_code}" -X PUT \
        -H "Authorization: token $token" \
        -H "Content-Type: application/json" \
        -d '{"source": {"branch": "gh-pages", "path": "/"}}' \
        https://api.github.com/repos/$github_username/$repo_name/pages)
      
      local http_code=${response: -3}
      
      case $http_code in
        201|204) # 配置成功
          echo "✅ GitHub Pages配置成功！"
          pages_configured=true
          ;;
        403) # 权限不足
          echo "⚠️ Token ${token:0:15}... 权限不足，尝试下一个Token"
          ((token_index++))
          ;;
        401) # Token无效
          echo "⚠️  Token ${token:0:15}... 无效，尝试下一个Token"
          ((token_index++))
          ;;
        *) # 其他错误
          echo "⚠️ GitHub Pages配置失败，HTTP状态码: $http_code"
          ((token_index++))
          ;;
      esac
    done
    
    # 生成访问URL
    local access_url="https://$github_username.github.io/$repo_name/"
    echo "🌐 项目集合访问URL: $access_url"
    echo "ℹ️ GitHub Pages可能需要几分钟时间来构建和更新"
    echo "ℹ️ 访问具体项目：$access_url/项目名称/"
    return 0
  else
    echo "❌ 代码推送失败！"
    echo "💡 可能需要手动输入GitHub凭据进行认证"
    return 1
  fi
}

# 主函数
main() {
  # 检查环境
  if ! check_curl || ! check_git; then
    return 1
  fi
  
  echo "
当前智能营销项目集合包含以下项目："
  # 显示所有项目目录
  for dir in */; do
    if [ -d "$dir" ] && [ -f "$dir/index.html" ]; then
      echo "- ${dir%/}"
    fi
  done
  
  # 确认是否继续部署
  echo -e "
是否继续将所有项目部署到单一GitHub仓库？(y/n): "
  read -r confirm
  
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "
部署已取消！"
    return 0
  fi
  
  # 创建GitHub仓库
  local repo_desc="智能营销项目集合，包含多个营销策划和市场分析项目"
  create_github_repo "$single_repo_name" "$repo_desc"
  
  # 部署项目集合
  echo "
==================================="
  echo "开始部署智能营销项目集合"
  echo "==================================="
  
  if deploy_project "$single_repo_name" "智能营销项目集合"; then
    echo "
==================================="
    echo "✅ 智能营销项目集合部署成功！"
    echo "==================================="
  else
    echo "
==================================="
    echo "❌ 智能营销项目集合部署失败！"
    echo "==================================="
  fi
  
  echo "
🎉 部署完成！您可以通过以下步骤查看部署状态："
  echo "1. 访问 https://github.com/$github_username/$single_repo_name"
  echo "2. 进入 Actions 标签页查看部署进度"
  echo "3. 部署完成后，通过 https://$github_username.github.io/$single_repo_name/ 访问项目集合"
  
  echo "
注意：GitHub Pages可能需要几分钟时间来更新。如果部署失败，您可以手动尝试推送代码并检查GitHub Actions日志。"
}

# 执行主函数
main