"""Build one clean source-and-production ZIP after the documented test gates pass."""
from pathlib import Path
import hashlib,json,zipfile,sys
root=Path(__file__).resolve().parent.parent
out=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else root.parent/'output'/'Zad-El-Islam-FINAL.zip'
reports=['results','backend-results','static-results','localization-results','media-localization-results','palettes-paths-results','quran-integrity-results','scoped-colors-results','backend-security-results','backend-live-results','owner-live-results','owner-social-ui-results','rouh-gateway-results']
counts={}
for name in reports:
    r=json.loads((root/'tests'/f'{name}.json').read_text())
    failed=r.get('failed',len([x for x in r.get('results',[]) if x.get('status')=='failed']))
    if failed: raise SystemExit(f'Failed gate: {name}')
    counts[name]=r.get('passed',len([x for x in r.get('results',[]) if x.get('status')=='passed']))
roots={'assets','source-pages','scripts','data','docs','tests','supabase'}
loose={'.nojekyll','index.html','admin.html','reader.html','seerah.html','README.md','package.json','package-lock.json','book.pdf','thalathat_al_usul.pdf','kitab_al_tawhid.pdf','al_aqidah_al_wasitiyyah.pdf','quran.pdf'}
def selected(p):
    rel=p.relative_to(root)
    return p.is_file() and not p.is_symlink() and (rel.parts[0] in roots or rel.as_posix() in loose) and not any(part in {'node_modules','__pycache__','.git'} for part in rel.parts) and p.suffix not in {'.pyc','.log','.bak'}
files=sorted(p for p in root.rglob('*') if selected(p))
manifest=root/'data'/'release-manifest.json'
entries=[{'file':p.relative_to(root).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in files if p!=manifest]
manifest.write_text(json.dumps(entries,indent=2)+'\n')
if manifest not in files:files.append(manifest)
out.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:z.write(p,p.relative_to(root).as_posix())
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    assert 'index.html' in z.namelist()
    assert not any(n.startswith('backend/') for n in z.namelist())
    assert not any('node_modules' in n or n.endswith(('.log','.bak')) for n in z.namelist())
    for e in entries:assert hashlib.sha256(z.read(e['file'])).hexdigest()==e['sha256'],e['file']
print(json.dumps({'file':str(out),'bytes':out.stat().st_size,'files':len(files),'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'checks':counts,'total_passed':sum(counts.values())}))
