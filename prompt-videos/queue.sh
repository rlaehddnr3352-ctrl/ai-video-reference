cd /home/claude/myvid
python3 render.py b3 m11 m12 m13 m14 m15 m16 m17 m18 m19 m20 > log_b3.txt 2>&1
python3 render.py b4 e01 e02 e04 e05 e06 e07 e08 e09 e10 e11 e12 > log_b4.txt 2>&1
python3 render.py b6 g01 g02 g04 g05 g06 g07 g08 > log_b6.txt 2>&1
python3 render.py b5 d02 d03 d04 d05 d06 d07 d08 d09 d10 > log_b5.txt 2>&1
ls out/*.mp4 | wc -l
