#!/usr/bin/env bash
# 사이트 재빌드: data/site-data.json → index.html 내장 데이터 → 카드 페이지 201장 · cards.json · sitemap · llms.txt
# 사용: bash build.sh <main 체크아웃 경로>      (--check 를 붙이면 쓰지 않고 비교만)
set -euo pipefail
SITE=$(cd "$1" && pwd); HERE=$(cd "$(dirname "$0")" && pwd)
python3 "$HERE/embed.py" "$SITE"
NODE_PATH=$(npm root -g) node "$HERE/export_items.js" "$SITE/index.html" "$HERE/.items.json"
python3 "$HERE/build_cards.py" "$HERE/.items.json" "$SITE" ${2:-}
