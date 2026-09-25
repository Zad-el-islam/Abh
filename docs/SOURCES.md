# المصادر والتراخيص

- النصوص الدينية والروابط وقوائم السيرة وملفات PDF مأخوذة من ملفات المشروع المرفقة. لم تُولد آيات أو أحاديث أو ترجمات دينية جديدة. بقيت مراجع الأحاديث والأذكار كما كانت في المحتوى الأصلي.
- [Al Quran Cloud API](https://alquran.cloud/api): مصدر النص العثماني، والمصدر البديل المحدد لترجمات المعاني. ملف اختبار القرآن مأخوذ من `https://api.alquran.cloud/v1/quran/quran-uthmani` يوم 24 سبتمبر 2026.
- [Quran Foundation — Translation resources](https://api-docs.quran.foundation/docs/content_apis_versioned/4.0.0/translations/): مرجع اختيار مورد الترجمة. يعتمد الاختيار في الكود على `language_name`، ويعرض القارئ المصدر المستخدم.
- ملفات `tests/fixtures/translation-*.json` عينات أصلية لسورة الفاتحة من الإصدارات `en.sahih` و`fr.hamidullah` و`id.indonesian` و`tr.diyanet` و`ur.jalandhry` و`es.cortes`، جُمعت يوم 24 سبتمبر 2026 لاختبار العقود. لا تُحمّل هذه العينات عند تشغيل الموقع.
- البحث الخارجي عن الحديث يستخدم [الدرر السنية](https://dorar.net/hadith)، دون إدخال مفتاح API أو ادعاء توثيق آلي جديد للمحتوى.
- Noto Sans Arabic وAmiri: ملفات خطوط محلية من توزيعات Fontsource، مع نصي ترخيص SIL Open Font License في `docs/licenses/`. استخدام الخطوط لا يتطلب اتصالًا بـGoogle Fonts.
- `assets/js/supabase-2.110.8.js`: نسخة المورد المضمنة أصلًا في المشروع، مفصولة في ملف مستقل دون إعادة بناء أو تعديل.
- ملفات SVG الخاصة بالهوية والأيقونات واجهة بسيطة مكتوبة للمشروع، ولا تعتمد على حزمة أيقونات كبيرة.

