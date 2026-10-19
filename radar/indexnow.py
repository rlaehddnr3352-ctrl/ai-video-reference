"""IndexNow(네이버·빙 등)에 바뀐 주소를 알립니다. 배포 직후 실행.
  python3 radar/indexnow.py            # sitemap.xml의 모든 주소
  python3 radar/indexnow.py URL ...    # 지정한 주소만
키 파일: 사이트 루트의 8abc0ba6e3aa43b3b4fe4b9be5dad652.txt (공개 키라 저장소에 있어도 됩니다)
"""
import json, os, re, sys, urllib.request, urllib.error
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEY = "8abc0ba6e3aa43b3b4fe4b9be5dad652"
HOST = "ai-video-reference-kr.netlify.app"
urls = sys.argv[1:] or re.findall(r"<loc>(.*?)</loc>", open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read())
body = json.dumps({"host": HOST, "key": KEY, "keyLocation": f"https://{HOST}/{KEY}.txt", "urlList": urls}).encode()
for ep in ["https://searchadvisor.naver.com/indexnow", "https://api.indexnow.org/indexnow"]:
    req = urllib.request.Request(ep, data=body, headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        r = urllib.request.urlopen(req, timeout=20); print(ep, r.status, len(urls))
    except urllib.error.HTTPError as e:
        print(ep, e.code, e.read()[:200])
    except Exception as e:
        print(ep, "실패", e)
