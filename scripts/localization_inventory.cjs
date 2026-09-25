/* Generates an audit index, never a second runtime translation catalog. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),box={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/js/i18n-catalog.js'),'utf8'),box);
const catalog=box.window.ZadI18nCatalog,languages=['ar','en','fr','id','tr','ur','es'];
const files=['assets/js','source-pages'].flatMap(dir=>fs.readdirSync(path.join(root,dir)).filter(f=>/\.(js|html)$/.test(f)&&!['i18n-catalog.js','supabase-2.110.8.js'].includes(f)).map(f=>dir+'/'+f));
const contents=Object.fromEntries(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
const entries=Object.entries(catalog).map(([key,row])=>({key,category:'B: interface',namespace:key.split('.')[0],arabicReference:row.ar,definedLanguages:languages.filter(l=>typeof row[l]==='string'&&row[l].trim()),usedIn:files.filter(f=>contents[f].includes(key)||contents[f].includes(row.ar))}));
fs.writeFileSync(path.join(root,'data/ui-inventory.json'),JSON.stringify({catalog:'assets/js/i18n-catalog.js',note:'Source-reference index; usedIn includes explicit keys and editorial UI reference strings resolved by ui(). Entries are not another translation store.',entries},null,2)+'\n');
const terms=['زاد الإسلام','الورد اليومي','موسوعة الحديث','المكتبة الإسلامية','الإعدادات','المفضلة','بحث','حسابي','القارئ','الأذكار','المسبحة'];
const table=['| العربية | English | Français | Bahasa Indonesia | Türkçe | اردو | Español |','| --- | --- | --- | --- | --- | --- | --- |'];for(const term of terms){const row=Object.values(catalog).find(r=>r.ar===term);if(row)table.push('| '+languages.map(l=>row[l].replaceAll('|','\\|')).join(' | ')+' |');}
fs.writeFileSync(path.join(root,'docs/TERMINOLOGY.md'),'# مصطلحات الواجهة\n\nالمصدر: القاموس المركزي. «القارئ» في أدوات التلاوة يعني Reciter؛ قارئ الملفات هو PDF reader. يظل اسم المنتج Zad El-Islam ثابتًا في اللغات ذات الحروف اللاتينية. أسماء الكتب والقراء والمراجع الأصلية بيانات مصدر، وليست نصوص واجهة يعاد تأليفها.\n\n'+table.join('\n')+'\n');
console.log(JSON.stringify({keys:entries.length,values:entries.length*languages.length,index:'data/ui-inventory.json'}));
