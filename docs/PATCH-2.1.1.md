# التصحيح المحدود 2.1.1

تاريخ التنفيذ: 25 سبتمبر 2026. المصدر: حزمة FINAL 2.1.0 المرفقة.

## النتائج

- ألوان كاملة ومستقلة لكل قسم: PASS. الخلفيات والأسطح والحدود واللون الرئيسي والتحويم ولون التمييز والنصوص تتبع اللوحة المختارة في الوضعين.
- تباين اللوحات السبع: PASS لأزواج النصوص والأزرار والروابط والحقول والتركيز المحددة بالاختبارات. ليس اعتماد WCAG شاملًا؛ حدود البطاقات الزخرفية لا تمثل حدود حقول التحكم.
- استقلال القلب والورد بعد التنقل وإعادة التحميل: PASS؛ السيرة والقارئ لهما نطاقان ثابتان، والإدارة تستخدم الألوان الأساسية المحافظة.
- تسمية المكتبة: PASS في اللغات السبع. تغيير صفين فقط في القاموس. البطاقات الثلاث غير المتاحة أزيلت، وتبويب المكتبة يعرض الرسائل المفيدة الموجودة؛ البحث والمفضلة باقيان.
- التوطين: 960 مفتاحًا، صفر قيم مفقودة.
- الاختبارات: **106 ناجحة، صفر فشل**. تفاصيل المجموعات في `data/release-summary.json` وملفات النتائج داخل `tests`.
- ملفات PDF الخمسة: PASS قبل التصحيح وبعده، ببصمات SHA-256 الأصلية، دون قراءة المحتوى أو إعادة معالجة الملفات.
- ملف القرآن الاختباري والخادم: مطابقان بايتًا لبايت للنسخة المرفقة. النصوص الدينية المحمية الـ743 اجتازت الفحص القائم.

## اختبار القرآن الدائم

114 سورة، 6236 آية. الاختبار يزيل U+FEFF واحدًا من بداية نص الآية إن وجد، ثم يطبق NFC ويحسب SHA-256 لكل آية. الجذر هو SHA-256 لسلسلة بصمات الآيات السداسية الصغيرة المتجاورة، دون فاصل، بترتيب السورة ثم الآية. النتيجة:

`5b58aa48fb07265a53cea6abd510d226345357dd556250e30f3ba87b8a076499`

ينفذ `tests/quran-integrity.cjs` ضمن `npm test` وقبل البناء بواسطة `python3 scripts/build_portable.py`، ويوقف النجاح عند تغير العدد أو الترتيب أو الجذر. لا يضاف فحص ثقيل عند تحميل صفحات الزائر ولا يتغير مصدر القرآن التشغيلي. يتطلب البناء Node.js المتاح أصلًا لاختبارات المشروع.

## التفضيلات

المخزن الوحيد للألوان المختارة هو `zad_scoped_palettes_v1` (خريطة النطاق إلى اللون). مفاتيح `wird_palette_v1` و`zad_palette_v1` و`heart_palette_v1` و`hadith_palette_v1` للقراءة والترحيل فقط؛ لا تعاد كتابتها. أولوية اللون: اختيار نطاق محفوظ، ثم اختيار نطاق قديم صالح، ثم `zad_accent_v1`، ثم emerald. اختيار لون جديد لا يعدل قيمة `zad_accent_v1`.

الألوان القديمة blue→navy، red/rose/purple→burgundy، gold/mono→sand، orange→terracotta. التدرجات القديمة ترحل إلى أقرب عائلة هادئة موثقة في appearance.js؛ لا تنشأ تدرجات جديدة. الفروع مثل heart-azkar وheart-tasbih تشترك في نطاق heart. السمة المرئية الوحيدة للألوان هي data-accent؛ حُذف مسار data-palette المتنافس. الوضع الفاتح/الداكن يبقى عامًا.

## اختبارات تعذر تنفيذها

- Quran.com: طلب واحد إلى واجهة النص العثماني أعاد HTTP 403. لم تكرر المحاولة ولم تستخدم بيانات بديلة لإعطاء نتيجة مقارنة مصطنعة. A: المطابقات Unicode غير مقيمة؛ B: مطابقات NFC وإزالة U+0640 غير مقيمة؛ C: الفروق الجوهرية غير مقيمة. تقرير آلي في `data/quran-crosscheck.json`.
- معاينة 390 و1440 بكسل للوحات emerald وnavy وburgundy: غير منفذة لأن سياسة متصفح الجلسة منعت الوصول إلى المشروع المحلي. لا لقطات شاشة ولا ادعاء بتحقق التخطيط بصريًا.

لم يعد تدقيق الميزات الأخرى أو تغيير Supabase، ولم ينشر أي ملف من backend/review-only. أعيد تشغيل الاختبارات الموجودة، بما فيها المسارات المحلية وHTTP تحت مسار فرعي.

## الملفات المعدلة أو المضافة

- `README.md`
- `admin.html`
- `assets/css/design-system.css`
- `assets/js/appearance.js`
- `assets/js/heart-hadith.js`
- `assets/js/i18n-catalog.js`
- `assets/js/i18n.js`
- `assets/js/quran.js`
- `assets/js/settings.js`
- `assets/js/steadfastness.js`
- `data/accent-palettes.json`
- `data/quran-crosscheck.json`
- `data/release-manifest.json`
- `data/release-summary.json`
- `data/ui-inventory.json`
- `data/visual-qa-status.json`
- `docs/CHANGELOG.md`
- `docs/LOCALIZATION.md`
- `docs/PATCH-2.1.1.md`
- `docs/QA.md`
- `index.html`
- `package-lock.json`
- `package.json`
- `reader.html`
- `scripts/build_portable.py`
- `scripts/package_release.py`
- `seerah.html`
- `source-pages/index.html`
- `source-pages/reader.html`
- `source-pages/seerah.html`
- `tests/localization-results.json`
- `tests/localization.cjs`
- `tests/media-localization-results.json`
- `tests/palettes-paths-results.json`
- `tests/palettes-paths.cjs`
- `tests/quran-integrity-results.json`
- `tests/quran-integrity.cjs`
- `tests/scoped-colors-results.json`
- `tests/scoped-colors.cjs`
