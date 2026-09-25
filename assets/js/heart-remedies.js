! function() {
  "use strict";
  const t = {
      worried: {
        get label() { return ZadI18n.t("heart-hadith.19c155bfe2"); },
        icon: "",
        verses: [{
          title: "الله حسبك",
          text: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
          source: "الطلاق: ٣"
        }, {
          title: "مع العسر يسر",
          text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
          source: "الشرح: ٥–٦"
        }, {
          title: "طمأنينة الذكر",
          text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
          source: "الرعد: ٢٨"
        }, {
          title: "في وسعك العبور",
          text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
          source: "البقرة: ٢٨٦"
        }, {
          title: "ربك قريب",
          text: "فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
          source: "البقرة: ١٨٦"
        }, {
          title: "استعن بالصبر والصلاة",
          text: "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          source: "البقرة: ١٥٣"
        }, {
          title: "ما كُتب لك",
          text: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا",
          source: "التوبة: ٥١"
        }, {
          title: "بعد العسر يسر",
          text: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا",
          source: "الطلاق: ٧"
        }, {
          title: "لا تحزن",
          text: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
          source: "التوبة: ٤٠"
        }, {
          title: "فوّض أمرك",
          text: "وَأُفَوِّضُ أَمْرِي إِلَى اللَّهِ إِنَّ اللَّهَ بَصِيرٌ بِالْعِبَادِ",
          source: "غافر: ٤٤"
        }],
        hadiths: [{
          text: "ما يصيب المسلم من نصب ولا وصب ولا هم ولا حزن ولا أذى ولا غم، حتى الشوكة يشاكها، إلا كفّر الله بها من خطاياه.",
          source: "متفق عليه"
        }, {
          text: "عجبًا لأمر المؤمن، إن أمره كله له خير؛ إن أصابته سراء شكر فكان خيرًا له، وإن أصابته ضراء صبر فكان خيرًا له.",
          source: "رواه مسلم"
        }, {
          text: "احرص على ما ينفعك، واستعن بالله ولا تعجز.",
          source: "رواه مسلم"
        }, {
          text: "من نفّس عن مؤمن كربة من كرب الدنيا نفّس الله عنه كربة من كرب يوم القيامة.",
          source: "رواه مسلم"
        }, {
          text: "أنا عند ظن عبدي بي، وأنا معه إذا ذكرني.",
          source: "متفق عليه"
        }, {
          text: "إن عظم الجزاء مع عظم البلاء، وإن الله إذا أحب قومًا ابتلاهم.",
          source: "رواه الترمذي وحسنه"
        }],
        duas: [{
          text: "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.",
          source: "دعاء الكرب — متفق عليه"
        }, {
          text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والجبن والبخل، وضلع الدين وغلبة الرجال.",
          source: "رواه البخاري"
        }, {
          text: "يا حي يا قيوم، برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين.",
          source: "دعاء مأثور"
        }, {
          text: "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.",
          source: "من القرآن — التوبة: ١٢٩"
        }, {
          text: "رب إني مسني الضر وأنت أرحم الراحمين.",
          source: "من القرآن — الأنبياء: ٨٣"
        }, {
          text: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
          source: "دعاء ذي النون — الأنبياء: ٨٧"
        }],
        actions: ["heart-remedies.b0c08dbaf1", "heart-remedies.0e31476886", "heart-remedies.f8b2da4382", "heart-remedies.560ac317fb", "heart-remedies.0796da835a", "heart-remedies.4c0a294fee", "heart-remedies.31a5da2c03", "heart-remedies.f20e39ed47", "heart-remedies.793a3ba3cf", "heart-remedies.8e0d0f3fe3", "heart-remedies.1707285e82", "heart-remedies.3d79bd71f9"]
      },
      afraid: {
        get label() { return ZadI18n.t("heart-hadith.07267e2345"); },
        icon: "",
        verses: [{
          title: "حسبنا الله",
          text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
          source: "آل عمران: ١٧٣"
        }, {
          title: "الله معنا",
          text: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
          source: "التوبة: ٤٠"
        }, {
          title: "لن يصيبنا إلا ما كُتب",
          text: "قُلْ لَنْ يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا",
          source: "التوبة: ٥١"
        }, {
          title: "كفاية المتوكل",
          text: "وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
          source: "الطلاق: ٣"
        }, {
          title: "ربي سيهدين",
          text: "كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ",
          source: "الشعراء: ٦٢"
        }, {
          title: "خير حافظًا",
          text: "فَاللَّهُ خَيْرٌ حَافِظًا وَهُوَ أَرْحَمُ الرَّاحِمِينَ",
          source: "يوسف: ٦٤"
        }, {
          title: "مخرج من الضيق",
          text: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا",
          source: "الطلاق: ٢"
        }, {
          title: "الله كافٍ عبده",
          text: "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",
          source: "الزمر: ٣٦"
        }, {
          title: "أسمع وأرى",
          text: "لَا تَخَافَا إِنَّنِي مَعَكُمَا أَسْمَعُ وَأَرَى",
          source: "طه: ٤٦"
        }, {
          title: "عليك توكلنا",
          text: "رَبَّنَا عَلَيْكَ تَوَكَّلْنَا وَإِلَيْكَ أَنَبْنَا وَإِلَيْكَ الْمَصِيرُ",
          source: "الممتحنة: ٤"
        }],
        hadiths: [{
          text: "احفظ الله يحفظك، احفظ الله تجده تجاهك.",
          source: "رواه الترمذي وقال: حسن صحيح"
        }, {
          text: "لو أنكم تتوكلون على الله حق توكله لرزقكم كما يرزق الطير؛ تغدو خماصًا وتروح بطانًا.",
          source: "رواه الترمذي وحسنه"
        }, {
          text: "من قال: بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم ثلاث مرات، لم يضره شيء.",
          source: "رواه أبو داود والترمذي وصححه"
        }, {
          text: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير؛ احرص على ما ينفعك، واستعن بالله ولا تعجز.",
          source: "رواه مسلم"
        }, {
          text: "لا طيرة، وخيرها الفأل.",
          source: "متفق عليه"
        }, {
          text: "من نزل منزلًا فقال: أعوذ بكلمات الله التامات من شر ما خلق، لم يضره شيء حتى يرتحل من منزله ذلك.",
          source: "رواه مسلم"
        }],
        duas: [{
          text: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
          source: "رواه أبو داود وابن ماجه"
        }, {
          text: "اللهم استر عوراتي، وآمن روعاتي، واحفظني من بين يدي ومن خلفي وعن يميني وعن شمالي ومن فوقي.",
          source: "من دعاء النبي ﷺ — رواه أبو داود"
        }, {
          text: "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.",
          source: "من القرآن — التوبة: ١٢٩"
        }, {
          text: "أعوذ بكلمات الله التامات من شر ما خلق.",
          source: "رواه مسلم"
        }, {
          text: "حسبنا الله ونعم الوكيل.",
          source: "من القرآن — آل عمران: ١٧٣"
        }, {
          text: "ربنا عليك توكلنا وإليك أنبنا وإليك المصير.",
          source: "من القرآن — الممتحنة: ٤"
        }],
        actions: ["heart-remedies.c0340ae201", "heart-remedies.752e8968f0", "heart-remedies.a38f2d8bfc", "heart-remedies.0ce07dc173", "heart-remedies.a79bc0b6ba", "heart-remedies.52b4b7e4ea", "heart-remedies.270895712e", "heart-remedies.70549afeb7", "heart-remedies.3dc723d0cb", "heart-remedies.3aafec0c17", "heart-remedies.0d42c07310", "heart-remedies.6c321f8c9b"]
      },
      guilty: {
        get label() { return ZadI18n.t("heart-hadith.a1cadecdfa"); },
        icon: "",
        verses: [{
          title: "لا تقنط",
          text: "لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
          source: "الزمر: ٥٣"
        }, {
          title: "يقبل التوبة",
          text: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ",
          source: "الشورى: ٢٥"
        }, {
          title: "الحسنات تمحو",
          text: "إِنَّ الْحَسَنَاتِ يُذْهِبْنَ السَّيِّئَاتِ",
          source: "هود: ١١٤"
        }, {
          title: "استغفر تجد غفورًا",
          text: "وَمَنْ يَعْمَلْ سُوءًا أَوْ يَظْلِمْ نَفْسَهُ ثُمَّ يَسْتَغْفِرِ اللَّهَ يَجِدِ اللَّهَ غَفُورًا رَحِيمًا",
          source: "النساء: ١١٠"
        }, {
          title: "بدّل السيئات حسنات",
          text: "إِلَّا مَنْ تَابَ وَآمَنَ وَعَمِلَ عَمَلًا صَالِحًا فَأُولَئِكَ يُبَدِّلُ اللَّهُ سَيِّئَاتِهِمْ حَسَنَاتٍ",
          source: "الفرقان: ٧٠"
        }, {
          title: "الله يحب التوابين",
          text: "إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ",
          source: "البقرة: ٢٢٢"
        }, {
          title: "توبوا جميعًا",
          text: "وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ",
          source: "النور: ٣١"
        }, {
          title: "توبة نصوح",
          text: "يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَصُوحًا",
          source: "التحريم: ٨"
        }, {
          title: "ظلمنا أنفسنا",
          text: "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
          source: "الأعراف: ٢٣"
        }, {
          title: "تاب عليه",
          text: "فَتَلَقَّى آدَمُ مِنْ رَبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ",
          source: "البقرة: ٣٧"
        }],
        hadiths: [{
          text: "لله أشد فرحًا بتوبة عبده حين يتوب إليه من أحدكم كان على راحلته بأرض فلاة ثم وجدها بعد أن أضلها.",
          source: "متفق عليه"
        }, {
          text: "كل بني آدم خطّاء، وخير الخطّائين التوابون.",
          source: "رواه الترمذي وابن ماجه وحسنه أهل العلم"
        }, {
          text: "التائب من الذنب كمن لا ذنب له.",
          source: "رواه ابن ماجه وحسنه أهل العلم"
        }, {
          text: "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن.",
          source: "رواه الترمذي وحسنه"
        }, {
          text: "يا ابن آدم، إنك ما دعوتني ورجوتني غفرت لك على ما كان منك ولا أبالي.",
          source: "رواه الترمذي وحسنه"
        }, {
          text: "من كانت له مظلمة لأخيه من عرضه أو شيء فليتحلله منه اليوم قبل ألا يكون دينار ولا درهم.",
          source: "رواه البخاري"
        }],
        duas: [{
          text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك... فاغفر لي؛ فإنه لا يغفر الذنوب إلا أنت.",
          source: "سيد الاستغفار — رواه البخاري"
        }, {
          text: "رب اغفر لي وتب علي، إنك أنت التواب الرحيم.",
          source: "رواه أبو داود والترمذي"
        }, {
          text: "ربنا ظلمنا أنفسنا، وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين.",
          source: "من القرآن — الأعراف: ٢٣"
        }, {
          text: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
          source: "من القرآن — الأنبياء: ٨٧"
        }, {
          text: "اللهم اغفر لي خطيئتي وجهلي وإسرافي في أمري وما أنت أعلم به مني.",
          source: "متفق عليه"
        }, {
          text: "اللهم إنك عفو تحب العفو فاعف عني.",
          source: "رواه الترمذي"
        }],
        actions: ["heart-remedies.866b84f100", "heart-remedies.8c86bf25a8", "heart-remedies.b2db105531", "heart-remedies.4678b9242d", "heart-remedies.9cbd8a28d6", "heart-remedies.d7902aefe1", "heart-remedies.f5da96e877", "heart-remedies.d6d902c0ec", "heart-remedies.02c46a2218", "heart-remedies.4f260c3b3b", "heart-remedies.fba6eb3866", "heart-remedies.efc36777b2"]
      },
      weak: {
        get label() { return ZadI18n.t("heart-hadith.a88be6bfd5"); },
        icon: "",
        verses: [{
          title: "اخشع قلبك",
          text: "أَلَمْ يَأْنِ لِلَّذِينَ آمَنُوا أَنْ تَخْشَعَ قُلُوبُهُمْ لِذِكْرِ اللَّهِ",
          source: "الحديد: ١٦"
        }, {
          title: "ما استطعتم",
          text: "فَاتَّقُوا اللَّهَ مَا اسْتَطَعْتُمْ",
          source: "التغابن: ١٦"
        }, {
          title: "جاهد تُهدَ",
          text: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
          source: "العنكبوت: ٦٩"
        }, {
          title: "استقم",
          text: "فَاسْتَقِمْ كَمَا أُمِرْتَ",
          source: "هود: ١١٢"
        }, {
          title: "أشد حبًا لله",
          text: "وَالَّذِينَ آمَنُوا أَشَدُّ حُبًّا لِلَّهِ",
          source: "البقرة: ١٦٥"
        }, {
          title: "اذكروني",
          text: "فَاذْكُرُونِي أَذْكُرْكُمْ",
          source: "البقرة: ١٥٢"
        }, {
          title: "أقم الصلاة لذكري",
          text: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
          source: "طه: ١٤"
        }, {
          title: "ما تيسر من القرآن",
          text: "فَاقْرَؤُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ",
          source: "المزمل: ٢٠"
        }, {
          title: "الصلاة موقوتة",
          text: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
          source: "النساء: ١٠٣"
        }, {
          title: "اعبد حتى اليقين",
          text: "وَاعْبُدْ رَبَّكَ حَتَّى يَأْتِيَكَ الْيَقِينُ",
          source: "الحجر: ٩٩"
        }],
        hadiths: [{
          text: "أحب الأعمال إلى الله أدومها وإن قل.",
          source: "متفق عليه"
        }, {
          text: "إن الدين يسر، ولن يشاد الدين أحد إلا غلبه؛ فسددوا وقاربوا وأبشروا.",
          source: "رواه البخاري"
        }, {
          text: "سددوا وقاربوا، واعلموا أنه لن ينجو أحد منكم بعمله.",
          source: "متفق عليه"
        }, {
          text: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير.",
          source: "رواه مسلم"
        }, {
          text: "عليكم من الأعمال ما تطيقون، فإن الله لا يمل حتى تملوا.",
          source: "متفق عليه"
        }, {
          text: "بادروا بالأعمال فتناً كقطع الليل المظلم.",
          source: "رواه مسلم"
        }],
        duas: [{
          text: "يا مقلب القلوب، ثبت قلبي على دينك.",
          source: "رواه الترمذي"
        }, {
          text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
          source: "رواه أبو داود والنسائي"
        }, {
          text: "اللهم مصرف القلوب، صرف قلبي على طاعتك.",
          source: "رواه مسلم"
        }, {
          text: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة.",
          source: "من القرآن — آل عمران: ٨"
        }, {
          text: "رب اشرح لي صدري ويسر لي أمري.",
          source: "من القرآن — طه: ٢٥–٢٦"
        }, {
          text: "لا حول ولا قوة إلا بالله.",
          source: "ذكر عظيم — متفق عليه"
        }],
        actions: ["heart-remedies.644a0513b5", "heart-remedies.fcd267263b", "heart-remedies.7e1510d02c", "heart-remedies.a25a1c9f9d", "heart-remedies.873a32a3d1", "heart-remedies.5961984680", "heart-remedies.6d64efd0d5", "heart-remedies.e02f2a65e0", "heart-remedies.dca762d603", "heart-remedies.c27b90e907", "heart-remedies.78af7e2229", "heart-remedies.ac0ae565d9"]
      },
      angry: {
        get label() { return ZadI18n.t("heart-hadith.40591428db"); },
        icon: "",
        verses: [{
          title: "اكظم غيظك",
          text: "وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ",
          source: "آل عمران: ١٣٤"
        }, {
          title: "ادفع بالأحسن",
          text: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ",
          source: "فصلت: ٣٤"
        }, {
          title: "خذ العفو",
          text: "خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ",
          source: "الأعراف: ١٩٩"
        }, {
          title: "الصبر والغفران",
          text: "وَلَمَنْ صَبَرَ وَغَفَرَ إِنَّ ذَلِكَ لَمِنْ عَزْمِ الْأُمُورِ",
          source: "الشورى: ٤٣"
        }, {
          title: "يغفرون عند الغضب",
          text: "وَإِذَا مَا غَضِبُوا هُمْ يَغْفِرُونَ",
          source: "الشورى: ٣٧"
        }, {
          title: "الحسنة أقوى",
          text: "وَلَا تَسْتَوِي الْحَسَنَةُ وَلَا السَّيِّئَةُ",
          source: "فصلت: ٣٤"
        }, {
          title: "العفو والإصلاح",
          text: "فَمَنْ عَفَا وَأَصْلَحَ فَأَجْرُهُ عَلَى اللَّهِ",
          source: "الشورى: ٤٠"
        }, {
          title: "قول حسن",
          text: "وَقُولُوا لِلنَّاسِ حُسْنًا",
          source: "البقرة: ٨٣"
        }, {
          title: "الكلمة الأحسن",
          text: "وَقُلْ لِعِبَادِي يَقُولُوا الَّتِي هِيَ أَحْسَنُ",
          source: "الإسراء: ٥٣"
        }, {
          title: "العفو أقرب للتقوى",
          text: "وَأَنْ تَعْفُوا أَقْرَبُ لِلتَّقْوَى",
          source: "البقرة: ٢٣٧"
        }],
        hadiths: [{
          text: "قال رجل للنبي ﷺ: أوصني. قال: لا تغضب. فردد مرارًا، قال: لا تغضب.",
          source: "رواه البخاري"
        }, {
          text: "ليس الشديد بالصرعة، إنما الشديد الذي يملك نفسه عند الغضب.",
          source: "متفق عليه"
        }, {
          text: "إني لأعلم كلمة لو قالها لذهب عنه ما يجد: أعوذ بالله من الشيطان الرجيم.",
          source: "متفق عليه"
        }, {
          text: "إن الرفق لا يكون في شيء إلا زانه، ولا ينزع من شيء إلا شانه.",
          source: "رواه مسلم"
        }, {
          text: "ما زاد الله عبدًا بعفو إلا عزًا.",
          source: "رواه مسلم"
        }, {
          text: "من كظم غيظًا وهو قادر على أن ينفذه دعاه الله على رؤوس الخلائق حتى يخيره من الحور العين ما شاء.",
          source: "رواه أبو داود والترمذي وحسنه أهل العلم"
        }],
        duas: [{
          text: "أعوذ بالله من الشيطان الرجيم.",
          source: "ذكر مشروع عند الغضب"
        }, {
          text: "اللهم اهدني لأحسن الأخلاق، لا يهدي لأحسنها إلا أنت، واصرف عني سيئها.",
          source: "من دعاء النبي ﷺ — رواه مسلم"
        }, {
          text: "رب اغفر لي وارحمني واهدني.",
          source: "دعاء جامع"
        }, {
          text: "اللهم أصلح قلبي ولساني، وألهمني الرشد في قولي وفعلي.",
          source: "دعاء عام بمعنى صحيح"
        }, {
          text: "اللهم طهر قلبي من الغل، وارزقني العفو والرفق.",
          source: "دعاء عام بمعنى صحيح"
        }, {
          text: "ربنا اغفر لنا ولإخواننا الذين سبقونا بالإيمان ولا تجعل في قلوبنا غلًا للذين آمنوا.",
          source: "من القرآن — الحشر: ١٠"
        }],
        actions: ["heart-remedies.0aa23360b2", "heart-remedies.8c64cf2838", "heart-remedies.768d3bfb5e", "heart-remedies.c38a007cd8", "heart-remedies.1aae4a2456", "heart-remedies.dd7fd7ce2f", "heart-remedies.c09fa4ed97", "heart-remedies.14f8d215ba", "heart-remedies.edc5d13cde", "heart-remedies.0a8c9ed647", "heart-remedies.b3975b3275", "heart-remedies.52866f20b5"]
      },
      lonely: {
        get label() { return ZadI18n.t("heart-hadith.646071a3e1"); },
        icon: "",
        verses: [{
          title: "أقرب من حبل الوريد",
          text: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
          source: "ق: ١٦"
        }, {
          title: "إني قريب",
          text: "فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
          source: "البقرة: ١٨٦"
        }, {
          title: "معكم أينما كنتم",
          text: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنْتُمْ",
          source: "الحديد: ٤"
        }, {
          title: "ما ودعك ربك",
          text: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى",
          source: "الضحى: ٣"
        }, {
          title: "الله كافٍ عبده",
          text: "أَلَيْسَ اللَّهُ بِكَافٍ عَبْدَهُ",
          source: "الزمر: ٣٦"
        }, {
          title: "وليي الله",
          text: "إِنَّ وَلِيِّيَ اللَّهُ الَّذِي نَزَّلَ الْكِتَابَ وَهُوَ يَتَوَلَّى الصَّالِحِينَ",
          source: "الأعراف: ١٩٦"
        }, {
          title: "الله ولي المؤمنين",
          text: "اللَّهُ وَلِيُّ الَّذِينَ آمَنُوا",
          source: "البقرة: ٢٥٧"
        }, {
          title: "ربي سيهدين",
          text: "كَلَّا إِنَّ مَعِيَ رَبِّي سَيَهْدِينِ",
          source: "الشعراء: ٦٢"
        }, {
          title: "الله معنا",
          text: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
          source: "التوبة: ٤٠"
        }, {
          title: "حسبك الله",
          text: "حَسْبُكَ اللَّهُ وَمَنِ اتَّبَعَكَ مِنَ الْمُؤْمِنِينَ",
          source: "الأنفال: ٦٤"
        }],
        hadiths: [{
          text: "المؤمن للمؤمن كالبنيان يشد بعضه بعضًا.",
          source: "متفق عليه"
        }, {
          text: "مثل المؤمنين في توادهم وتراحمهم وتعاطفهم مثل الجسد؛ إذا اشتكى منه عضو تداعى له سائر الجسد بالسهر والحمى.",
          source: "رواه مسلم"
        }, {
          text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه.",
          source: "متفق عليه"
        }, {
          text: "المرء مع من أحب.",
          source: "متفق عليه"
        }, {
          text: "من نفّس عن مؤمن كربة من كرب الدنيا نفّس الله عنه كربة من كرب يوم القيامة.",
          source: "رواه مسلم"
        }, {
          text: "أنا عند ظن عبدي بي، وأنا معه إذا ذكرني.",
          source: "متفق عليه"
        }],
        duas: [{
          text: "اللهم رحمتك أرجو، فلا تكلني إلى نفسي طرفة عين، وأصلح لي شأني كله، لا إله إلا أنت.",
          source: "رواه أبو داود"
        }, {
          text: "يا حي يا قيوم، برحمتك أستغيث، أصلح لي شأني كله.",
          source: "دعاء مأثور"
        }, {
          text: "رب إني لما أنزلت إلي من خير فقير.",
          source: "من القرآن — القصص: ٢٤"
        }, {
          text: "حسبي الله لا إله إلا هو، عليه توكلت وهو رب العرش العظيم.",
          source: "من القرآن — التوبة: ١٢٩"
        }, {
          text: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
          source: "من القرآن — الأنبياء: ٨٧"
        }, {
          text: "ربنا أفرغ علينا صبرًا وثبت أقدامنا.",
          source: "من القرآن — البقرة: ٢٥٠"
        }],
        actions: ["heart-remedies.d19ff74d8e", "heart-remedies.29ec30040e", "heart-remedies.13570e4fcc", "heart-remedies.c792e5cfdb", "heart-remedies.2b28d8ff43", "heart-remedies.a2f812c85b", "heart-remedies.254eecede8", "heart-remedies.b725b93e75", "heart-remedies.4e189ca2b9", "heart-remedies.654b6728de", "heart-remedies.08e3541e6a", "heart-remedies.0ef1338406"]
      },
      steady: {
        get label() { return ZadI18n.t("heart-hadith.78d9f97f58"); },
        icon: "",
        verses: [{
          title: "لا تزغ قلوبنا",
          text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
          source: "آل عمران: ٨"
        }, {
          title: "استقم",
          text: "فَاسْتَقِمْ كَمَا أُمِرْتَ",
          source: "هود: ١١٢"
        }, {
          title: "استقاموا",
          text: "إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا",
          source: "فصلت: ٣٠"
        }, {
          title: "يثبت الله",
          text: "يُثَبِّتُ اللَّهُ الَّذِينَ آمَنُوا بِالْقَوْلِ الثَّابِتِ",
          source: "إبراهيم: ٢٧"
        }, {
          title: "زادهم هدى",
          text: "وَالَّذِينَ اهْتَدَوْا زَادَهُمْ هُدًى وَآتَاهُمْ تَقْوَاهُمْ",
          source: "محمد: ١٧"
        }, {
          title: "جاهد تُهدَ",
          text: "وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا",
          source: "العنكبوت: ٦٩"
        }, {
          title: "اصبروا ورابطوا",
          text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا",
          source: "آل عمران: ٢٠٠"
        }, {
          title: "حتى يأتيك اليقين",
          text: "وَاعْبُدْ رَبَّكَ حَتَّى يَأْتِيَكَ الْيَقِينُ",
          source: "الحجر: ٩٩"
        }, {
          title: "اذكروني",
          text: "فَاذْكُرُونِي أَذْكُرْكُمْ",
          source: "البقرة: ١٥٢"
        }, {
          title: "الصلاة موقوتة",
          text: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
          source: "النساء: ١٠٣"
        }],
        hadiths: [{
          text: "قل: آمنت بالله، ثم استقم.",
          source: "رواه مسلم"
        }, {
          text: "أحب الأعمال إلى الله أدومها وإن قل.",
          source: "متفق عليه"
        }, {
          text: "كان رسول الله ﷺ يكثر أن يقول: يا مقلب القلوب، ثبت قلبي على دينك.",
          source: "رواه الترمذي"
        }, {
          text: "إن قلوب بني آدم كلها بين إصبعين من أصابع الرحمن كقلب واحد يصرفه حيث يشاء.",
          source: "رواه مسلم"
        }, {
          text: "بادروا بالأعمال فتناً كقطع الليل المظلم.",
          source: "رواه مسلم"
        }, {
          text: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف، وفي كل خير.",
          source: "رواه مسلم"
        }],
        duas: [{
          text: "يا مقلب القلوب، ثبت قلبي على دينك.",
          source: "رواه الترمذي"
        }, {
          text: "اللهم مصرف القلوب، صرف قلبي على طاعتك.",
          source: "رواه مسلم"
        }, {
          text: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة، إنك أنت الوهاب.",
          source: "من القرآن — آل عمران: ٨"
        }, {
          text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
          source: "رواه أبو داود والنسائي"
        }, {
          text: "ربنا أفرغ علينا صبرًا وثبت أقدامنا.",
          source: "من القرآن — البقرة: ٢٥٠"
        }, {
          text: "اهدنا الصراط المستقيم.",
          source: "من القرآن — الفاتحة: ٦"
        }],
        actions: ["heart-remedies.c79dec3ee2", "heart-remedies.2b952ce159", "heart-remedies.e87fb5056b", "heart-remedies.0f6f19f3f6", "heart-remedies.6fe3ff0ba1", "heart-remedies.6c5add7740", "heart-remedies.a5a1d2ddc7", "heart-remedies.d9125fda00", "heart-remedies.e37d47abec", "heart-remedies.0c3d7ba88a", "heart-remedies.edc9b33945", "heart-remedies.6952d2267b"]
      },
      grateful: {
        get label() { return ZadI18n.t("heart-hadith.1168258371"); },
        icon: "",
        verses: [{
          title: "لأزيدنكم",
          text: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
          source: "إبراهيم: ٧"
        }, {
          title: "اشكروا لي",
          text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
          source: "البقرة: ١٥٢"
        }, {
          title: "حدث بالنعمة",
          text: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
          source: "الضحى: ١١"
        }, {
          title: "كلوا واشكروا",
          text: "كُلُوا مِنْ رِزْقِ رَبِّكُمْ وَاشْكُرُوا لَهُ",
          source: "سبأ: ١٥"
        }, {
          title: "اعملوا شكرًا",
          text: "اعْمَلُوا آلَ دَاوُودَ شُكْرًا",
          source: "سبأ: ١٣"
        }, {
          title: "قليل من عبادي الشكور",
          text: "وَقَلِيلٌ مِنْ عِبَادِيَ الشَّكُورُ",
          source: "سبأ: ١٣"
        }, {
          title: "لا تحصوها",
          text: "وَإِنْ تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا",
          source: "إبراهيم: ٣٤"
        }, {
          title: "النعمة من الله",
          text: "وَمَا بِكُمْ مِنْ نِعْمَةٍ فَمِنَ اللَّهِ",
          source: "النحل: ٥٣"
        }, {
          title: "الحمد لله",
          text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          source: "الفاتحة: ٢"
        }, {
          title: "كن من الشاكرين",
          text: "بَلِ اللَّهَ فَاعْبُدْ وَكُنْ مِنَ الشَّاكِرِينَ",
          source: "الزمر: ٦٦"
        }],
        hadiths: [{
          text: "كان النبي ﷺ يقوم من الليل حتى تتفطر قدماه، فقيل له في ذلك، فقال: أفلا أكون عبدًا شكورًا؟",
          source: "متفق عليه"
        }, {
          text: "من لا يشكر الناس لا يشكر الله.",
          source: "رواه أبو داود والترمذي وصححه"
        }, {
          text: "إن الله ليرضى عن العبد أن يأكل الأكلة فيحمده عليها، أو يشرب الشربة فيحمده عليها.",
          source: "رواه مسلم"
        }, {
          text: "الحمد لله تملأ الميزان.",
          source: "رواه مسلم"
        }, {
          text: "عجبًا لأمر المؤمن، إن أمره كله له خير؛ إن أصابته سراء شكر فكان خيرًا له.",
          source: "رواه مسلم"
        }, {
          text: "من صنع إليكم معروفًا فكافئوه، فإن لم تجدوا ما تكافئونه فادعوا له حتى تروا أنكم قد كافأتموه.",
          source: "رواه أبو داود والنسائي وصححه أهل العلم"
        }],
        duas: [{
          text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
          source: "رواه أبو داود والنسائي"
        }, {
          text: "رب أوزعني أن أشكر نعمتك التي أنعمت علي وعلى والدي وأن أعمل صالحًا ترضاه.",
          source: "من القرآن — النمل: ١٩"
        }, {
          text: "الحمد لله حمدًا كثيرًا طيبًا مباركًا فيه.",
          source: "ذكر ثابت في السنة"
        }, {
          text: "الحمد لله رب العالمين.",
          source: "من القرآن — الفاتحة: ٢"
        }, {
          text: "رب أوزعني أن أشكر نعمتك التي أنعمت علي وعلى والدي وأن أعمل صالحًا ترضاه وأصلح لي في ذريتي.",
          source: "من القرآن — الأحقاف: ١٥"
        }, {
          text: "اللهم لك الحمد على نعمك الظاهرة والباطنة، وارزقني حسن استعمالها في رضاك.",
          source: "دعاء عام بمعنى صحيح"
        }],
        actions: ["heart-remedies.b5cb17bfba", "heart-remedies.45a47038f7", "heart-remedies.e06e8cd638", "heart-remedies.cabc672588", "heart-remedies.8879a3d750", "heart-remedies.c2a68675b6", "heart-remedies.76efe53e1d", "heart-remedies.73edf9279e", "heart-remedies.715d446c37", "heart-remedies.4a9eaf5776", "heart-remedies.78c4e69b18", "heart-remedies.b862174bb5"]
      },
      prayer: {
        get label() { return ZadI18n.t("heart-remedies.a40062a9ce"); },
        icon: "",
        verses: [{
          title: "أقم الصلاة لذكري",
          text: "وَأَقِمِ الصَّلَاةَ لِذِكْرِي",
          source: "طه: ١٤"
        }, {
          title: "الصلاة موقوتة",
          text: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا",
          source: "النساء: ١٠٣"
        }, {
          title: "حافظوا على الصلوات",
          text: "حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَى",
          source: "البقرة: ٢٣٨"
        }, {
          title: "الخشوع في الصلاة",
          text: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ ۝ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ",
          source: "المؤمنون: ١–٢"
        }, {
          title: "استعينوا بالصلاة",
          text: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
          source: "البقرة: ٤٥"
        }, {
          title: "مع الصابرين",
          text: "اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
          source: "البقرة: ١٥٣"
        }, {
          title: "أقم الصلاة لدلوك الشمس",
          text: "أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَى غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ",
          source: "الإسراء: ٧٨"
        }, {
          title: "تنهى عن الفحشاء",
          text: "إِنَّ الصَّلَاةَ تَنْهَى عَنِ الْفَحْشَاءِ وَالْمُنْكَرِ",
          source: "العنكبوت: ٤٥"
        }, {
          title: "على صلاتهم يحافظون",
          text: "وَالَّذِينَ هُمْ عَلَى صَلَاتِهِمْ يُحَافِظُونَ",
          source: "المعارج: ٣٤"
        }, {
          title: "لا تكن ممن أضاعها",
          text: "فَخَلَفَ مِنْ بَعْدِهِمْ خَلْفٌ أَضَاعُوا الصَّلَاةَ وَاتَّبَعُوا الشَّهَوَاتِ",
          source: "مريم: ٥٩"
        }],
        hadiths: [{
          text: "سئل النبي ﷺ: أي العمل أحب إلى الله؟ قال: الصلاة على وقتها.",
          source: "متفق عليه"
        }, {
          text: "أرأيتم لو أن نهرًا بباب أحدكم يغتسل منه كل يوم خمس مرات، هل يبقى من درنه شيء؟ ... فذلك مثل الصلوات الخمس يمحو الله بهن الخطايا.",
          source: "متفق عليه"
        }, {
          text: "بين الرجل وبين الشرك والكفر ترك الصلاة.",
          source: "رواه مسلم"
        }, {
          text: "العهد الذي بيننا وبينهم الصلاة، فمن تركها فقد كفر.",
          source: "رواه الترمذي والنسائي وابن ماجه وصححه أهل العلم"
        }, {
          text: "أقرب ما يكون العبد من ربه وهو ساجد، فأكثروا الدعاء.",
          source: "رواه مسلم"
        }, {
          text: "من صلى البردين دخل الجنة.",
          source: "متفق عليه"
        }],
        duas: [{
          text: "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
          source: "رواه أبو داود والنسائي"
        }, {
          text: "رب اجعلني مقيم الصلاة ومن ذريتي ربنا وتقبل دعاء.",
          source: "من القرآن — إبراهيم: ٤٠"
        }, {
          text: "اهدنا الصراط المستقيم.",
          source: "من القرآن — الفاتحة: ٦"
        }, {
          text: "يا مقلب القلوب، ثبت قلبي على دينك.",
          source: "رواه الترمذي"
        }, {
          text: "اللهم مصرف القلوب، صرف قلبي على طاعتك.",
          source: "رواه مسلم"
        }, {
          text: "اللهم إني أعوذ بك من قلب لا يخشع، ومن دعاء لا يسمع.",
          source: "من دعاء النبي ﷺ — رواه مسلم"
        }],
        actions: ["heart-remedies.e268b5fb85", "heart-remedies.5e524012eb", "heart-remedies.baabe0e1a2", "heart-remedies.a11ed183c6", "heart-remedies.96820236bb", "heart-remedies.f5d207e230", "heart-remedies.35606c90a5", "heart-remedies.048039dbfe", "heart-remedies.4b63cf956f", "heart-remedies.1b277e2c94", "heart-remedies.4a8fe94a09", "heart-remedies.6f1f539c59"]
      }
    },
    e = "zad_heart_remedy_index_v62",
    o = (() => {
      try {
        const t = Zad.readJSON(e, {});
        return t && "object" == typeof t ? t : {}
      } catch (t) {
        return {}
      }
    })();

  function s() {
    const t = new Date;
    return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`
  }

  function r(t) {
    let e = 2166136261;
    for (const o of String(t)) e ^= o.charCodeAt(0), e = Math.imul(e, 16777619);
    return Math.abs(e >>> 0)
  }

  function c() {
    try {
      Zad.storage.setItem(e, JSON.stringify(o))
    } catch (t) {}
  }

  function u(e) {
    const o = t[e];
    if (!o) return [];
    const s = [];
    return o.verses.forEach((t, e) => {
      o.actions.forEach((r, c) => {
        const u = o.hadiths[(3 * e + c) % o.hadiths.length],
          i = o.duas[(e + 2 * c) % o.duas.length];
        s.push({
          icon: o.icon,
          get label() { return o.label; },
          title: t.title,
          verse: t.text,
          source: t.source,
          hadith: u.text,
          hadithSource: u.source,
          dua: i.text,
          duaSource: i.source,
          action: r
        })
      })
    }), s
  }
  const i = Object.fromEntries(Object.keys(t).map(t => [t, u(t)]));

  function x(t) {
    const e = i[t] || [];
    if (!e.length) return 0;
    const u = s();
    return o[t] && o[t].day === u || (o[t] = {
      day: u,
      index: r(t + "|" + u) % e.length
    }, c()), Number(o[t].index || 0) % e.length
  }

  function n(t) {
    return (i[t] || [])[x(t)] || null
  }

  function l() {
    const e = document.getElementById("heartMoodGrid");
    e && (e.innerHTML = Object.entries(t).map(([t, e]) => `<button id="heartMood-${t}" onclick="heartChooseMood('${t}')">${e.icon} ${e.label}</button>`).join(""))
  }

  let selectedMood=null;
  function a(t) {
    selectedMood=t;
    const e = n(t),
      o = document.getElementById("heartRemedyResult");
    if (!e || !o) return;
    const s = window.scrollX,
      r = window.scrollY;
    document.querySelectorAll("#heartMoodGrid button").forEach(t => t.classList.remove("active")), document.getElementById("heartMood-" + t)?.classList.add("active"), o.innerHTML = ("<h3>" + (e.icon) + " " + (e.label) + "</h3><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-remedies.bb16aada9b") + "</b><div class=\"verse\" style=\"margin-top:8px\">" + ZadI18n.source(e.verse) + "</div><div class=\"status\" style=\"text-align:center;margin-top:5px\">" + ZadI18n.source(e.source) + "</div></div><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-remedies.a5fd899a29") + "</b><br>" + ZadI18n.source(e.hadith) + "<div class=\"status\" style=\"margin-top:5px\">" + ZadI18n.source(e.hadithSource) + "</div></div><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-hadith.4927cd5a6c") + "</b><br>" + ZadI18n.source(e.dua) + "<div class=\"status\" style=\"margin-top:5px\">" + ZadI18n.source(e.duaSource) + "</div></div><div class=\"heartActionBox\"><b>" + ZadI18n.html("heart-hadith.dd6d1d1a82") + "</b><br>" + (ZadI18n.ui(e.action)) + "</div><div class=\"row\" style=\"margin-top:11px\"><button onclick=\"heartAnotherRemedy('" + (t) + "')\">" + ZadI18n.html("heart-hadith.45ce0ac48f") + "</button><button class=\"secondary\" onclick=\"heartCopyRemedy('" + (t) + "')\">" + ZadI18n.html("heart-hadith.8ce4f331de") + "</button></div>"), requestAnimationFrame(() => window.scrollTo({
      left: s,
      top: r,
      behavior: "auto"
    }))
  }

  function d(t) {
    const e = document.createElement("textarea");
    e.value = t, e.style.position = "fixed", e.style.opacity = "0", document.body.appendChild(e), e.select();
    try {
      document.execCommand("copy")
    } catch (t) {}
    e.remove()
  }
  window.heartChooseMood = function(t) {
    i[t] && a(t)
  }, window.heartAnotherRemedy = function(t) {
    (i[t] || []).length && (function(t, e) {
      const r = i[t] || [];
      r.length && (o[t] = {
        day: s(),
        index: (e % r.length + r.length) % r.length
      }, c())
    }(t, x(t) + 37), a(t))
  }, window.heartCopyRemedy = function(t) {
    const e = n(t);
    if (!e) return;
    const o = ZadI18n.t("heart-remedies.484470932d", {v0:(e.label),v1:(e.verse),v2:(e.source),v3:(e.hadith),v4:(e.hadithSource),v5:(e.dua),v6:(e.duaSource),v7:(ZadI18n.ui(e.action))});
    navigator.clipboard?.writeText ? navigator.clipboard.writeText(o).then(() => {
      "function" == typeof window.showHeartToast && window.showHeartToast(ZadI18n.t("heart-hadith.e348fc3738"))
    }).catch(() => d(o)) : d(o)
  };
  document.addEventListener('zad:language',()=>{l();if(selectedMood)a(selectedMood);});
  const h = window.heartShowPage;

  function m() {
    l(), document.documentElement.setAttribute("data-heart-remedy-count", "120"), document.documentElement.setAttribute("data-heart-remedy-categories", "9")
  }
  "function" == typeof h && (window.heartShowPage = function(t) {
    const e = h.apply(this, arguments);
    return "remedy" === t && requestAnimationFrame(l), e
  }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", m, {
    once: !0
  }) : m()
}()

