# promo-tools (사이트 배포와 무관한 홍보 영상 도구 브랜치)

- `rank-video/` — '오늘의 터진 쇼츠 TOP 5' 30초 9:16 영상 템플릿
  - `python3 rank-video/make_rank.py <ai-video-reference main 체크아웃>/radar/archive <YYYY-MM-DD> <YYYY-MM-DD> promo/today-top5-MMDD.mp4 rank-video/bgm.m4a`
  - 필요: Playwright(Chromium), ffmpeg, Noto Sans CJK KR
- `promo/` — 게시용 mp4 (raw.githubusercontent.com 주소로 Metricool·iHatePosting에 전달)
- 모든 커밋에 [skip netlify]
