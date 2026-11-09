from pathlib import Path
import subprocess, json, hashlib
root=Path(__file__).resolve().parents[3]
work=root/'.reel-work'; out=root/'apps/web/public/video'
(work/'sources').mkdir(parents=True,exist_ok=True)
out.mkdir(parents=True,exist_ok=True)
for source in json.loads((Path(__file__).parent/'sources.json').read_text()):
 path=work/f"sources/{source['id']}.mp4"
 if not path.exists():
  subprocess.run(['curl','-L','--fail',source['downloadUrl'],'-o',str(path)],check=True)
 if hashlib.sha256(path.read_bytes()).hexdigest()!=source['sha256']:
  raise RuntimeError(f"Source hash changed: {source['id']}. Check the source and licence before use.")
def run(args):
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','warning','-y','-threads','4',*args],check=True)
# Six shots. All trims are in source seconds; playback speed is 80%.
shots=[
 ('40223',1.5,4.0,"hue=h=-18:s=1.05,eq=brightness=-0.055:contrast=1.08:saturation=1.1"),
 ('1973',2.0,3.0,"crop=1440:810:300:80,scale=1920:1080,eq=brightness=-0.045:contrast=1.08:saturation=0.78,colorbalance=rs=0.015:bs=0.025:rh=0.035:bh=-0.02"),
 ('51010',1.5,2.5,"transpose=1,hue=h=25:s=0.82,eq=brightness=-0.065:contrast=1.12:gamma=0.85"),
 ('1973',7.0,1.5,"crop=1152:648:420:110,scale=1920:1080,eq=brightness=-0.045:contrast=1.08:saturation=0.78,colorbalance=rs=0.015:bs=0.025:rh=0.035:bh=-0.02"),
 ('51010',5.0,2.5,"transpose=1,hue=h=25:s=0.82,eq=brightness=-0.065:contrast=1.12:gamma=0.85"),
 ('101007',4.0,3.5,"hue=h=-6:s=0.95,eq=brightness=-0.10:contrast=1.1:gamma=0.9"),
]
for n,(src,start,dur,grade) in enumerate(shots):
 vf=f'trim=start={start}:duration={dur*0.8},setpts=(PTS-STARTPTS)/0.8,fps=24,{grade},setsar=1,format=yuv420p,setparams=range=limited:color_primaries=bt709:color_trc=bt709:colorspace=bt709'
 run(['-i',str(work/f'sources/{src}.mp4'),'-an','-vf',vf,'-frames:v',str(round(dur*24)),'-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-c:v','libx264','-preset','fast','-crf','12',str(work/f'shot-{n}.mp4')])
(work/'concat.txt').write_text(''.join(f"file 'shot-{n}.mp4'\n" for n in range(len(shots))))
run(['-f','concat','-safe','0','-i',str(work/'concat.txt'),'-c','copy',str(work/'montage.mp4')])
# Carry the first second into the tail. Remove it from the head.
# The wrap is the next source frame, not a reversed or frozen shot.
fg='[0:v]split=2[h][b];[h]trim=start=0:end=1,setpts=PTS-STARTPTS[head];[b]trim=start=1:end=17,setpts=PTS-STARTPTS[body];[body][head]xfade=transition=fade:duration=1:offset=15,format=yuv420p[v]'
run(['-i',str(work/'montage.mp4'),'-filter_complex_threads','2','-filter_complex',fg,'-map','[v]','-an','-frames:v','384','-c:v','libx264','-preset','slow','-crf','12',str(work/'master.mp4')])
master=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','stream=nb_frames:format=duration','-of','json',str(work/'master.mp4')]))
assert master['streams'][0]['nb_frames']=='384' and float(master['format']['duration'])==16.0
for p in [1,2]:
 run(['-i',str(work/'master.mp4'),'-an','-c:v','libx264','-preset','slow','-b:v','1700k','-pass',str(p),'-passlogfile',str(work/'h264-pass'),'-pix_fmt','yuv420p','-profile:v','high','-level','4.1','-g','48','-movflags','+faststart',*(['-f','null','/dev/null'] if p==1 else [str(out/'hero-reel.mp4')])])
for p in [1,2]:
 run(['-i',str(work/'master.mp4'),'-an','-c:v','libvpx-vp9','-b:v','1450k','-pass',str(p),'-passlogfile',str(work/'vp9-pass'),'-deadline','good','-cpu-used','3','-row-mt','1','-tile-columns','2','-pix_fmt','yuv420p','-g','48',*(['-f','null','/dev/null'] if p==1 else [str(out/'hero-reel.webm')])])
run(['-i',str(out/'hero-reel.mp4'),'-frames:v','1','-q:v','3','-update','1',str(out/'hero-reel-poster.jpg')])

for name,budget in [("hero-reel.mp4",4_000_000),("hero-reel.webm",4_000_000),("hero-reel-poster.jpg",200_000)]:
 assert (out/name).stat().st_size<=budget, f"File exceeds budget: {name}"
