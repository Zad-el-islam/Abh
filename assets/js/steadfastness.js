(() => {
  const t = [{
      id: "all",
      get title() { return ZadI18n.t("steadfastness.65f276da33"); }
    }, {
      id: "quran",
      get title() { return ZadI18n.t("steadfastness.3a0f580787"); }
    }, {
      id: "sunnah",
      get title() { return ZadI18n.t("steadfastness.34f9e43b6b"); }
    }, {
      id: "sahaba",
      get title() { return ZadI18n.t("steadfastness.cd10526a64"); }
    }, {
      id: "books",
      get title() { return ZadI18n.t("steadfastness.4590203cda"); }
    }, {
      id: "fav",
      get title() { return ZadI18n.t("steadfastness.9f29089415"); }
    }],
    e = [{
      id: "q_s_01",
      section: "quran",
      type: "short",
      title: "لا تقنط",
      source: "قال تعالى: «لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ» — الزمر: 53",
      text: "لا تجعل ذنب الأمس يمنعك من توبة اليوم. باب الله أوسع من خوفك وأرحم من ظنك.",
      lesson: "ابدأ بالاستغفار، ثم أصلح ما تستطيع إصلاحه."
    }, {
      id: "q_s_02",
      section: "quran",
      type: "short",
      title: "مع العسر يسر",
      source: "قال تعالى: «فَإِنَّ مَعَ الْعُسْرِ يُسْرًا» — الشرح: 5",
      text: "العسر لا يأتي وحده؛ معه لطف خفي وفتح لا تراه الآن.",
      lesson: "لا تحكم على حياتك من لحظة ضيق."
    }, {
      id: "q_s_03",
      section: "quran",
      type: "short",
      title: "حسبك الله",
      source: "قال تعالى: «وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ» — الطلاق: 3",
      text: "من توكل على الله لم ينكسر قلبه وإن تأخرت الأسباب.",
      lesson: "اعمل بالأسباب، واترك النتيجة لله."
    }, {
      id: "q_s_04",
      section: "quran",
      type: "short",
      title: "الذكر طمأنينة",
      source: "قال تعالى: «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» — الرعد: 28",
      text: "القلب لا يهدأ بكثرة الكلام، بل يطمئن حين يعود إلى ربه.",
      lesson: "اجعل لك وردًا يوميًا ولو قليلًا."
    }, {
      id: "q_s_05",
      section: "quran",
      type: "short",
      title: "ربك لا ينسى",
      source: "قال تعالى: «وَمَا كَانَ رَبُّكَ نَسِيًّا» — مريم: 64",
      text: "قد ينسى الناس تعبك، لكن الله لا يضيع خطوة صدق ولا دمعة صبر.",
      lesson: "يكفيك أن الله يعلم ما في قلبك."
    }, {
      id: "q_s_06",
      section: "quran",
      type: "short",
      title: "ادفع بالتي هي أحسن",
      source: "قال تعالى: «ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ» — فصلت: 34",
      text: "ليس كل انتصار أن ترد. أحيانًا الانتصار أن ترتقي فوق الإساءة.",
      lesson: "اختر الرد الذي يحفظ دينك وكرامتك."
    }, {
      id: "q_s_07",
      section: "quran",
      type: "short",
      title: "استعن بالله",
      source: "قال تعالى: «اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ» — البقرة: 153",
      text: "حين تثقل الحياة، لا تحملها وحدك. افتح باب الصلاة، تجد قلبك أخف.",
      lesson: "اجعل الصلاة أول حل لا آخر محاولة."
    }, {
      id: "q_s_08",
      section: "quran",
      type: "short",
      title: "لا تحزن",
      source: "قال تعالى: «لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا» — التوبة: 40",
      text: "المعية مع الله تغيّر معنى الخوف، وتجعل القلب ثابتًا ولو ضاق المكان.",
      lesson: "قل عند الخوف: الله معي."
    }, {
      id: "q_s_09",
      section: "quran",
      type: "short",
      title: "وقل رب زدني علمًا",
      source: "قال تعالى: «وَقُل رَّبِّ زِدْنِي عِلْمًا» — طه: 114",
      text: "كلما زاد علم الإنسان عرف قدر جهله، فطلب من الله زيادة لا غرورًا.",
      lesson: "تعلم كل يوم شيئًا ينفعك."
    }, {
      id: "q_s_10",
      section: "quran",
      type: "short",
      title: "لا يكلف الله نفسًا",
      source: "قال تعالى: «لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا» — البقرة: 286",
      text: "ما دمت في الامتحان، ففيك قدرة على العبور بإذن الله.",
      lesson: "لا تقل لا أستطيع قبل أن تستعين بالله وتجرب."
    }, {
      id: "q_l_01",
      section: "quran",
      type: "long",
      title: "رسالة إلى قلب متعب",
      source: "رسالة مستوحاة من معاني الصبر والتوكل في القرآن",
      text: "يا صاحب القلب المتعب، ليست كل الأبواب التي أُغلقت في وجهك عقوبة، قد يكون بعضها حماية. وليست كل التأخيرات حرمانًا، قد يكون فيها إعداد لقلبك حتى يستقبل النعمة دون أن تضيع منه. القرآن لا يطلب منك أن تكون بلا خوف، ولكنه يعلمك أين تذهب بخوفك. ولا يطلب منك أن تكون بلا ضعف، ولكنه يريك أن الضعف إذا اتصل بالله صار قوة. قل لنفسك: سأفعل ما أقدر عليه، وسأترك ما لا أقدر عليه لمن يملك الأمر كله.",
      lesson: "عند التعب: صل ركعتين، واكتب ما يقلقك، ثم اسعَ في سبب واحد فقط بدل الغرق في كل الهموم."
    }, {
      id: "q_l_02",
      section: "quran",
      type: "long",
      title: "حين يضيق الطريق",
      source: "رسالة مستوحاة من قوله تعالى: «فإن مع العسر يسرا»",
      text: "حين يضيق الطريق لا يعني أن الرحلة انتهت، بل قد يعني أن الله يريد منك أن تسير بوعي أكبر. العسر يعلّمك أن تتخفف من التعلق بالناس، وأن ترى نعمًا كنت تظنها عادية. اليسر لا يأتي دائمًا في صورة مال أو منصب؛ قد يأتي في صبر لم تكن تملكه، أو صحبة صالحة، أو فكرة تنقذك، أو باب رزق صغير يفتح بعده أبوابًا كبيرة. لا تقل: انتهى الأمر. قل: يا رب أرني اليسر الذي جعلته مع هذا العسر.",
      lesson: "استبدل سؤال: لماذا حدث هذا؟ بسؤال: ماذا يريد الله أن أتعلم من هذا؟"
    }, {
      id: "q_l_03",
      section: "quran",
      type: "long",
      title: "القرآن يصنع محاربًا لا محطمًا",
      source: "رسالة مستوحاة من هدايات القرآن",
      text: "القرآن لا يصنع إنسانًا هشًا تهزمه كلمة، ولا قلبًا ينهار عند أول خسارة. القرآن يعلّمك أن الدنيا دار اختبار، وأن الإنسان يُبتلى بقدر ما يحمل من أمانة. المحارب الحقيقي ليس من لا يبكي، بل من يبكي ثم يقوم. وليس من لا يتألم، بل من يجعل الألم طريقًا إلى الله لا طريقًا إلى اليأس. اقرأ القرآن كرسائل موجهة إليك، لا كنص بعيد عن حياتك؛ ستجد فيه جواب القلق، ودواء الغضب، وسند الوحدة، وبوصلة القرار.",
      lesson: "اجعل لك كل يوم آية واحدة تقرؤها وتسأل: ما العمل الذي تطلبه مني هذه الآية؟"
    }, {
      id: "q_l_04",
      section: "quran",
      type: "long",
      title: "بين الخوف والرجاء",
      source: "رسالة مستوحاة من آيات الرحمة والمحاسبة",
      text: "القلب يحتاج جناحين: خوف يمنعه من الغفلة، ورجاء يمنعه من اليأس. من عاش بالخوف وحده احترق، ومن عاش بالرجاء وحده تراخى. القرآن يجمع لك الطريقين؛ يخبرك أن الله شديد العقاب حتى لا تستهين، ويخبرك أنه غفور رحيم حتى لا تنهار. فكن عبدًا يسير إلى الله بقلب حي: إذا أخطأ تاب، وإذا أحسن لم يغتر، وإذا ابتُلي صبر، وإذا أُعطي شكر.",
      lesson: "وازن يومك: استغفار عند التقصير، وشكر عند النعمة، وعمل صالح عند القدرة."
    }, {
      id: "q_l_05",
      section: "quran",
      type: "long",
      title: "رسالة في الرزق",
      source: "رسالة مستوحاة من قوله تعالى: «وفي السماء رزقكم وما توعدون»",
      text: "الرزق ليس مالًا فقط، فقد يرزقك الله قلبًا راضيًا، أو زوجة صالحة، أو ولدًا بارًا، أو صحة في البدن، أو سترًا لا يعرف الناس قيمته. لا تضيق معنى الرزق حتى لا تضيق على نفسك باب الشكر. اسعَ في رزقك بكرامة، ولا تجعل طلب الرزق يأخذك من الرازق. من عرف أن رزقه بيد الله لم يذل قلبه لعبد، ولم يترك العمل بحجة التوكل.",
      lesson: "اسعَ بقوة، واطلب الحلال، ولا تظلم أحدًا من أجل مال زائل."
    }, {
      id: "s_s_01",
      section: "sunnah",
      type: "short",
      title: "الأعمال بالنيات",
      source: "قال رسول الله ﷺ: «إنما الأعمال بالنيات» — متفق عليه",
      text: "قد يتشابه العملان في الشكل، ويفترقان عند الله بسبب النية.",
      lesson: "صحح نيتك قبل أن تبدأ."
    }, {
      id: "s_s_02",
      section: "sunnah",
      type: "short",
      title: "الكلمة الطيبة",
      source: "قال رسول الله ﷺ: «والكلمة الطيبة صدقة» — متفق عليه",
      text: "الكلمة الطيبة صدقة؛ لأنها قد ترفع روحًا أو تطمئن قلبًا.",
      lesson: "قل خيرًا أو اصمت عن الشر."
    }, {
      id: "s_s_03",
      section: "sunnah",
      type: "short",
      title: "القوة الحقيقية",
      source: "قال رسول الله ﷺ: «ليس الشديد بالصرعة...» — متفق عليه",
      text: "الشديد هو الذي يملك نفسه عند الغضب، لا الذي يغلب الناس بلسانه أو يده.",
      lesson: "إذا غضبت، اسكت وتوضأ وغيّر مكانك."
    }, {
      id: "s_s_04",
      section: "sunnah",
      type: "short",
      title: "الدين النصيحة",
      source: "قال رسول الله ﷺ: «الدين النصيحة» — رواه مسلم",
      text: "النصيحة ليست فضيحة، بل رحمة تُقال بأدب وتُراد بها مصلحة.",
      lesson: "انصح سرًا، وابدأ بالرفق."
    }, {
      id: "s_s_05",
      section: "sunnah",
      type: "short",
      title: "يسروا ولا تعسروا",
      source: "قال رسول الله ﷺ: «يسروا ولا تعسروا» — متفق عليه",
      text: "الدين لا يطلب منك أن تنفر الناس، بل أن تفتح لهم باب الخير بالحكمة.",
      lesson: "كن سببًا في قرب الناس من الله لا نفورهم."
    }, {
      id: "s_s_06",
      section: "sunnah",
      type: "short",
      title: "لا تغضب",
      source: "وصية النبي ﷺ: «لا تغضب» — رواه البخاري",
      text: "الغضب لحظة قصيرة قد تترك جرحًا طويلًا.",
      lesson: "تدرّب على تأخير الرد حتى يهدأ قلبك."
    }, {
      id: "s_s_07",
      section: "sunnah",
      type: "short",
      title: "تبسمك صدقة",
      source: "معنى حديث: «تبسمك في وجه أخيك صدقة» — رواه الترمذي",
      text: "الابتسامة عبادة سهلة، لكنها تترك أثرًا في القلوب.",
      lesson: "لا تستهن باللطف البسيط."
    }, {
      id: "s_s_08",
      section: "sunnah",
      type: "short",
      title: "ترك ما لا يعنيك",
      source: "قال رسول الله ﷺ: «من حسن إسلام المرء تركه ما لا يعنيه» — رواه الترمذي وغيره",
      text: "راحة القلب تبدأ حين يترك الإنسان ما لا يخصه ولا ينفعه.",
      lesson: "لا تدخل في كل جدال، ولا تطارد كل خبر."
    }, {
      id: "s_l_01",
      section: "sunnah",
      type: "long",
      title: "وصية نبوية للمحارب",
      source: "رسالة مستوحاة من جوامع وصايا النبي ﷺ",
      text: "كان النبي ﷺ يربّي أصحابه على قوة القلب قبل قوة الجسد. علّمهم أن النية أساس العمل، وأن الغضب يُهزم بالحلم، وأن الكلمة قد تكون صدقة، وأن تبسّم الإنسان في وجه أخيه عبادة. هذه السنن الصغيرة تصنع إنسانًا كبيرًا؛ إنسانًا لا يترك أخلاقه عند باب العمل، ولا ينسى رحمته وقت الخلاف، ولا يبيع آخرته من أجل انتصار سريع. المحارب الذي يتبع سنة النبي ﷺ يعرف أن أعظم معاركه ليست مع الناس، بل مع نفسه: مع غضبه، وكبره، وحسده، وكسله، ولسانه.",
      lesson: "اختر خلقًا نبويًا واحدًا هذا الأسبوع ودرّب نفسك عليه حتى يصبح عادة."
    }, {
      id: "s_l_02",
      section: "sunnah",
      type: "long",
      title: "القلب الذي يحب الخير",
      source: "رسالة مستوحاة من حديث: «لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه»",
      text: "الإيمان ليس شعورًا داخليًا فقط، بل يظهر في طريقة نظرتك للناس. أن تحب لأخيك ما تحب لنفسك يعني أن تفرح بنجاحه، وأن لا تتمنى زوال نعمته، وأن تعينه إن استطعت، وأن تكف أذاك عنه. القلب الذي يحب الخير للناس يعيش أكثر راحة؛ لأنه لا يحترق بالمقارنة، ولا يتعب بالحسد، ولا يضيق برزق كتبه الله لغيره. وكلما صفا القلب اتسعت الحياة.",
      lesson: "ادعُ اليوم لشخص نجح أو رُزق، وقل: اللهم بارك له وزدني من فضلك."
    }, {
      id: "s_l_03",
      section: "sunnah",
      type: "long",
      title: "سنن صغيرة تغير اليوم",
      source: "رسالة مستوحاة من هدي النبي ﷺ في الحياة اليومية",
      text: "هناك سنن تبدو بسيطة لكنها تصنع فرقًا عظيمًا: أن تبدأ يومك بذكر الله، أن تسمي قبل طعامك، أن تحمد الله بعده، أن تبتسم في وجه من تلقاه، أن تخفض صوتك، أن تكظم غيظك، أن تصل رحمك، أن تنام وقلبك لا يحمل حقدًا. هذه التفاصيل الصغيرة تشبه قطرات الماء؛ لا تصنع نهرًا في يوم، لكنها مع الاستمرار تغيّر مجرى الحياة.",
      lesson: "لا تبحث عن عمل ضخم فقط. أصلح التفاصيل الصغيرة، فهي التي تصنع الشخصية."
    }, {
      id: "c_s_01",
      section: "sahaba",
      type: "short",
      title: "أبو بكر والثبات",
      source: "من معاني سيرة أبي بكر الصديق رضي الله عنه",
      text: "الثبات ليس كثرة كلام، بل صدق قلب يظهر وقت الشدة.",
      lesson: "اثبت على الحق ولو قلّ المؤيدون."
    }, {
      id: "c_s_02",
      section: "sahaba",
      type: "short",
      title: "عمر والعدل",
      source: "من معاني سيرة عمر بن الخطاب رضي الله عنه",
      text: "العدل قوة، والظلم ضعف ولو كان صاحبه صاحب منصب.",
      lesson: "ابدأ العدل من قراراتك الصغيرة."
    }, {
      id: "c_s_03",
      section: "sahaba",
      type: "short",
      title: "عثمان والحياء",
      source: "من معاني سيرة عثمان بن عفان رضي الله عنه",
      text: "الحياء لا يمنع صاحبه من القوة، بل يمنعه من القبيح.",
      lesson: "استحِ من الله قبل الناس."
    }, {
      id: "c_s_04",
      section: "sahaba",
      type: "short",
      title: "علي والحكمة",
      source: "من معاني سيرة علي بن أبي طالب رضي الله عنه",
      text: "ليس كل صمت ضعفًا؛ أحيانًا يكون الصمت حكمة تمنع فتنة.",
      lesson: "اختر وقت الكلام كما تختار الكلام نفسه."
    }, {
      id: "c_s_05",
      section: "sahaba",
      type: "short",
      title: "بلال والحرية",
      source: "من معاني سيرة بلال بن رباح رضي الله عنه",
      text: "من عرف الله تحرر قلبه، ولو ظن الناس أنهم يملكون جسده.",
      lesson: "لا تجعل قلبك عبدًا لمدح أو خوف."
    }, {
      id: "c_s_06",
      section: "sahaba",
      type: "short",
      title: "خالد والعمل",
      source: "من معاني سيرة خالد بن الوليد رضي الله عنه",
      text: "المهارة نعمة، لكنها تحتاج إخلاصًا حتى تكون في ميزان الخير.",
      lesson: "اجعل قوتك في خدمة الحق."
    }, {
      id: "c_l_01",
      section: "sahaba",
      type: "long",
      title: "مدرسة الصحابة",
      source: "رسالة مستوحاة من سِيَر الصحابة رضي الله عنهم",
      text: "الصحابة لم يكونوا ملائكة، بل بشرًا آمنوا فصدقوا، وتعلموا فعملوا، وأخطأ بعضهم فتاب، وابتُلوا فثبتوا. في سيرتهم نتعلم أن الدين ليس كلامًا جميلًا فقط، بل مواقف. أبو بكر يعلمنا الثبات حين يضطرب الناس. عمر يعلمنا أن العدل عبادة ومسؤولية. عثمان يعلمنا أن الحياء لا يناقض القوة. علي يعلمنا أن العلم والشجاعة يحتاجان حكمة. ومن مجموع سيرتهم نفهم أن القرب من النبي ﷺ صنع رجالًا ونساءً يحملون الرسالة لا بالشعارات، بل بالأخلاق والعمل والتضحية.",
      lesson: "اقرأ كل أسبوع سيرة صحابي واحد، واكتب خلقًا واحدًا تريد أن تتعلمه منه."
    }, {
      id: "c_l_02",
      section: "sahaba",
      type: "long",
      title: "رسالة من سيرة بلال",
      source: "رسالة مستوحاة من ثبات بلال بن رباح رضي الله عنه",
      text: "في سيرة بلال رضي الله عنه معنى عظيم: قد يملك الناس جسد الإنسان، لكنهم لا يملكون قلبه إذا امتلأ بالتوحيد. كان الأذى شديدًا، لكن كلمة الإيمان كانت أقوى من الألم. وهذا يعلمك أن الحرية الحقيقية تبدأ من الداخل؛ من قلب لا يعبد إلا الله، ولا يبيع يقينه من أجل راحة مؤقتة. كل إنسان له امتحان، وقد يكون امتحانك في كلمة حق، أو صبر على أذى، أو ثبات أمام إغراء. فاجعل في قلبك كلمة لا تتنازل عنها: الله ربي، ورضاه غايتي.",
      lesson: "اسأل نفسك: ما الشيء الذي لا أريد أن أتنازل عنه مهما كان الضغط؟"
    }, {
      id: "c_l_03",
      section: "sahaba",
      type: "long",
      title: "رسالة من عدل عمر",
      source: "رسالة مستوحاة من سيرة عمر بن الخطاب رضي الله عنه",
      text: "العدل ليس شعارًا يعلقه الإنسان على كلامه، بل ميزان يضعه على نفسه أولًا. عمر رضي الله عنه بقي في ذاكرة الأمة لأنه فهم أن القوة بلا عدل تتحول إلى خوف، وأن المنصب بلا مراقبة لله يصبح فتنة. كل واحد منا له دائرة مسؤولية: بيت، عمل، فريق، قرار، كلمة. وفي كل دائرة هناك فرصة للعدل أو الظلم. لا تنتظر منصبًا كبيرًا لتكون عادلًا؛ ابدأ من أصغر موقف: لا تظلم في حكم، لا تجرح في خصومة، لا تحابِ على حساب الحق.",
      lesson: "قبل أي قرار يؤثر في غيرك، اسأل: هل أرضى أن يُعاملني الناس بهذا القرار؟"
    }, {
      id: "d_01",
      section: "daily",
      type: "short",
      title: "ذكر الصباح",
      source: "من الأذكار العامة المشروعة",
      text: "سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر.",
      lesson: "قلها عشر مرات بقلب حاضر."
    }, {
      id: "d_02",
      section: "daily",
      type: "short",
      title: "استغفار قصير",
      source: "من الأذكار العامة",
      text: "أستغفر الله العظيم وأتوب إليه.",
      lesson: "كررها كلما شعرت بثقل الذنب أو الهم."
    }, {
      id: "d_03",
      section: "daily",
      type: "short",
      title: "دعاء الثبات",
      source: "دعاء مأثور: «يا مقلب القلوب ثبت قلبي على دينك»",
      text: "يا مقلب القلوب ثبت قلبي على دينك.",
      lesson: "قلها عند الفتن وكثرة التشتت."
    }, {
      id: "d_04",
      section: "daily",
      type: "short",
      title: "دعاء الهم",
      source: "من جوامع الدعاء",
      text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل.",
      lesson: "اجمع بين الدعاء والعمل على إزالة السبب."
    }, {
      id: "d_05",
      section: "daily",
      type: "long",
      title: "خطة يوم مؤمن",
      source: "برنامج عملي يومي",
      text: "ابدأ يومك بصلاة الفجر أو بالمحافظة على أول صلاة في وقتها إن فاتك الفجر. اقرأ ولو صفحة من القرآن. قل أذكارًا قليلة لكن ثابتة. في العمل، راقب الله في الوقت والكلمة والمال. في البيت، كن لينًا؛ فالقرباء أولى بحسن خلقك. قبل النوم، سامح من استطعت، واستغفر عما قصرت، واكتب نعمة واحدة تشكر الله عليها. بهذا لا يصبح اليوم مثاليًا، لكنه يصبح يومًا فيه اتجاه صحيح.",
      lesson: "لا تنتظر يومًا خاليًا من المشاكل لتكون قريبًا من الله."
    }, {
      id: "b_01",
      section: "books",
      type: "book",
      title: "رسائل من القرآن — بطاقة كتاب",
      source: "قسم للملخصات والملاحظات الشخصية",
      text: "هذا القسم مخصص لإضافة ملخصك الشخصي من الكتاب، مثل: أهم فكرة، أكثر رسالة أثرت فيك، وكيف ستطبقها في حياتك. لا يتم وضع نص الكتاب كاملًا إلا بإذن رسمي من صاحب الحقوق.",
      lesson: "اكتب ملخصك أنت، ولا تنسخ الكتاب كاملًا."
    }, {
      id: "b_02",
      section: "books",
      type: "book",
      title: "رسائل من النبي — بطاقة كتاب",
      source: "قسم للملخصات والملاحظات الشخصية",
      text: "يمكن تحويل كل فصل أو رسالة إلى بطاقة قصيرة: عنوان الفكرة، الحديث أو المعنى العام، ثم تطبيق عملي. هكذا يكون التطبيق مفيدًا وقانونيًا.",
      lesson: "اجعل التطبيق مساحة تعلم لا نسخًا مخالفًا."
    }, {
      id: "b_03",
      section: "books",
      type: "book",
      title: "رسائل من الصحابة — بطاقة كتاب",
      source: "قسم للملخصات والملاحظات الشخصية",
      text: "ضع هنا ملاحظاتك الخاصة بعد القراءة: موقف من السيرة، الخلق المستفاد، ومثال عملي في الحياة اليومية.",
      lesson: "كل قراءة لا تتحول إلى عمل تبقى ناقصة."
    }],
    s = {
      quran: 150,
      prophet: 314,
      sahaba: 150
    },
    o = {
      quran: "quran",
      prophet: "sunnah",
      sahaba: "sahaba"
    },
    n = {
      quran: "رسائل من القرآن",
      prophet: "رسائل من النبي ﷺ",
      sahaba: "رسائل من الصحابة"
    },
    a = "zad_resume_warrior_section_v1",
    i = "zad_resume_warrior_page_v1";
  let l = Zad.storage.getItem(a) || "all";
  ["all", "quran", "sunnah", "sahaba", "books", "fav"].includes(l) || (l = "all");
  let c = Math.min(100, Math.max(1, Number(Zad.storage.getItem(i) || 1) || 1)),
    r = [];
  try {
    r = Zad.readJSON("zad_favorites_integrated", [])
  } catch (t) {
    r = []
  }
  const d = t => document.getElementById(t),
    u = t => ZadI18n.number(t),
    p = e => (t.find(t => t.id === e) || {}).title || e;

  function h(t, e) {
    return {
      id: `page_${t}_${e}`,
      section: o[t],
      type: "bookpage",
      title: ZadI18n.t("steadfastness.5bcdb1b452", {v0:(n[t]),v1:(u(e))}),
      source: ZadI18n.t("steadfastness.d37818d575", {v0:(u(e))}),
      get text() { return ZadI18n.t("steadfastness.99e0cc1aba"); },
      get lesson() { return ZadI18n.t("steadfastness.a24c881834"); },
      bookKey: t,
      page: e
    }
  }
  const _ = [];
  Object.entries(s).forEach(([t, e]) => {
    for (let s = 1; s <= e; s++) _.push(h(t, s))
  });
  const g = [...e, ..._];

  function y() {
    if (!d("zadCountAll")) return;
    const t = "fav" === l ? g.filter(t => r.includes(t.id) && "book" !== t.type) : ("all" === l || "books" === l) ? g.filter(t => "book" !== t.type && "bookpage" !== t.type) : g.filter(t => t.section === l && "book" !== t.type && "bookpage" !== t.type),
      e = t.filter(t => "short" === t.type).length,
      o = t.filter(t => "long" === t.type || "bookpage" === t.type).length,
      n = t.filter(t => r.includes(t.id)).length;
    d("zadCountAll").textContent = u(t.length), d("zadCountShort").textContent = u(e), d("zadCountLong").textContent = u(o), d("zadCountFav").textContent = u(n), d("zadCountAllLabel") && (d("zadCountAllLabel").textContent = {
      get all() { return ZadI18n.t("steadfastness.d42e0447a1"); },
      get quran() { return ZadI18n.t("steadfastness.3a0f580787"); },
      get sunnah() { return ZadI18n.t("steadfastness.34f9e43b6b"); },
      get sahaba() { return ZadI18n.t("steadfastness.cd10526a64"); },
      get fav() { return ZadI18n.t("steadfastness.9f29089415"); }
    } [l] || ZadI18n.t("steadfastness.ebce03dc8d"))
  }

  function b() {
    const e = d("zadTabs");
    e && (e.innerHTML = "", t.forEach(t => {
      const s = document.createElement("button");
      s.type = "button", s.className = "zadTab" + (t.id === l ? " active" : ""), s.textContent = t.title, s.onclick = () => {
        l = t.id, c = 1;
        try {
          Zad.storage.setItem(a, l), Zad.storage.setItem(i, "1")
        } catch (t) {}
        b(), y(), x(), requestAnimationFrame(() => {
          const e = "books" === t.id ? d("zadBooksArea") : d("zadTabs");
          e && e.scrollIntoView({
            behavior: "auto",
            block: "start"
          })
        })
      }, e.appendChild(s)
    }))
  }

  function x() {
    const t = d("zadBooksArea"),
      e = d("zadCards"),
      s = d("zadPager");
    if (!t || !e || !s) return;
    t.classList.toggle("hidden", l !== "books");t.setAttribute("aria-hidden", String(l !== "books"));
    const o = function() {
        const t = Zad.normalize(d("zadSearchInput")?.value || ""),
          e = d("zadTypeFilter")?.value || "all";
        return g.filter(s => {
          if ("book" === s.type || ("bookpage" === s.type && l !== "fav")) return !1;
          const o = "all" === l || "books" === l || s.section === l || "fav" === l && r.includes(s.id),
            n = "bookpage" === s.type ? "long" : s.type,
            a = "all" === e || n === e,
            i = Zad.normalize(`${s.title||""} ${s.source||""} ${s.text||""} ${s.lesson||""} ${p(s.section)}`);
          return o && a && (!t || i.includes(t))
        })
      }(),
      n = 24 * ((c = Math.min(c, Math.max(1, Math.ceil(o.length / 24)))) - 1),
      a = o.slice(n, n + 24);
    if (!a.length) return e.innerHTML = ("<div class=\"zadEmpty\">" + ZadI18n.html("steadfastness.99e054643a") + "<br>" + ZadI18n.html("steadfastness.9052189e78") + "</div>"), void(s.innerHTML = "");
    e.innerHTML = a.map(t => `<article class="zadMessageCard">${function(t){const e=r.includes(t.id),s=`<div class="zadTags"><span class="zadTag">${p(t.section)}</span><span class="zadTag">${o=t.type,"short"===o?ZadI18n.t("steadfastness.5afba9761c"):"long"===o?ZadI18n.t("steadfastness.766c6d8134"):"bookpage"===o?ZadI18n.t("steadfastness.b774e2f72d"):o}</span></div><h3>${t.title}</h3><div class="zadSource">${t.source||""}</div>`;var o;return"bookpage"===t.type?("" + (s) + "<p class=\"zadText\">" + (t.text) + "</p><div class=\"zadLesson\"><strong>" + ZadI18n.html("steadfastness.e7e4855435") + "</strong> " + (t.lesson) + "</div><div class=\"zadActions\"><span class=\"status\">" + ZadI18n.html("steadfastness.fb62a60e0e") + "</span><button class=\"secondary zadFav " + (e?"active":"") + "\" onclick=\"zadToggleFavorite('" + (t.id) + "')\">" + (e?ZadI18n.t("steadfastness.45827da641"):ZadI18n.t("steadfastness.fdc32ca4bc")) + "</button></div>"):("" + (s) + "<p class=\"zadText\">" + (t.text||"") + "</p><div class=\"zadLesson\"><strong>" + ZadI18n.html("steadfastness.00f8f28a38") + "</strong> " + (t.lesson||"") + "</div><div class=\"zadActions\"><button class=\"zadFav " + (e?"active":"") + "\" onclick=\"zadToggleFavorite('" + (t.id) + "')\">" + (e?ZadI18n.t("steadfastness.a9ca8ea27e"):ZadI18n.t("steadfastness.fdc32ca4bc")) + "</button><button class=\"secondary\" onclick=\"zadCopyMessage('" + (t.id) + "')\">" + ZadI18n.html("heart-hadith.29a0e2739a") + "</button></div>")}(t)}</article>`).join(""),
      function(t) {
        const e = d("zadPager");
        if (!e) return;
        const s = Math.max(1, Math.ceil(t / 24));
        c > s && (c = s), e.innerHTML = t <= 24 ? "" : ("<button class=\"secondary\" " + (c<=1?"disabled":"") + " onclick=\"zadGoPage(-1)\">" + ZadI18n.html("quran-reader.a9e9d06710") + "</button><span class=\"zadPagerInfo\">" + ZadI18n.html("steadfastness.f779f323cd",{v0:(u(c)),v1:(u(s))}) + "</span><button class=\"secondary\" " + (c>=s?"disabled":"") + " onclick=\"zadGoPage(1)\">" + ZadI18n.html("quran-reader.5cf7af74fd") + "</button>")
      }(o.length)
  }

  function z() {
    b(), y(),
      function() {
        const t = e.filter(t => "short" === t.type || "long" === t.type);
        if (!t.length || !d("zadDailyText")) return;
        const s = t[Math.floor(Date.now() / 864e5) % t.length];
        d("zadDailyText").innerHTML = `<strong>${s.title}</strong><br>${s.text}<br><span style="color:var(--muted)">${s.lesson||""}</span>`
      }(), x(), d("zadSearchInput")?.addEventListener("input", () => {
        c = 1, x()
      }), d("zadTypeFilter")?.addEventListener("change", () => {
        c = 1, x()
      }), document.addEventListener("click", t => {
        const e = d("zadPalettePanel");
        !e || e.classList.contains("hidden") || t.target.closest("#zadPalettePanel") || t.target.closest('[onclick*="toggleZadPaletteMenu"]') || e.classList.add("hidden")
      })
  }
  window.zadToggleFavorite = function(t) {
    r = r.includes(t) ? r.filter(e => e !== t) : [...r, t],
      function() {
        try {
          Zad.storage.setItem("zad_favorites_integrated", JSON.stringify(r))
        } catch (t) {}
      }(), y(), x()
  }, window.zadCopyMessage = function(t) {
    const s = e.find(e => e.id === t);
    if (!s) return;
    const o = ZadI18n.t("steadfastness.eb13190b62", {v0:(s.title),v1:(s.source||""),v2:(s.text||""),v3:(s.lesson||"")});
    navigator.clipboard?.writeText ? navigator.clipboard.writeText(o).then(() => Zad.toast(ZadI18n.t("steadfastness.830cba11db"))).catch(() => prompt(ZadI18n.t("steadfastness.660ea91212"), o)) : prompt(ZadI18n.t("steadfastness.660ea91212"), o)
  }, window.zadGoPage = function(t) {
    c = Math.max(1, c + t);
    try {
      Zad.storage.setItem(i, String(c))
    } catch (t) {}
    x(), d("zadCards")?.scrollIntoView({
      behavior: "auto",
      block: "start"
    })
  }, window.toggleZadPaletteMenu = function(event) {
    event?.stopPropagation();window.ZadSettings?.open();
  }, window.chooseZadPalette = function(color) {
    ZadAppearance.set(color,'zad');d("zadPalettePanel")?.classList.add("hidden");
  }, window.openZadHelp = function() {
    d("zadHelpModal")?.classList.add("show")
  }, window.closeZadHelp = function() {
    d("zadHelpModal")?.classList.remove("show")
  };
  document.addEventListener('zad:language',()=>{if(f){b();y();x();}});
  let f = !1;
  window.zadEnsureZadInit = function() {
    f || (f = !0, z())
  }
})()

