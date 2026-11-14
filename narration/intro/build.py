# 문장별 음성 -> 하나의 내레이션 + 자막 시간 + 장면 목록 -> Remotion 설정 파일
import json, subprocess, os, re, wave, struct
D = os.path.dirname(os.path.abspath(__file__))
OUT = '/home/user/reels-factory'
disp = json.load(open(f'{D}/display.json'))
def dur(p): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p]))
LEAD, GAP, PGAP, TAIL = 0.6, 0.35, 0.8, 2.0
# 1) 오디오 이어붙이기 + 문장 시간표
t = LEAD; times = []; parts = [('sil', LEAD)]
for i, d in enumerate(disp):
    if i > 0:
        g = PGAP if d['para'] != disp[i-1]['para'] else GAP
        parts.append(('sil', g)); t += g
    w = f'{D}/wav/{i:03d}.wav'; L = dur(w); times.append((t, t + L)); parts.append(('wav', w)); t += L
parts.append(('sil', TAIL)); total = round(t + TAIL, 2)
lst = []
for k, (kind, v) in enumerate(parts):
    if kind == 'sil':
        p = f'{D}/sil_{k}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-t',str(v),'-i','anullsrc=r=44100:cl=mono',p], check=True)
    else:
        p = f'{D}/r_{k}.wav'
        subprocess.run(['ffmpeg','-v','error','-y','-i',v,'-ar','44100','-ac','1',p], check=True)
    lst.append(f"file '{p}'")
open(f'{D}/concat.txt','w').write('\n'.join(lst))
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',f'{D}/concat.txt','-af','loudnorm=I=-16:TP=-1.5','-ar','48000',f'{OUT}/public/narration-intro.wav'], check=True)
# 2) 자막: 문장을 2줄 이내(약 26자) 조각으로, 글자 수 비율로 시간 배분
def chunks(s, lim=26):
    words = s.split(' '); out = []; cur = ''
    for w in words:
        cand = (cur + ' ' + w).strip()
        if len(cand) > lim and cur:
            out.append(cur); cur = w
        else:
            cur = cand
        if re.search(r'[,.!?]$', cur) and len(cur) >= lim * 0.55:
            out.append(cur); cur = ''
    if cur: out.append(cur)
    merged = []
    for c in out:   # 너무 짧은 조각(8자 미만)은 앞 조각에 붙이기
        if merged and (len(c) < 8 or len(merged[-1]) < 8) and len(merged[-1]) + len(c) + 1 <= 34:
            merged[-1] = merged[-1] + ' ' + c
        else:
            merged.append(c)
    return merged
subs = []
for (a, b), d in zip(times, disp):
    cs = chunks(d['text']); n = sum(len(c) for c in cs); x = a
    for c in cs:
        y = x + (b - a) * len(c) / n
        subs.append({'start': round(x, 2), 'end': round(y, 2), 'text': c}); x = y
# 3) 장면: 문장 번호 -> (종류, 파일, 시작 오프셋/움직임)
V = lambda src, frm, maxlen, pos=None: {'type': 'video', 'src': f'intro/{src}', 'from': frm, 'max': maxlen, **({'position': pos} if pos else {})}
I = lambda src, motion='in', pos=None, **k: {'type': 'image', 'src': f'intro/{src}', 'motion': motion, **({'position': pos} if pos else {}), **k}
PAN = lambda src, a=0, b=100: I(src, 'pan', panFrom=a, panTo=b)
plan = {
 0: I('img13.jpg','in','45% 30%'), 1: V('a.mp4',2.5,12), 2: I('profile.jpg','out','50% 30%'), 3: V('hero.mp4',96.5,10), 4: V('a.mp4',23.0,7.4),
 5: I('photo21.jpg','in'), 6: V('v2.mp4',0.7,8.6), 7: PAN('photo18.jpg',0,100), 8: I('photo27.jpg','in','50% 25%'), 9: I('photo10.jpg','out'),
 10: I('photo22.jpg','in'), 11: I('photo08.jpg','in'),
 12: V('hero.mp4',43.0,10.2), 13: V('hero.mp4',12.3,4.3), 14: PAN('photo05.jpg',0,100),
 15: V('hero.mp4',37.0,5.7), 16: I('photo06.jpg','in','50% 30%'), 17: I('photo02.jpg','out'), 18: V('hero.mp4',57.1,6.3), 19: PAN('photo19.jpg',100,0), 20: PAN('photo29.jpg',20,80),
 21: I('photo16.jpg','in'), 22: V('hero.mp4',82.7,8.7), 23: I('photo17.jpg','out'),
 24: V('c.mp4',0.0,8.0), 25: I('img14.jpg','in','40% 50%'), 26: V('hero.mp4',70.8,11.1), 27: I('photo01.jpg','in'), 28: V('b.mp4',0.0,16.4),
 29: I('img15.jpg','in','52% 40%'), 30: I('photo03.jpg','out'), 31: V('c.mp4',8.0,13.0), 32: PAN('photo12.jpg',0,100), 33: I('img11.jpg','in','70% 40%'), 34: I('img12.jpg','out','50% 25%'),
}
fill = ['photo11.jpg','photo25.jpg','photo09.jpg','photo26.jpg','photo28.jpg','photo14.jpg','photo15.jpg','photo04.jpg']
scenes = []; fi = 0
starts = [0.0] + [times[i][0] - (GAP/2) for i in range(1, len(times))]
for i in range(len(times)):
    st = starts[i]; en = starts[i+1] if i + 1 < len(times) else total
    s = dict(plan[i]); s['start'] = round(st, 2); mx = s.pop('max', None)
    scenes.append(s)
    if mx is not None and en - st > mx - 0.5:   # 영상 길이가 모자라면 남는 시간은 사진으로
        f = fill[fi % len(fill)]; fi += 1
        scenes.append({"type": "image", "src": f"intro/{f}", "motion": "in", "start": round(st + mx - 0.6, 2)})
cfg = {'audio': 'narration-intro.wav', 'durationSec': total, 'seriesTitle': 'Move to Find Yourself',
       'opening': {'start': 0.4, 'end': round(times[0][1] + 0.3, 2), 'text': '사막에서도\n몽클레어 팔,\n소밍입니다'},
       'scenes': scenes, 'subtitles': subs[len(chunks(disp[0]['text'])):] }
json.dump(cfg, open(f'{OUT}/episodes/intro-full.json','w'), ensure_ascii=False, indent=1)
print('total', total, 'sentences', len(times), 'subs', len(cfg['subtitles']), 'scenes', len(scenes))
