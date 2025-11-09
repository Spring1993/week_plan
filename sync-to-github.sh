#!/bin/bash

# 周末计划同步脚本
# 用途：将导出的 JSON 文件同步到 GitHub，让其他设备可以看到

cd "$(dirname "$0")"

echo "📦 周末计划同步工具"
echo "===================="
echo ""

# 查找最新的导出文件
EXPORT_FILE="$HOME/Downloads/weekend_plans.json"

if [ ! -f "$EXPORT_FILE" ]; then
  echo "❌ 未找到导出文件"
  echo ""
  echo "请先在网页上点击右上角的"导出"按钮"
  echo "文件会保存到: $EXPORT_FILE"
  echo ""
  exit 1
fi

echo "✓ 找到导出文件: $EXPORT_FILE"
echo ""

# 复制到 data.json
cp "$EXPORT_FILE" data.json
echo "✓ 已更新 data.json"
echo ""

# 提交并推送
echo "正在提交到 GitHub..."
git add data.json
git commit -m "sync: update weekend plans [$(date '+%Y-%m-%d %H:%M:%S')]"
git push

echo ""
echo "✅ 同步完成！"
echo ""
echo "现在其他设备打开以下链接即可看到最新数据："
echo "https://spring1993.github.io/week_plan/"
echo ""
echo "提示：GitHub Pages 需要 1-2 分钟部署，请稍后刷新。"
