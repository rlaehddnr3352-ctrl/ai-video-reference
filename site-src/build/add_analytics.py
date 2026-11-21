"""Insert the GoatCounter snippet into every .html page under a folder (idempotent).
Usage: python3 add_analytics.py <dir> [<dir> ...]
GoatCounter: cookie-free, no personal data stored, free for non-commercial-scale sites.
"""
import os, sys

GC_CODE = "aivideoref"  # dashboard: https://aivideoref.goatcounter.com
SNIPPET = (f'<script data-goatcounter="https://{GC_CODE}.goatcounter.com/count" '
           'async src="//gc.zgo.at/count.js"></script>')
MARK = "data-goatcounter="
SKIP = {"google7e8cf5726c06818a.html"}  # search console verification file

def patch(root):
    n = 0
    for dp, dns, fns in os.walk(root):
        dns[:] = [d for d in dns if d != ".git"]
        for fn in fns:
            if not fn.endswith(".html") or fn in SKIP:
                continue
            p = os.path.join(dp, fn)
            s = open(p, encoding="utf-8").read()
            if MARK in s or "</body>" not in s:
                continue
            i = s.rfind("</body>")
            s = s[:i] + SNIPPET + "\n" + s[i:]
            open(p, "w", encoding="utf-8").write(s)
            n += 1
    return n

if __name__ == "__main__":
    for d in sys.argv[1:]:
        print(d, "patched", patch(d))
