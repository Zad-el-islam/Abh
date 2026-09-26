from pathlib import Path
import json,hashlib
from PIL import Image,ImageFont,ImageDraw
root=Path(__file__).resolve().parents[2];out=root/'tests/two-fix'
q=json.loads((root/'tests/fixtures/quran-source.json').read_text())['data']['surahs']
prefix=q[0]['ayahs'][0]['text'].removeprefix('\ufeff')+' '
texts={f'{n}:1':q[n-1]['ayahs'][0]['text'][len(prefix):] for n in [2,3]}
assert texts['2:1']==texts['3:1']
fontpath=root/'assets/fonts/noto-sans-arabic-arabic-wght-normal.woff2'
report={'engine':'Pillow/RAQM with exact bundled font; not a browser layout test','sourceCharactersChanged':False,'fontFile':str(fontpath.relative_to(root)),'fontSHA256':hashlib.sha256(fontpath.read_bytes()).hexdigest(),'widths':[390,768,1440],'samples':[]}
im=Image.new('RGB',(1080,540),'white');d=ImageDraw.Draw(im)
for col,width in enumerate(report['widths']):
 size=round(min(48,max(24,28+width*.003)))
 font=ImageFont.truetype(str(fontpath),size)
 for row,(theme,bg,fg) in enumerate([('light','#fffefa','#252d28'),('dark','#1b2420','#e4e8e5')]):
  x=col*360;y=row*270
  d.rectangle((x,y,x+359,y+269),fill=bg);d.text((x+16,y+16),f'{width}px / {theme} / font {size}px',fill=fg)
  for i,(key,text) in enumerate(texts.items()):
   baseline=y+100+i*112
   d.text((x+16,baseline-30),key,fill=fg)
   d.text((x+220,baseline),text,font=font,anchor='rs',direction='rtl',fill=fg)
   box=font.getbbox(text,anchor='ls',direction='rtl')
   mask=Image.new('L',(200,200),0);ImageDraw.Draw(mask).text((100,100),text,font=font,anchor='rs',direction='rtl',fill=255)
   points={(xx,yy) for yy in range(200) for xx in range(200) if mask.getpixel((xx,yy))>=90};components=[]
   while points:
    seed=points.pop();stack=[seed];component=[seed]
    while stack:
     xx,yy=stack.pop()
     for dx in [-1,0,1]:
      for dy in [-1,0,1]:
       near=(xx+dx,yy+dy)
       if near in points:points.remove(near);stack.append(near);component.append(near)
    if len(component)>=2:
     xs,ys=zip(*component);components.append({'area':len(component),'box':[min(xs),min(ys),max(xs),max(ys)]})
   marks=[c for c in components if c['box'][3]<100-size*.42 and c['box'][3]-c['box'][1]<size*.2]
   assert len(marks)==2,(size,components)
   assert box[3]-box[1]<size*2.9
   report['samples'].append({'verseKey':key,'width':width,'theme':theme,'fontPx':size,'inkBoxPx':box,'separateMaddComponents':len(marks),'lineHeightPx':size*2.9,'pass':True})
im.save(out/'opening-font-proof.png')
(out/'font-results.json').write_text(json.dumps(report,indent=2)+'\n')
print({'fontSamples':len(report['samples']),'pass':True})
