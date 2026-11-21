# site-src — 사이트 빌드 원본 백업 (2026-11-21)

11/13 전에 작업 컨테이너가 초기화되면서 `/home/claude`에 있던 빌드 원본이 사라졌어요. 여기는 동욱님이 다시 첨부해 준 파일을 모아 둔 백업이에요. **라이브 사이트(main 브랜치)에 올라간 결과물이 항상 가장 최신**이니, 다시 빌드할 때는 main의 HTML을 기준으로 삼고 여기 원본은 참고용으로 쓰세요.

## 들어 있는 것

| 폴더 | 내용 |
|---|---|
| `build/` | `build_public.py` 끝에서 exec하던 조각들: 카드 페이지(`build_cards.py`), 코드 모션 기법 166편(`build_motionlab.py`), Opus 영상 갤러리(`build_opusgal.py`), 가이드 FAQ·SEO 제목(`add_faq.py`), GoatCounter 삽입(`add_analytics.py`) |
| `aimotion/uses.py` | 코드 모션 기법별 용도·활용법 데이터(우리가 직접 쓴 글) |
| `guides/` | 가이드 9편의 원본 조각(`<!--meta-->` 머리말 포함). camera-moves는 14가지 시절 원본이라 라이브(53가지)보다 오래됐어요 |
| `radar/index-src.html` | /radar/ 페이지 원본, `collect_local_old.py`는 예전 로컬 수집기(지금은 main의 `radar/collect.py`가 GitHub Actions에서 돌아요) |
| `public-src-old/` | 메인 페이지 원본의 예전 버전 2개(카드 데이터 추가 전·후) |
| `promo-site-example/` | 사이트 활용 예시 광고 영상 합성(`compose.py` + `explain.html`) |
| `docs/` | 10/21 운영 현황, 배포·광고 안내, 10/14 SEO 점검 메모 |
| `misc/`, `other/` | privacy·robots·ads.txt 원본, '광고 공식 공방' 페이지 |

영상 예시 도구(`audio.py`, `lib.js`, `build_myvid.py`, `compose_pairs.py`, `scenes/`)는 이 브랜치의 `prompt-videos/`에 있는 쪽이 더 최신이에요.

## 사라져서 복구 못 한 것

- `build_public.py` (전체 빌드 스크립트 본체), 최신 `public-src.html`
- `cards_rich.json`(카드 201장 상세 데이터) — 라이브 `index.html`과 `/card/*.html`에 결과가 들어 있어요
- `aimotion/index.json`·기법 노트 — 라이브 `/prompts/code-motion/*.html`에 결과가 있어요
- `export_cards.js`, 유튜브 API 키 파일(키는 GitHub 시크릿 `YT_API_KEY`에 있어요)

다음에 큰 수정을 할 때는 라이브 HTML을 직접 고치거나, 위 조각을 바탕으로 `build_public.py`를 다시 쓰는 방식으로 가면 돼요. 새로 만든 원본은 이 폴더에 바로 커밋해 두세요.
