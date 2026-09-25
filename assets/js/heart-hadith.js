! function() {
  "use strict";
  const t = "heart_palette_v1",
    e = "heart_daily_done_v1",
    a = "heart_visit_days_v1",
    n = "heart_azkar_v1",
    o = "heart_tasbih_totals_v1",
    r = "heart_tasbih_daily_v1",
    i = "hadith_palette_v1",
    c = [{
      id: "h01",
      cat: "النية",
      text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.",
      source: "متفق عليه"
    }, {
      id: "h02",
      cat: "الدين",
      text: "الدين النصيحة.",
      source: "رواه مسلم"
    }, {
      id: "h03",
      cat: "الأخلاق",
      text: "المسلم من سلم المسلمون من لسانه ويده.",
      source: "متفق عليه"
    }, {
      id: "h04",
      cat: "الأخوة",
      text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.",
      source: "متفق عليه"
    }, {
      id: "h05",
      cat: "اللسان",
      text: "من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت.",
      source: "متفق عليه"
    }, {
      id: "h06",
      cat: "الصدقة",
      text: "الكلمة الطيبة صدقة.",
      source: "متفق عليه"
    }, {
      id: "h07",
      cat: "الغضب",
      text: "لا تغضب.",
      source: "رواه البخاري"
    }, {
      id: "h08",
      cat: "الغضب",
      text: "ليس الشديد بالصرعة، إنما الشديد الذي يملك نفسه عند الغضب.",
      source: "متفق عليه"
    }, {
      id: "h09",
      cat: "الرفق",
      text: "إن الله رفيق يحب الرفق في الأمر كله.",
      source: "متفق عليه"
    }, {
      id: "h10",
      cat: "الرحمة",
      text: "من لا يَرحم لا يُرحم.",
      source: "متفق عليه"
    }, {
      id: "h11",
      cat: "التعاون",
      text: "والله في عون العبد ما كان العبد في عون أخيه.",
      source: "رواه مسلم"
    }, {
      id: "h12",
      cat: "الستر",
      text: "من ستر مسلمًا ستره الله في الدنيا والآخرة.",
      source: "رواه مسلم"
    }, {
      id: "h13",
      cat: "العلم",
      text: "من سلك طريقًا يلتمس فيه علمًا، سهل الله له به طريقًا إلى الجنة.",
      source: "رواه مسلم"
    }, {
      id: "h14",
      cat: "القرآن",
      text: "خيركم من تعلم القرآن وعلمه.",
      source: "رواه البخاري"
    }, {
      id: "h15",
      cat: "الطهارة",
      text: "الطهور شطر الإيمان.",
      source: "رواه مسلم"
    }, {
      id: "h16",
      cat: "العمل",
      text: "أحب الأعمال إلى الله أدومها وإن قل.",
      source: "متفق عليه"
    }, {
      id: "h17",
      cat: "الصلاة على النبي",
      text: "من صلى علي واحدة صلى الله عليه بها عشرًا.",
      source: "رواه مسلم"
    }, {
      id: "h18",
      cat: "الذكر",
      text: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن: سبحان الله وبحمده، سبحان الله العظيم.",
      source: "متفق عليه"
    }, {
      id: "h19",
      cat: "الذكر",
      text: "لا حول ولا قوة إلا بالله كنز من كنوز الجنة.",
      source: "متفق عليه"
    }, {
      id: "h20",
      cat: "الرضا",
      text: "عجبًا لأمر المؤمن، إن أمره كله له خير.",
      source: "رواه مسلم"
    }, {
      id: "h21",
      cat: "الصبر",
      text: "ما أعطي أحد عطاء خيرًا وأوسع من الصبر.",
      source: "متفق عليه"
    }, {
      id: "h22",
      cat: "التوبة",
      text: "التائب من الذنب كمن لا ذنب له.",
      source: "رواه ابن ماجه، وحسنه الألباني"
    }, {
      id: "h23",
      cat: "حسن الظن",
      text: "أنا عند ظن عبدي بي، وأنا معه إذا ذكرني.",
      source: "متفق عليه"
    }, {
      id: "h24",
      cat: "الفقه",
      text: "من يرد الله به خيرًا يفقهه في الدين.",
      source: "متفق عليه"
    }, {
      id: "h25",
      cat: "التيسير",
      text: "يسروا ولا تعسروا، وبشروا ولا تنفروا.",
      source: "متفق عليه"
    }, {
      id: "h26",
      cat: "القوة",
      text: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير.",
      source: "رواه مسلم"
    }, {
      id: "h27",
      cat: "التقوى",
      text: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن.",
      source: "رواه الترمذي وقال: حديث حسن"
    }, {
      id: "h28",
      cat: "الأخلاق",
      text: "البر حسن الخلق.",
      source: "رواه مسلم"
    }, {
      id: "h29",
      cat: "المعروف",
      text: "لا تحقرن من المعروف شيئًا، ولو أن تلقى أخاك بوجه طلق.",
      source: "رواه مسلم"
    }, {
      id: "h30",
      cat: "الدلالة على الخير",
      text: "من دل على خير فله مثل أجر فاعله.",
      source: "رواه مسلم"
    }],
    s = ["سُبْحَانَ اللهِ وَبِحَمْدِهِ", "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ", "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ", "الْحَمْدُ للهِ", "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ", "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ", "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ", "سُبْحَانَ اللهِ وَالْحَمْدُ للهِ وَاللهُ أَكْبَرُ", "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ", "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ"],
    d = ["heart-hadith.9d35ac750a", "heart-hadith.09d71c516b", "heart-hadith.d1b7b6bf53", "heart-hadith.5283d35d7e", "heart-hadith.52bb5a3d5b", "heart-hadith.f0c17f9066", "heart-hadith.466da69421", "heart-hadith.667326d92d", "heart-hadith.1aca5d532f", "heart-hadith.6138c5dedc", "heart-hadith.2a3b51276e", "heart-hadith.bec819a5b1", "heart-hadith.3139e721c9", "heart-hadith.5405ba405b", "heart-hadith.b6fc1c079a", "heart-hadith.f279d9ebce", "heart-hadith.eeacf6c451", "heart-hadith.d5413cafcb", "heart-hadith.393060f212", "heart-hadith.fb7011a21d", "heart-hadith.a2d7f62d36", "heart-hadith.a16c9c87f6", "heart-hadith.5b4bb7506d", "heart-hadith.ef6c629dab", "heart-hadith.f9b6df7fa8", "heart-hadith.ed506cb088", "heart-hadith.0809e6a4d5", "heart-hadith.408dc01b54", "heart-hadith.edfe613532", "heart-hadith.eda8fba653"],
    u = [
      ["أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", "الرعد: ٢٨"],
      ["قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَى أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ", "الزمر: ٥٣"],
      ["وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", "الطلاق: ٣"],
      ["إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", "البقرة: ١٥٣"],
      ["لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", "إبراهيم: ٧"],
      ["وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ", "آل عمران: ١٣٤"],
      ["فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا", "الشرح: ٥–٦"],
      ["لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", "البقرة: ٢٨٦"],
      ["وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ", "الحديد: ٤"],
      ["وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ", "ق: ١٦"],
      ["فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", "البقرة: ١٨٦"],
      ["وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", "العنكبوت: ٦٩"],
      ["وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنْتُمُ الْأَعْلَوْنَ إِنْ كُنْتُمْ مُؤْمِنِينَ", "آل عمران: ١٣٩"],
      ["قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا", "التوبة: ٥١"],
      ["إِنَّهُ لَا يَيْأَسُ مِنْ رَوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ", "يوسف: ٨٧"],
      ["فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", "البقرة: ١٥٢"],
      ["رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", "الفرقان: ٧٤"],
      ["وَبِالْوَالِدَيْنِ إِحْسَانًا", "الإسراء: ٢٣"],
      ["إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", "الحجرات: ١٠"],
      ["وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا وَبِالْوَالِدَيْنِ إِحْسَانًا", "النساء: ٣٦"],
      ["يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنْكَرِ وَاصْبِرْ عَلَى مَا أَصَابَكَ", "لقمان: ١٧"],
      ["إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ", "النحل: ٩٠"],
      ["يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ", "التوبة: ١١٩"],
      ["فَاقْرَؤُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ", "المزمل: ٢٠"],
      ["قَدْ أَفْلَحَ مَنْ تَزَكَّى ۝ وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّى", "الأعلى: ١٤–١٥"],
      ["قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ", "المؤمنون: ١–٢"],
      ["يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَصُوحًا", "التحريم: ٨"],
      ["يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَلْتَنْظُرْ نَفْسٌ مَا قَدَّمَتْ لِغَدٍ", "الحشر: ١٨"],
      ["وَلَمَنْ صَبَرَ وَغَفَرَ إِنَّ ذَلِكَ لَمِنْ عَزْمِ الْأُمُورِ", "الشورى: ٤٣"],
      ["مَثَلُ الَّذِينَ يُنْفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنْبَتَتْ سَبْعَ سَنَابِلَ", "البقرة: ٢٦١"]
    ].map((t, e) => ({
      verse: t[0],
      verseSource: t[1],
      hadith: c[e].text,
      hadithSource: c[e].source,
      dhikr: s[e % s.length],
      action: d[e]
    })),
    l = {
      worried: {
        get label() { return ZadI18n.t("heart-hadith.19c155bfe2"); },
        icon: "",
        title: "للهَمِّ بابٌ إلى الدعاء",
        verse: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
        source: "الطلاق: ٣",
        dua: "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.",
        duaSource: "دعاء الكرب — متفق عليه",
        get action() { return ZadI18n.t("heart-hadith.4803bbeefb"); }
      },
      afraid: {
        get label() { return ZadI18n.t("heart-hadith.07267e2345"); },
        icon: "",
        title: "استعن بالله وخذ بالأسباب",
        verse: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        source: "آل عمران: ١٧٣",
        dua: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
        duaSource: "رواه أبو داود وابن ماجه وصححه أهل العلم",
        get action() { return ZadI18n.t("heart-hadith.ccc9e82619"); }
      },
      guilty: {
        get label() { return ZadI18n.t("heart-hadith.a1cadecdfa"); },
        icon: "",
        title: "لا تقنط من رحمة الله",
        verse: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
        source: "الزمر: ٥٣",
        dua: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت.",
        duaSource: "سيد الاستغفار — رواه البخاري",
        get action() { return ZadI18n.t("heart-hadith.664067f022"); }
      },
      weak: {
        get label() { return ZadI18n.t("heart-hadith.a88be6bfd5"); },
        icon: "",
        title: "ابدأ بالقليل الدائم",
        verse: "أَلَمْ يَأْنِ لِلَّذِينَ آمَنُوا أَنْ تَخْشَعَ قُلُوبُهُمْ لِذِكْرِ اللَّهِ",
        source: "الحديد: ١٦",
        dua: "يا مقلب القلوب ثبت قلبي على دينك.",
        duaSource: "رواه الترمذي وصححه",
        get action() { return ZadI18n.t("heart-hadith.b731956fce"); }
      },
      angry: {
        get label() { return ZadI18n.t("heart-hadith.40591428db"); },
        icon: "",
        title: "القوة في ملك النفس",
        verse: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
        source: "آل عمران: ١٣٤",
        dua: "أعوذ بالله من الشيطان الرجيم.",
        duaSource: "أرشد إليها النبي ﷺ عند الغضب — متفق عليه",
        get action() { return ZadI18n.t("heart-hadith.ee3f20db64"); }
      },
      lonely: {
        get label() { return ZadI18n.t("heart-hadith.646071a3e1"); },
        icon: "",
        title: "ربك قريب منك",
        verse: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
        source: "ق: ١٦",
        dua: "اللهم رحمتك أرجو، فلا تكلني إلى نفسي طرفة عين، وأصلح لي شأني كله، لا إله إلا أنت.",
        duaSource: "رواه أبو داود وحسنه أهل العلم",
        get action() { return ZadI18n.t("heart-hadith.53e7ec071c"); }
      },
      steady: {
        get label() { return ZadI18n.t("heart-hadith.78d9f97f58"); },
        icon: "",
        title: "اسأل الله ثبات القلب",
        verse: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
        source: "آل عمران: ٨",
        dua: "اللهم مصرف القلوب صرف قلبي على طاعتك.",
        duaSource: "رواه مسلم",
        get action() { return ZadI18n.t("heart-hadith.64583bee32"); }
      },
      grateful: {
        get label() { return ZadI18n.t("heart-hadith.1168258371"); },
        icon: "",
        title: "الشكر يحفظ النعم",
        verse: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
        source: "إبراهيم: ٧",
        dua: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
        duaSource: "رواه أبو داود والنسائي وصححه",
        get action() { return ZadI18n.t("heart-hadith.4213ee83a8"); }
      }
    },
    h = {
      worried: [l.worried, {
        ...l.worried,
        title: "إن مع العسر يسرًا",
        verse: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        source: "الشرح: ٥",
        get action() { return ZadI18n.t("heart-hadith.394bb63fee"); }
      }],
      afraid: [l.afraid, {
        ...l.afraid,
        title: "الله معك",
        verse: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
        source: "التوبة: ٤٠",
        get action() { return ZadI18n.t("heart-hadith.e823f465da"); }
      }],
      guilty: [l.guilty, {
        ...l.guilty,
        title: "باب التوبة مفتوح",
        verse: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ",
        source: "الشورى: ٢٥",
        get action() { return ZadI18n.t("heart-hadith.28ea7394b3"); }
      }],
      weak: [l.weak, {
        ...l.weak,
        title: "ابدأ بما تستطيع",
        verse: "فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ",
        source: "التغابن: ١٦",
        get action() { return ZadI18n.t("heart-hadith.1f684b5873"); }
      }],
      angry: [l.angry, {
        ...l.angry,
        title: "ادفع بالتي هي أحسن",
        verse: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ",
        source: "فصلت: ٣٤",
        get action() { return ZadI18n.t("heart-hadith.a431405f67"); }
      }],
      lonely: [l.lonely, {
        ...l.lonely,
        title: "الله قريب",
        verse: "فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
        source: "البقرة: ١٨٦",
        get action() { return ZadI18n.t("heart-hadith.8a44f229c3"); }
      }],
      steady: [l.steady, {
        ...l.steady,
        title: "اثبت على الطريق",
        verse: "فَاسْتَقِمْ كَمَا أُمِرْتَ",
        source: "هود: ١١٢",
        get action() { return ZadI18n.t("heart-hadith.b955f9dd94"); }
      }],
      grateful: [l.grateful, {
        ...l.grateful,
        title: "اذكروا نعمة الله",
        verse: "وَاذْكُرُوا نِعْمَتَ اللَّهِ عَلَيْكُمْ",
        source: "المائدة: ٧",
        get action() { return ZadI18n.t("heart-hadith.81de244fe8"); }
      }]
    },
    m = {};

  function p(t) {
    const e = h[t] || [l[t]];
    return e[Number(m[t] || 0) % e.length]
  }
  const f = {
      morning: {
        title: "أذكار الصباح",
        benefit: "افتتاح اليوم بالتوحيد والاستعانة والشكر، وطلب العافية والحفظ، وإحياء سنة النبي ﷺ.",
        url: "https://dorar.net/azkar/mukhtasar/343"
      },
      evening: {
        title: "أذكار المساء",
        benefit: "ختم النهار بالذكر، وتجديد التوكل والاستعاذة، والاستعداد لليل بقلب حاضر.",
        url: "https://dorar.net/azkar/mukhtasar/343"
      },
      sleep: {
        title: "أذكار النوم",
        benefit: "تفويض النفس إلى الله، والتحصن بالقرآن، وختم اليوم بالتوحيد والذكر.",
        url: "https://dorar.net/azkar/mukhtasar/355"
      },
      wake: {
        title: "أذكار الاستيقاظ",
        benefit: "حمد الله على رد الروح، وبدء اليقظة بذكر الله قبل الانشغال بالدنيا.",
        url: "https://dorar.net/azkar/mukhtasar"
      },
      distress: {
        title: "أدعية الكرب وآيات الرجاء",
        benefit: "أدعية ثابتة وآيات تذكّر بالرجاء والتوكل. لا تجعل للآيات عددًا مخصوصًا بلا دليل، وخذ بالأسباب الشرعية والطبية عند الحاجة.",
        url: "https://dorar.net/azkar/mukhtasar"
      }
    },
    g = [{
      text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      source: "الرعد: ٢٨"
    }, {
      text: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ",
      source: "الزمر: ٥٣"
    }, {
      text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      source: "الشرح: ٥–٦"
    }, {
      text: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
      source: "الطلاق: ٣"
    }, {
      text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      source: "آل عمران: ١٧٣"
    }, {
      text: "وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ",
      source: "غافر: ٤٤"
    }, {
      text: "رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ",
      source: "الأنبياء: ٨٣"
    }],
    w = {
      morning: [{
        id: "m1",
        text: "قراءة سورة الإخلاص، وسورة الفلق، وسورة الناس.",
        count: 3,
        source: "ثلاث مرات صباحًا — رواه أبو داود والترمذي وصححه"
      }, {
        id: "m2",
        text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.",
        count: 3,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "m3",
        text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        count: 3,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "m4",
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.",
        count: 100,
        source: "رواه مسلم"
      }, {
        id: "m5",
        text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
        count: 1,
        source: "صححه ابن حجر والألباني، وصحح إسناده ابن باز"
      }, {
        id: "m6",
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        count: 1,
        source: "رواه مسلم"
      }, {
        id: "m7",
        text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي؛ فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        count: 1,
        source: "سيد الاستغفار — رواه البخاري"
      }, {
        id: "m8",
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.",
        count: 1,
        source: "رواه أبو داود وابن ماجه وصححه أهل العلم"
      }, {
        id: "m9",
        text: "يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        count: 1,
        source: "رواه النسائي في الكبرى وحسنه أهل العلم"
      }, {
        id: "m10",
        text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        count: 10,
        source: "رواه أحمد وصححه أهل العلم"
      }, {
        id: "m11",
        text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ.",
        count: 1,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "m12",
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.",
        count: 3,
        source: "رواه مسلم"
      }, {
        id: "m13",
        text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        count: 1,
        source: "رواه أبو داود وحسنه أهل العلم"
      }, {
        id: "m14",
        text: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَكَلِمَةِ الْإِخْلَاصِ، وَدِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَمِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
        count: 1,
        source: "رواه أحمد والنسائي وصححه أهل العلم — للصباح"
      }],
      evening: [{
        id: "e1",
        text: "قراءة سورة الإخلاص، وسورة الفلق، وسورة الناس.",
        count: 3,
        source: "ثلاث مرات مساءً — رواه أبو داود والترمذي وصححه"
      }, {
        id: "e2",
        text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا.",
        count: 3,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "e3",
        text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ.",
        count: 3,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "e4",
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ.",
        count: 100,
        source: "رواه مسلم"
      }, {
        id: "e5",
        text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
        count: 1,
        source: "صححه ابن حجر والألباني، وصحح إسناده ابن باز"
      }, {
        id: "e6",
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ للهِ، وَالْحَمْدُ للهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        count: 1,
        source: "رواه مسلم"
      }, {
        id: "e7",
        text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي؛ فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        count: 1,
        source: "سيد الاستغفار — رواه البخاري"
      }, {
        id: "e8",
        text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.",
        count: 1,
        source: "رواه أبو داود وابن ماجه وصححه أهل العلم"
      }, {
        id: "e9",
        text: "يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        count: 1,
        source: "رواه النسائي في الكبرى وحسنه أهل العلم"
      }, {
        id: "e10",
        text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        count: 10,
        source: "رواه أحمد وصححه أهل العلم"
      }, {
        id: "e11",
        text: "اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ.",
        count: 1,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "e12",
        text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
        count: 3,
        source: "ورد في المساء ثلاثًا — رواه الترمذي وصححه"
      }, {
        id: "e13",
        text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        count: 1,
        source: "رواه أبو داود وحسنه أهل العلم"
      }],
      sleep: [{
        id: "s1",
        text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
        count: 1,
        source: "رواه البخاري"
      }, {
        id: "s2",
        text: "قراءة آية الكرسي.",
        count: 1,
        source: "رواه البخاري"
      }, {
        id: "s3",
        text: "قراءة الآيتين الأخيرتين من سورة البقرة.",
        count: 1,
        source: "متفق عليه"
      }, {
        id: "s4",
        text: "قراءة الإخلاص والفلق والناس، ثم النفث في الكفين ومسح ما استطاع من الجسد.",
        count: 3,
        source: "رواه البخاري"
      }, {
        id: "s5",
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
        count: 1,
        source: "متفق عليه"
      }, {
        id: "s6",
        text: "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
        count: 1,
        source: "متفق عليه"
      }, {
        id: "s7",
        text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
        count: 3,
        source: "رواه أبو داود والترمذي وصححه"
      }, {
        id: "s8",
        text: "سُبْحَانَ اللهِ ٣٣، وَالْحَمْدُ للهِ ٣٣، وَاللهُ أَكْبَرُ ٣٤.",
        count: 1,
        source: "تسبيح فاطمة رضي الله عنها — متفق عليه"
      }, {
        id: "s9",
        text: "اللَّهُمَّ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ.",
        count: 1,
        source: "رواه مسلم"
      }],
      wake: [{
        id: "w1",
        text: "الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ.",
        count: 1,
        source: "متفق عليه"
      }, {
        id: "w2",
        text: "الْحَمْدُ للهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ.",
        count: 1,
        source: "رواه الترمذي وحسنه"
      }, {
        id: "w3",
        text: "لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، الْحَمْدُ للهِ، وَسُبْحَانَ اللهِ، وَلَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ.",
        count: 1,
        source: "ذكر من تعارَّ من الليل — رواه البخاري"
      }],
      distress: [{
        id: "d1",
        text: "لَا إِلَهَ إِلَّا اللهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ.",
        count: 1,
        source: "دعاء الكرب — متفق عليه"
      }, {
        id: "d2",
        text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ.",
        count: 1,
        source: "دعاء يونس عليه السلام — الأنبياء: ٨٧، وجاء فضله في حديث صحيح"
      }, {
        id: "d3",
        text: "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ.",
        count: 1,
        source: "رواه أبو داود وحسنه أهل العلم"
      }, {
        id: "d4",
        text: "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ، سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي.",
        count: 1,
        source: "رواه أحمد وصححه أهل العلم"
      }, {
        id: "d5",
        text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ.",
        count: 1,
        source: "رواه البخاري"
      }, {
        id: "d6",
        text: "حَسْبُنَا اللهُ وَنِعْمَ الْوَكِيلُ.",
        count: 1,
        source: "آل عمران: ١٧٣"
      }, {
        id: "d7",
        text: "يَا حَيُّ يَا قَيُّومُ، بِرَحْمَتِكَ أَسْتَغِيثُ.",
        count: 1,
        source: "دعاء ثابت في السنة"
      }, {
        id: "d8",
        text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ.",
        count: 1,
        source: "كنز من كنوز الجنة — متفق عليه"
      }]
    },
    v = {
      get morning() { return ZadI18n.t("heart-hadith.04d5401d1c"); },
      get evening() { return ZadI18n.t("heart-hadith.3886059dc4"); },
      get sleep() { return ZadI18n.t("heart-hadith.0031f4fc40"); },
      get wake() { return ZadI18n.t("heart-hadith.d8b9dd1b69"); },
      get distress() { return ZadI18n.t("heart-hadith.b0d08e4f04"); }
    },
    b = [{
      word: "أَبًّا",
      meaning: "ما ترعاه الأنعام من النبات.",
      source: "عبس: ٣١"
    }, {
      word: "سَجَى",
      meaning: "سكن واشتد ظلامه.",
      source: "الضحى: ٢"
    }, {
      word: "العِهْن",
      meaning: "الصوف المصبوغ بألوان مختلفة.",
      source: "القارعة: ٥"
    }, {
      word: "قَسْوَرَة",
      meaning: "الأسد، وقيل الرماة والصيادون.",
      source: "المدثر: ٥١"
    }, {
      word: "الصَّمَد",
      meaning: "السيد الكامل المقصود في الحوائج.",
      source: "الإخلاص: ٢"
    }, {
      word: "الكَوْثَر",
      meaning: "الخير الكثير، ومنه نهر أعطاه الله لنبيه ﷺ في الجنة.",
      source: "الكوثر: ١"
    }, {
      word: "الأَوَّاب",
      meaning: "كثير الرجوع إلى الله بالتوبة والطاعة.",
      source: "ص: ١٧"
    }, {
      word: "سُنْدُس",
      meaning: "رقيق الحرير والديباج.",
      source: "الكهف: ٣١"
    }, {
      word: "إِسْتَبْرَق",
      meaning: "غليظ الديباج والحرير.",
      source: "الكهف: ٣١"
    }, {
      word: "مُهْطِعِين",
      meaning: "مسرعين، مادّي أعناقهم، مقبلين بأبصارهم.",
      source: "إبراهيم: ٤٣"
    }, {
      word: "مَقْمَحُون",
      meaning: "رافعو الرؤوس مع غضّ الأبصار بسبب الأغلال.",
      source: "يس: ٨"
    }, {
      word: "ضِيزَى",
      meaning: "جائرة ناقصة غير عادلة.",
      source: "النجم: ٢٢"
    }, {
      word: "حُطَمَة",
      meaning: "نار تحطم ما يُلقى فيها وتكسره.",
      source: "الهمزة: ٤"
    }, {
      word: "نَضَّاخَتَان",
      meaning: "فوارتان بالماء لا تنقطعان.",
      source: "الرحمن: ٦٦"
    }, {
      word: "وَصِيد",
      meaning: "فناء الكهف أو بابه.",
      source: "الكهف: ١٨"
    }, {
      word: "غِسْلِين",
      meaning: "ما يسيل من أهل النار من صديد ونحوه.",
      source: "الحاقة: ٣٦"
    }, {
      word: "زَقُّوم",
      meaning: "شجرة في جهنم جعلها الله طعامًا لأهل النار.",
      source: "الصافات: ٦٢"
    }, {
      word: "مَسْغَبَة",
      meaning: "مجاعة وشدة جوع.",
      source: "البلد: ١٤"
    }, {
      word: "كُبْكِبُوا",
      meaning: "أُلقي بعضهم فوق بعض وقُلبوا في النار.",
      source: "الشعراء: ٩٤"
    }, {
      word: "الطَّارِق",
      meaning: "النجم الذي يظهر ليلًا، وفسره الله بالنجم الثاقب.",
      source: "الطارق: ١–٣"
    }],
    x = [{
      id: "subhan",
      label: "سُبْحَانَ الله"
    }, {
      id: "hamd",
      label: "الْحَمْدُ لله"
    }, {
      id: "takbir",
      label: "اللهُ أَكْبَر"
    }, {
      id: "tahlil",
      label: "لَا إِلَهَ إِلَّا الله"
    }, {
      id: "istighfar",
      label: "أَسْتَغْفِرُ الله"
    }, {
      id: "salat",
      label: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد ﷺ"
    }];
  let y = "home",
    S = "morning",
    A = "subhan",
    $ = 0;
  const T = t => document.getElementById(t),
    L = () => {
      const t = new Date;
      return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`
    },
    k = t => ZadI18n.number(t),
    E = (t, e) => {
      try {
        return Zad.readJSON(t, e)
      } catch (t) {
        return e
      }
    },
    _ = (t, e) => {
      try {
        Zad.storage.setItem(t, JSON.stringify(e))
      } catch (t) {}
    },
    C = t => String(t || "").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").toLowerCase();

  function M(t) {
    return "hadith" === t ? "hadith_theme_v1" : "heart" === t ? "heart_theme_v1" : "zad" === t ? "zad_theme_v1" : "undefined" != typeof THEME_KEY ? THEME_KEY : "wird_theme_v1"
  }

  function P(t, e, a) {
    try {
      const n = Zad.storage.getItem(t);
      return e.includes(n) ? n : a
    } catch (t) {
      return a
    }
  }

  function z(e) {
    ZadAppearance.activate(e);
    const theme=Zad.storage.getItem("zad_theme_v2") || P(M(e), ["dark", "light"], "light");
    if(typeof applyTheme==='function')applyTheme(theme,false);
    D();
  }

  function D() {
    const t = "light" !== document.documentElement.getAttribute("data-theme") ? "☀️" : "🌙",
      e = T("heartThemeToggle");
    e && (e.textContent = t);
    const a = T("hadithThemeToggle");
    a && (a.textContent = t), document.querySelectorAll('#zadModule .zadAppearanceBtn[onclick*="toggleTheme"]').forEach(e => e.textContent = t)
  }
  const I = window.switchMainApp;

  function H() {
    return Math.floor((new Date).setHours(0, 0, 0, 0) / 864e5) % u.length
  }

  function O() {
    const t = u[H()],
      a = T("heartDailyPack");
    if (!a) return;
    a.innerHTML = ("\n      <div class=\"heartDailyItem\"><small>" + ZadI18n.html("heart-hadith.d751d1f718") + "</small><p style=\"font-family:Amiri,'Traditional Arabic',serif;font-size:23px;text-align:center\">" + ZadI18n.source(t.verse) + "</p><span class=\"heartSource\">" + ZadI18n.source(t.verseSource) + "</span></div>\n      <div class=\"heartDailyItem\"><small>" + ZadI18n.html("heart-hadith.c1fe214c21") + "</small><p>" + ZadI18n.source(t.hadith) + "</p><span class=\"heartSource\">" + ZadI18n.source(t.hadithSource) + "</span></div>\n      <div class=\"heartDailyItem\"><small>" + ZadI18n.html("heart-hadith.db8f54ba6c") + "</small><p style=\"font-size:20px;text-align:center\">" + ZadI18n.source(t.dhikr) + "</p></div>\n      <div class=\"heartDailyItem\"><small>" + ZadI18n.html("heart-hadith.6e39110dc8") + "</small><p>" + (ZadI18n.ui(t.action)) + "</p></div>");
    const n = E(e, {})[L()],
      o = T("heartDailyDone");
    o && (o.classList.toggle("done", !!n), o.textContent = n ? ZadI18n.t("heart-hadith.ab1e584413") : ZadI18n.t("heart-hadith.5b01eb5142"))
  }

  function R() {
    const t = T("heartMoodGrid");
    t && (t.innerHTML = Object.entries(l).map(([t, e]) => `<button id="heartMood-${t}" onclick="heartChooseMood('${t}')">${e.icon} ${e.label}</button>`).join(""))
  }

  function N(t) {
    const e = p(t);
    e && (document.querySelectorAll("#heartMoodGrid button").forEach(t => t.classList.remove("active")), T("heartMood-" + t)?.classList.add("active"), T("heartRemedyResult").innerHTML = ("<h3>" + (e.icon) + " " + (e.title) + "</h3><div class=\"verse\">" + ZadI18n.source(e.verse) + "</div><div class=\"status\" style=\"text-align:center\">" + ZadI18n.source(e.source) + "</div><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-hadith.4927cd5a6c") + "</b><br>" + ZadI18n.source(e.dua) + "<div class=\"status\" style=\"margin-top:5px\">" + ZadI18n.source(e.duaSource) + "</div></div><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-hadith.dd6d1d1a82") + "</b><br>" + (ZadI18n.ui(e.action)) + "</div><div class=\"row\" style=\"margin-top:11px\"><button onclick=\"heartAnotherRemedy('" + (t) + "')\">" + ZadI18n.html("heart-hadith.45ce0ac48f") + "</button><button class=\"secondary\" onclick=\"heartCopyRemedy('" + (t) + "')\">" + ZadI18n.html("heart-hadith.8ce4f331de") + "</button></div>"))
  }

  function B() {
    return E(n, {})[L()] || {}
  }

  function j() {
    const t = T("heartAzkarGroups");
    t && (t.innerHTML = Object.keys(w).map(t => `<button class="${t===S?"active":""}" onclick="heartChooseAzkar('${t}')">${v[t]}</button>`).join("")), W()
  }

  function W() {
    const t = T("heartDhikrList");
    if (!t) return;
    const e = B(),
      a = f[S],
      n = T("heartAzkarIntro");
    n && a && (n.innerHTML = ("<strong>" + (ZadI18n.ui(a.title)) + "</strong>" + (ZadI18n.ui(a.benefit)) + "<br><a href=\"" + (a.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + ZadI18n.html("heart-hadith.20b9d5dc61") + "</a>"));
    const o = "distress" === S ? ("<div class=\"heartCalmVerses\"><div class=\"status\" style=\"text-align:center\">" + ZadI18n.html("heart-hadith.21a26b71b8") + "</div>" + (g.map(t=>`<div class="heartCalmVerse">${t.text}<small>${t.source}</small></div>`).join("")) + "</div>") : "",
      r = w[S].every(t => Number(e[t.id] || 0) >= Number(t.count || 1)),
      i = !!window.zadWasAzkarClaimed?.(S),
      c = "morning" === S || "evening" === S ? `<div class="zadAzkarPointsClaim"><button type="button" onclick="zadClaimAzkarPoints('${S}', this)" ${r&&!i?"":"disabled"}>${i?ZadI18n.t("heart-hadith.010b34e899"):r?ZadI18n.t("heart-hadith.485a6bc39c"):ZadI18n.t("heart-hadith.99dbfac089")} ${"morning"===S?ZadI18n.t("heart-hadith.e40f0fc849"):ZadI18n.t("heart-hadith.0e2e265a8e")} ${r||i?"✅":"⏳"} <strong>+١٠</strong></button><small>${r?ZadI18n.t("heart-hadith.d03ba77c84"):ZadI18n.t("heart-hadith.b91f7e7e84")}</small></div>` : "";
    t.innerHTML = o + w[S].map(t => {
      const a = Math.min(Number(e[t.id] || 0), t.count),
        n = a >= t.count;
      return ("<article class=\"heartDhikr " + (n?"completed":"") + "\"><div class=\"heartDhikrText\">" + ZadI18n.source(t.text) + "</div><div class=\"heartDhikrMeta\"><span>" + ZadI18n.source(t.source) + "</span><span>" + (k(a)) + " / " + (k(t.count)) + "</span></div><div class=\"heartDhikrActions\"><button onclick=\"heartDhikrAdd('" + (t.id) + "')\">" + (n?ZadI18n.t("heart-hadith.3ebfcd0b44"):ZadI18n.t("heart-hadith.6d9f0da3d4")) + "</button><button class=\"secondary\" onclick=\"heartCopyDhikr('" + (t.id) + "')\">" + ZadI18n.html("heart-hadith.29a0e2739a") + "</button></div></article>")
    }).join("") + c
  }

  function G() {
    return E(o, {})
  }

  function V() {
    const t = T("heartTasbihSelector");
    t && (t.innerHTML = x.map(t => `<button class="${t.id===A?"active":""}" onclick="heartChooseTasbih('${t.id}')">${t.label}</button>`).join(""));
    const e = x.find(t => t.id === A) || x[0],
      a = G();
    T("heartCounterLabel") && (T("heartCounterLabel").textContent = e.label), T("heartCounterButton") && (T("heartCounterButton").textContent = k($)), T("heartTasbihSession") && (T("heartTasbihSession").textContent = ZadI18n.t("heart-hadith.56b6b983a5", {v0:(k($))})), T("heartTasbihTotal") && (T("heartTasbihTotal").textContent = ZadI18n.t("heart-hadith.dffbbaeb43", {v0:(k(Number(a[A]||0)))}))
  }

  function Y(t) {
    return C(String(t || "").replace(/[«»“”]/g, " "))
  }
  window.switchMainApp = function(t, e = !0) {
    const a = ["wird", "zad", "heart", "hadith"].includes(t) ? t : "wird",
      n = {
        wird: T("wirdModule"),
        zad: T("zadModule"),
        heart: T("heartModule"),
        hadith: T("hadithModule")
      },
      o = {
        wird: T("mainSwitchWird"),
        zad: T("mainSwitchZad"),
        heart: T("mainSwitchHeart"),
        hadith: T("mainSwitchHadith")
      };
    if (!(n.wird && n.zad && n.heart && n.hadith)) return "function" == typeof I ? I(a, e) : void 0;
    Object.entries(n).forEach(([t, e]) => e.classList.toggle("hidden", t !== a));
    const r = document.querySelector("nav.tabs");
    r && r.classList.toggle("hidden", "wird" !== a), Object.entries(o).forEach(([t, e]) => {
      e && (e.classList.toggle("active", t === a), e.setAttribute("aria-selected", String(t === a)))
    });
    try {
      Zad.storage.setItem("undefined" != typeof MAIN_APP_KEY ? MAIN_APP_KEY : "alwird_main_section_v1", a)
    } catch (t) {}
    if (z(a), "heart" === a && Z(), "hadith" === a && hadithRenderOffline(), e) {
      const t = n[a];
      t.classList.remove("moduleFade"), t.offsetWidth, t.classList.add("moduleFade"), window.scrollTo({
        top: 0,
        behavior: "auto"
      })
    }
  }, window.toggleTheme = function() {
    const t = T("hadithModule")?.classList.contains("hidden") ? T("heartModule")?.classList.contains("hidden") ? T("zadModule")?.classList.contains("hidden") ? "wird" : "zad" : "heart" : "hadith",
      e = "dark" === (document.documentElement.getAttribute("data-theme") || "dark") ? "light" : "dark";
    "function" == typeof applyTheme && applyTheme(e, !1);
    try {
      Zad.storage.setItem(M(t), e)
    } catch (t) {}
    D()
  }, window.toggleHeartPalette = function(event) {
    event?.stopPropagation();window.ZadSettings?.open();
  }, window.chooseHeartPalette = function(color) {
    ZadAppearance.set(color,'heart');T("heartPalettePanel")?.classList.add("hidden");
  }, window.toggleHadithPalette = function(event) {
    event?.stopPropagation();window.ZadSettings?.open();
  }, window.chooseHadithPalette = function(color) {
    ZadAppearance.set(color,'hadith');T("hadithPalettePanel")?.classList.add("hidden");
  }, window.heartShowPage = function(t) {
    ["home", "daily", "remedy", "azkar", "gharib", "tasbih"].includes(t) || (t = "home"), T("heartModule")?.classList.contains("hidden") && window.switchMainApp("heart", !1), y = t, T("heartModule")?.setAttribute("data-heart-section", t), document.querySelectorAll("#heartModule .heartPage").forEach(t => t.classList.add("hidden")), T("heartPage-" + t)?.classList.remove("hidden"), document.querySelectorAll("#heartModule .heartTabs button").forEach(t => t.classList.remove("active")), T("heartTab-" + t)?.classList.add("active"), "daily" === t && O(), "remedy" === t && R(), "azkar" === t && j(), "gharib" === t && heartRenderGharib(), "tasbih" === t && V(), window.scrollTo({
      top: 0,
      behavior: "auto"
    })
  }, window.heartCompleteDaily = function() {
    const t = E(e, {});
    t[L()] = !0, _(e, t), U(), O(), Z(), Q(ZadI18n.t("heart-hadith.ed73544a8e"))
  }, window.heartCopyDaily = function() {
    const t = u[H()];
    J(ZadI18n.t("heart-hadith.0ef6222d83", {v0:(t.verse),v1:(t.verseSource),v2:(t.hadith),v3:(t.hadithSource),v4:(t.dhikr),v5:(ZadI18n.ui(t.action))}), ZadI18n.t("heart-hadith.99ca815dd2"))
  }, window.heartChooseMood = function(t) {
    l[t] && (m[t] = 0, N(t))
  }, window.heartAnotherRemedy = function(t) {
    const e = h[t] || [];
    e.length && (m[t] = (Number(m[t] || 0) + 1) % e.length, N(t))
  }, window.heartCopyRemedy = function(t) {
    const e = p(t);
    e && J(ZadI18n.t("heart-hadith.89ebbf46fa", {v0:(e.title),v1:(e.verse),v2:(e.source),v3:(e.dua),v4:(e.duaSource),v5:(ZadI18n.ui(e.action))}), ZadI18n.t("heart-hadith.e348fc3738"))
  }, window.heartChooseAzkar = function(t) {
    S = w[t] ? t : "morning", j()
  }, window.heartDhikrAdd = function(t) {
    const e = Object.values(w).flat().find(e => e.id === t);
    if (!e) return;
    const a = B();
    a[t] = Math.min(Number(a[t] || 0) + 1, e.count),
      function(t) {
        const e = E(n, {});
        e[L()] = t, _(n, e)
      }(a), U(), W(), Z(), a[t] >= e.count && Q(ZadI18n.t("heart-hadith.238ce14cc1"))
  }, window.heartCopyDhikr = function(t) {
    const e = Object.values(w).flat().find(e => e.id === t);
    e && J(`${e.text}\n\n${e.source}`, ZadI18n.t("heart-hadith.483776c2fc"))
  }, window.heartRenderGharib = function() {
    const t = T("heartWordGrid");
    if (!t) return;
    const e = C(T("heartGharibSearch")?.value || ""),
      a = b.filter(t => !e || C(t.word + " " + t.meaning + " " + t.source).includes(e));
    t.innerHTML = a.length ? a.map(t => `<article class="heartWord"><h3>${t.word}</h3><p>${t.meaning}</p><small>${t.source}</small></article>`).join("") : ("<div class=\"status\">" + ZadI18n.html("heart-hadith.a939f90194") + "</div>")
  }, window.heartChooseTasbih = function(t) {
    x.some(e => e.id === t) && (A = t, $ = 0, V())
  }, window.heartTasbihAdd = function() {
    const t = G();
    t[A] = Number(t[A] || 0) + 1, _(o, t), $++;
    const e = E(r, {});
    e[L()] = Number(e[L()] || 0) + 1, _(r, e), U(), V(), Z(), 33 !== $ && 100 !== $ || Q(ZadI18n.t("heart-hadith.5d1a362f24", {v0:(k($))}))
  }, window.heartTasbihUndo = function() {
    if ($ <= 0) return;
    const t = G();
    t[A] = Math.max(0, Number(t[A] || 0) - 1), _(o, t), $--, V(), Z()
  }, window.heartTasbihResetSession = function() {
    $ = 0, V()
  }, window.hadithRenderOffline = function() {
    const t = T("hadithOfflineGrid");
    if (!t) return;
    const e = Y(T("hadithSearchInput")?.value || ""),
      a = c.filter(t => !e || Y(`${t.text} ${t.source} ${t.cat}`).includes(e));
    t.innerHTML = a.length ? a.map(t => ("<article class=\"hadithCard\"><span class=\"hadithCat\">" + (ZadI18n.ui(t.cat)) + "</span><div class=\"hadithText\">«" + ZadI18n.source(t.text) + "»</div><div class=\"hadithMeta\">" + ZadI18n.source(t.source) + "</div><div class=\"hadithCardActions\"><button class=\"secondary\" onclick=\"hadithCopy('" + (t.id) + "')\">" + ZadI18n.html("heart-hadith.29a0e2739a") + "</button><button onclick=\"hadithVerify('" + (t.id) + "')\">" + ZadI18n.html("heart-hadith.6bfb448a7d") + "</button></div></article>")).join("") : ("<div class=\"status\">" + ZadI18n.html("heart-hadith.2145783500") + "</div>")
  }, window.hadithCopy = function(t) {
    const e = c.find(e => e.id === t);
    e && J(ZadI18n.t("heart-hadith.35feffd33d", {v0:(e.text),v1:(e.source)}), ZadI18n.t("heart-hadith.241ea21f89"))
  }, window.hadithVerify = function(t) {
    const e = c.find(e => e.id === t);
    if (!e) return;
    const a = e.text.split(" ").slice(0, 8).join(" ");
    window.open(`https://dorar.net/hadith/search?q=${encodeURIComponent(a)}&st=w`, "_blank", "noopener,noreferrer")
  }, window.hadithQuickSearch = function(t) {
    const e = T("hadithSearchInput");
    e && (e.value = t), hadithRenderOffline(), hadithSearchOfficial()
  }, window.hadithClearSearch = function() {
    const t = T("hadithSearchInput");
    t && (t.value = ""), hadithRenderOffline(), T("hadithOfficialResults") && (T("hadithOfficialResults").innerHTML = ""), T("hadithApiStatus") && (T("hadithApiStatus").textContent = ZadI18n.t("heart-hadith.1a1eb36cfb"))
  };
  let q, K = null;

  function U() {
    const t = E(a, []);
    t.includes(L()) || (t.push(L()), _(a, t.slice(-180))), F()
  }

  function F() {
    const t = new Set(E(a, []));
    let e = 0;
    const n = new Date;
    for (n.setHours(0, 0, 0, 0); t.has(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`);) e++, n.setDate(n.getDate() - 1);
    T("heartStreak") && (T("heartStreak").textContent = `🔥 ${k(Math.max(e,1))} ${1===e?ZadI18n.t("heart-hadith.eb07f635d8"):ZadI18n.t("heart-hadith.78cb02e510")}`)
  }

  function Z() {
    const t = !!E(e, {})[L()],
      a = B(),
      n = [t, Object.values(a).some(t => Number(t) > 0), Number(E(r, {})[L()] || 0) > 0],
      o = n.filter(Boolean).length,
      i = Math.round(o / n.length * 100);
    T("heartDayProgress") && (T("heartDayProgress").style.width = i + "%"), T("heartDayProgressText") && (T("heartDayProgressText").textContent = 3 === o ? ZadI18n.t("heart-hadith.44a6a7d450") : ZadI18n.t("heart-hadith.e343129eb8", {v0:(k(o)),v1:(k(3))})), F()
  }

  function J(t, e) {
    navigator.clipboard?.writeText ? navigator.clipboard.writeText(t).then(() => Q(e)).catch(() => prompt(ZadI18n.t("heart-hadith.f9da1cdd07"), t)) : prompt(ZadI18n.t("heart-hadith.f9da1cdd07"), t)
  }

  function Q(t) {
    let e = T("heartToast");
    e || (e = document.createElement("div"), e.id = "heartToast", e.className = "heartToast", document.body.appendChild(e)), e.textContent = t, e.classList.add("show"), clearTimeout(q), q = setTimeout(() => e.classList.remove("show"), 2200)
  }

  function X() {
    window.ZadGreeting?.show(false);
  }
  window.zadHadithApiCallback = function(t) {
    clearTimeout(null), K && (K.remove(), K = null);
    const e = "string" == typeof t?.ahadith?.result ? t.ahadith.result : Array.isArray(t?.ahadith) ? t.ahadith.map(t => t.th || t.result || "").join("") : String(t?.ahadith || ""),
      a = T("hadithOfficialResults");
    a && (a.innerHTML = e ? function(t) {
      const e = String(t || "").slice(0, 1e5),
        a = (new DOMParser).parseFromString("<div>" + e + "</div>", "text/html").body.firstElementChild;
      if (!a) return "";
      const n = new Set(["A", "ARTICLE", "B", "BLOCKQUOTE", "BR", "DIV", "EM", "H1", "H2", "H3", "H4", "HR", "I", "LI", "OL", "P", "SMALL", "SPAN", "STRONG", "TABLE", "TBODY", "TD", "TH", "THEAD", "TR", "U", "UL"]);
      return a.querySelectorAll("*").forEach(function(t) {
        if (n.has(t.tagName)) {
          if ([...t.attributes].forEach(function(e) {
              const a = e.name.toLowerCase();
              "class" === a || "title" === a || "dir" === a || "lang" === a || "A" === t.tagName && "href" === a || t.removeAttribute(e.name)
            }), "A" === t.tagName) {
            const e = (t.getAttribute("href") || "").trim();
            try {
              const a = new URL(e, "https://dorar.net");
              "https:" !== a.protocol || "dorar.net" !== a.hostname && !a.hostname.endsWith(".dorar.net") ? t.removeAttribute("href") : t.setAttribute("href", a.href)
            } catch (e) {
              t.removeAttribute("href")
            }
            t.target = "_blank", t.rel = "noopener noreferrer"
          }
        } else t.replaceWith(...t.childNodes)
      }), a.innerHTML
    }(e) : ("<div class=\"status\">" + ZadI18n.html("heart-hadith.ce928cee95") + "</div>")), T("hadithApiStatus") && (T("hadithApiStatus").textContent = ZadI18n.t("heart-hadith.f46c917816"))
  }, window.hadithSearchOfficial = function() {
    const t = (T("hadithSearchInput")?.value || "").trim().slice(0, 120);
    if (!t) return void Q(ZadI18n.t("heart-hadith.f6821e30ed"));
    const e = "https://dorar.net/hadith/search?q=" + encodeURIComponent(t) + "&st=w",
      a = window.open(e, "_blank", "noopener,noreferrer");
    T("hadithApiStatus") && (T("hadithApiStatus").textContent = a ? ZadI18n.t("heart-hadith.b483d046e6") : ZadI18n.t("heart-hadith.b15def4687"))
  };
  document.addEventListener('zad:language',()=>{if(tt){const hour=new Date().getHours();T('heartGreeting').textContent=ZadI18n.t(hour<12?'heart-hadith.4fafe7c113':hour<18?'heart-hadith.e2885dbd76':'heart-hadith.d33e62045d');O();R();j();heartRenderGharib();V();Z();}if(et)hadithRenderOffline();});
  let tt = !1,
    et = !1;

  function at() {
    const t = () => setTimeout(X, 180);
    "requestIdleCallback" in window ? requestIdleCallback(t, {
      timeout: 900
    }) : setTimeout(t, 500)
  }
  window.zadEnsureHeartInit = function() {
    tt || (tt = !0, function() {
      const t = (new Date).getHours(),
        e = t < 12 ? ZadI18n.t("heart-hadith.4fafe7c113") : t < 18 ? ZadI18n.t("heart-hadith.e2885dbd76") : ZadI18n.t("heart-hadith.d33e62045d");
      T("heartGreeting") && (T("heartGreeting").textContent = e)
    }(), O(), R(), j(), heartRenderGharib(), V(), U(), Z())
  }, window.zadEnsureHadithInit = function() {
    et || (et = !0, hadithRenderOffline())
  }, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", at, {
    once: !0
  }) : at()
}()

