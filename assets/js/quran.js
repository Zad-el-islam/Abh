"use strict";
const QURAN_API_URL = "https://api.alquran.cloud/v1/quran/quran-uthmani",
  TAFSIR_API_BASE = "https://quranenc.com/api/v1/translation/aya/arabic_mokhtasar/",
  QURAN_STORE_KEY = "quran_uthmani_cache_v2",
  START_KEY = "wird_start_date_v2",
  AMOUNT_KEY = "wird_daily_hizb_v2",
  DONE_KEY = "wird_done_map_v2",
  TAFSIR_CACHE_PREFIX = "wird_tafsir_mokhtasar_v1_",
  AYAH_RECITER_KEY = "wird_ayah_reciter_v1_",
  FULL_SURAH_RECITER_KEY = "wird_full_surah_reciter_v1_",
  EVERYAYAH_AUDIO_BASE = "https://everyayah.com/data",
  TIMED_QURAN_AUDIO_BASE = "https://cdn.mualim.app",
  TIMED_QURAN_HF_BASE = "https://huggingface.co/datasets/zaibihassan/Quranic-Recitation-Data/resolve/main",
  AYAH_RECITERS = {
    husary_mujawwad: {
      label: "محمود خليل الحصري — مجوّد",
      type: "ayah",
      folder: "Husary_128kbps_Mujawwad",
      fullSurahBase: "https://server13.mp3quran.net/husr/Almusshaf-Al-Mojawwad/"
    },
    minshawi_mujawwad: {
      label: "محمد صديق المنشاوي — مجوّد",
      type: "ayah",
      folder: "Minshawy_Mujawwad_192kbps",
      fullSurahBase: "https://server10.mp3quran.net/minsh/Almusshaf-Al-Mojawwad/"
    },
    muhammad_ayyoub_murattal: {
      label: "محمد أيوب — ترتيل",
      type: "ayah",
      folder: "Muhammad_Ayyoub_128kbps",
      fullSurahBase: "https://server8.mp3quran.net/ayyub/"
    },
    luhaidan_murattal: {
      get label() { return "محمد اللحيدان — ترتيل"; },
      type: "timed-surah",
      slug: "muhammad-al-luhaidan-murattal",
      folderName: "Muhammad Al Luhaidan (Murattal)",
      fullSurahBase: "https://server8.mp3quran.net/lhdan/"
    },
    yasser_dossari_murattal: {
      label: "ياسر الدوسري — ترتيل",
      type: "ayah",
      folder: "Yasser_Ad-Dussary_128kbps",
      fullSurahBase: "https://server11.mp3quran.net/yasser/"
    },
    alafasy_murattal: {
      label: "مشاري راشد العفاسي — ترتيل",
      type: "ayah",
      folder: "Alafasy_128kbps",
      fullSurahBase: "https://server8.mp3quran.net/afs/"
    }
  },
  DAILY_AYAH_RECITER_KEYS = ["husary_mujawwad", "minshawi_mujawwad", "muhammad_ayyoub_murattal", "yasser_dossari_murattal", "alafasy_murattal"],
  DAILY_AYAH_RECITERS = Object.fromEntries(DAILY_AYAH_RECITER_KEYS.map(e => [e, AYAH_RECITERS[e]]));
let ayahAudioPlayer = null,
  activeAyahAudio = null,
  ayahAudioRequestToken = 0;
const ayahTimingCache = new Map;
let fullSurahAudioPlayer = null,
  activeFullSurahAudio = null,
  fullSurahAudioRequestToken = 0,
  fullQuranAudioListRendered = !1;
const THEME_KEY = "wird_theme_v1",
  PALETTE_KEY = "wird_palette_v1",
  ZAD_PALETTE_KEY = "zad_palette_v1",
  BOOK_FILE_NAME = "الأصول الثلاثة وأدلتها.pdf",
  QURAN_PDF_FILE_NAME = "القرآن الكريم.pdf";
let bookPdfUrl = "",
  quranPdfUrl = "",
  quran = null,
  flatAyahs = [],
  portions = [],
  currentPortion = 1,
  dailyHizb = 1;

function $(e) {
  return document.getElementById(e)
}
const AVAILABLE_PALETTES = ZadAppearance.names;

function applyPalette(value, persist = true) {
  if(persist) ZadAppearance.set(value);
  else ZadAppearance.activate();
}
function choosePalette(value) {
  ZadAppearance.set(value,'wird');
  $("palettePanel")?.classList.add("hidden");
}
function togglePaletteMenu(event) {
  event?.stopPropagation();
  window.ZadSettings?.open();
}
function initPalette() { ZadAppearance.activate(); }
function getSavedModulePalette(module) { return ZadAppearance.get(module); }
function applyModulePalette(module) { ZadAppearance.activate(module); }

function applyTheme(e, t = !0) {
  const a = "light" === e ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", a);
  const r = $("themeToggle");
  if (r) {
    const e = "dark" === a;
    r.textContent = e ? "☀️" : "🌙", r.setAttribute("aria-label", e ? ZadI18n.t("quran.cd0a505606") : ZadI18n.t("quran.a9e77d8f66")), r.title = e ? ZadI18n.t("quran.754f3b741b") : ZadI18n.t("quran.c5a20c864d")
  }
  const n = document.querySelector('meta[name="theme-color"]');
  if (n && n.setAttribute("content", "dark" === a ? "#0a2419" : "#f4efe4"), t) try {
    Zad.storage.setItem(THEME_KEY, a)
  } catch (e) {}
}

function toggleTheme() {
  applyTheme("dark" === (document.documentElement.getAttribute("data-theme") || "dark") ? "light" : "dark")
}

function initTheme() {
  applyTheme(Zad.storage.getItem('zad_theme_v2') || Zad.storage.getItem(THEME_KEY) || 'light', false);
}

function localTodayISO() {
  const e = new Date;
  return `${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`
}

function daysBetween(e, t) {
  const [a, r, n] = e.split("-").map(Number), [o, i, u] = t.split("-").map(Number);
  return Math.floor((Date.UTC(o, i - 1, u) - Date.UTC(a, r - 1, n)) / 864e5)
}

function arabicDigits(e) {
  return ZadI18n.number(e)
}

function escapeHTML(e) {
  return String(e ?? "").replace(/[&<>'"]/g, e => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  } [e]))
}

function normalizeArabic(e) {
  return (e || "").replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي")
}

function getStoredAmount() {
  return 2 === Number(Zad.storage.getItem(AMOUNT_KEY) || "1") ? 2 : 1
}

function showInstantQuranShell(e = ZadI18n.t("quran.8789771d24")) {
  const t = $("loading");
  t && t.classList.add("hidden");
  const a = $("wirdContent");
  a && !quran && (a.innerHTML = `<div class="status" style="padding:14px 4px">${escapeHTML(e)}</div>`)
}
async function init() {
  window.__zadQuranState = "loading";
  dailyHizb = getStoredAmount();
  syncAmountControls();
  const saved = Zad.storage.getItem(START_KEY);
  $('startDate').value = /^\d{4}-\d{2}-\d{2}$/.test(saved || '') ? saved : localTodayISO();
  showInstantQuranShell();
  quran = null;
  try {
    const cached = Zad.storage.getItem(QURAN_STORE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        validateQuran(parsed);
        quran = parsed;
      } catch (_) {
        Zad.storage.removeItem(QURAN_STORE_KEY);
      }
    }
    if (!quran) {
      const response = await Zad.fetch(QURAN_API_URL, {
        cache: 'force-cache'
      });
      if (!response.ok) throw new Error('unavailable');
      const payload = await response.json();
      validateQuran(payload.data);
      quran = payload.data;
      Zad.storage.setItem(QURAN_STORE_KEY, JSON.stringify(quran));
    }
    prepareData();
    window.__zadQuranState = 'ready';
    if ($('surahSelect')) fillSurahs();
    showToday();
    if ($('loadMsg')) $('loadMsg').textContent = ZadI18n.t("quran.c1ecfe3ce2");
    document.dispatchEvent(new CustomEvent('zad:quran-ready'));
  } catch (_) {
    quran = null;
    window.__zadQuranState = "error";
    __zadWirdInitStarted = false;
    const message = ZadI18n.t("quran.6b8a988568");
    if ($('loadMsg')) $('loadMsg').textContent = message;
    const reader = $('v22ReaderWorkspace');
    if (reader) reader.innerHTML = '<div class="empty-state"><p>' + Zad.escape(message) + '</p><button data-quran-retry>' + (ZadI18n.t("quran-reader.14d5786f2e")) + '</button><a href="reader.html?book=quran">' + (ZadI18n.t("quran.e613eb096e")) + '</a></div>';
  }
}

function validateQuran(e) {
  if (!e || !Array.isArray(e.surahs) || 114 !== e.surahs.length) throw new Error(ZadI18n.t("quran.d1623c0f88"));
  const t = e.surahs.reduce((e, t) => e + (Array.isArray(t.ayahs) ? t.ayahs.length : 0), 0);
  if (6236 !== t) throw new Error(ZadI18n.t("quran.7c1bdd3ed7", {v0:(t)}));
  for (const t of e.surahs) {
    if (!t.name || !Array.isArray(t.ayahs) || !t.ayahs.length) throw new Error(ZadI18n.t("quran.a879402b7b", {v0:(t.number||"?")}));
    for (const e of t.ayahs)
      if ("string" != typeof e.text || !e.text.trim() || !e.numberInSurah) throw new Error(ZadI18n.t("quran.709e482e28", {v0:(t.name)}))
  }
}

function prepareData() {
  flatAyahs = [];
  for (const e of quran.surahs)
    for (const t of e.ayahs) flatAyahs.push({
      ...t,
      surahNumber: e.number,
      surahName: e.name,
      englishName: e.englishName
    });
  rebuildPortions()
}

function rebuildPortions() {
  const e = 4 * dailyHizb,
    t = 240 / e;
  portions = Array.from({
    length: t
  }, () => []);
  for (const a of flatAyahs) {
    const r = Number(a.hizbQuarter || 1),
      n = Math.min(t - 1, Math.max(0, Math.floor((r - 1) / e)));
    portions[n].push(a)
  }
  updateSummaryLabels()
}

function updateSummaryLabels() {
  const e = portions.length || (2 === dailyHizb ? 30 : 60);
  $("khatmaPill").textContent = ZadI18n.t("quran.6b239c3163", {v0:(arabicDigits(e))}), $("amountPill").textContent = 2 === dailyHizb ? ZadI18n.t("quran.e3c80af5f3") : ZadI18n.t("quran.6591068372"), $("markWirdDoneBtn") && ($("markWirdDoneBtn").textContent = 2 === dailyHizb ? ZadI18n.t("quran.61b768546f") : ZadI18n.t("quran.17c0fb060f")), $("settingsHint").textContent = 2 === dailyHizb ? ZadI18n.t("quran.531666d32e") : ZadI18n.t("quran.064c9c6ab0")
}

function fillSurahs() {
  const e = $("surahSelect");
  e && (e.innerHTML = quran.surahs.map(e => ("<option value=\"" + (e.number) + "\">" + ZadI18n.html("quran.f64d41894f",{v0:(arabicDigits(e.number)),v1:(escapeHTML(e.name)),v2:(arabicDigits(e.ayahs.length))}) + "</option>")).join(""), renderSurah(1))
}
initPalette(), initTheme();
const MAIN_APP_KEY = "alwird_main_section_v1";

function switchMainApp(e, t = !0) {
  const a = "zad" === e,
    r = document.getElementById("wirdModule"),
    n = document.getElementById("zadModule"),
    o = document.querySelector("nav.tabs"),
    i = document.getElementById("mainSwitchWird"),
    u = document.getElementById("mainSwitchZad");
  if (r && n && i && u && (r.classList.toggle("hidden", a), n.classList.toggle("hidden", !a), o && o.classList.toggle("hidden", a), i.classList.toggle("active", !a), u.classList.toggle("active", a), i.setAttribute("aria-selected", String(!a)), u.setAttribute("aria-selected", String(a)), Zad.storage.setItem(MAIN_APP_KEY, a ? "zad" : "wird"), applyModulePalette(a ? "zad" : "wird"), t)) {
    const e = a ? n : r;
    e.classList.remove("moduleFade"), e.offsetWidth, e.classList.add("moduleFade"), window.scrollTo({
      top: 0,
      behavior: "auto"
    })
  }
}

function showPage(e) {
  activeAyahAudio && stopAyahAudio(), activeFullSurahAudio && stopFullSurahAudio(), document.getElementById("wirdModule")?.classList.contains("hidden") && switchMainApp("wird", !1), document.querySelectorAll(".page").forEach(e => e.classList.add("hidden")), $(e).classList.remove("hidden"), document.querySelectorAll(".tabs button").forEach(e => e.classList.remove("active")), $("tab-" + e).classList.add("active"), "quran" === e && openQuranMushaf(), "quranAudio" === e && initFullQuranAudioSection(), window.scrollTo({
    top: 0,
    behavior: "auto"
  })
}

function syncAmountControls() {
  $("dailyAmountHome").value = String(dailyHizb), $("dailyAmountSettings").value = String(dailyHizb)
}

function changeDailyAmount(e) {
  dailyHizb = 2 === Number(e) ? 2 : 1, Zad.storage.setItem(AMOUNT_KEY, String(dailyHizb)), syncAmountControls(), flatAyahs.length ? (rebuildPortions(), showToday()) : updateSummaryLabels()
}

function getAutoPortion() {
  const start = Zad.storage.getItem(START_KEY) || localTodayISO();
  const days = daysBetween(start, localTodayISO());
  return portions.length ? (Number.isFinite(days) ? Math.max(0, days) : 0) % portions.length + 1 : 1;
}

function showToday() {
  portions.length && (currentPortion = getAutoPortion(), renderPortion(currentPortion))
}

function changePortion(e) {
  portions.length && (currentPortion += e, currentPortion < 1 && (currentPortion = portions.length), currentPortion > portions.length && (currentPortion = 1), renderPortion(currentPortion))
}

function renderPortion(index) {
  const arr = portions[index - 1] || [],
    first = arr[0],
    last = arr.at(-1),
    done = getDoneMap()[portionDateKey(index)];
  $('todayTitle').textContent = ZadI18n.t("quran.02cd57a646") + arabicDigits(index) + ZadI18n.t("quran.23c256bce3") + arabicDigits(portions.length);
  $('todayMeta').textContent = first && last ? first.surahName + ' ' + arabicDigits(first.numberInSurah) + ' — ' + last.surahName + ' ' + arabicDigits(last.numberInSurah) : '';
  const completed = Object.keys(getDoneMap()).filter(k => k.startsWith((Zad.storage.getItem(START_KEY) || localTodayISO()) + '_hizb_' + dailyHizb + '_')).length;
  const pct = Math.min(100, Math.round(completed / Math.max(1, portions.length) * 100));
  $('progressInner').style.width = pct + '%';
  $('progressText').textContent = ZadI18n.t("quran.057ff8cc58") + arabicDigits(completed);
  $('wirdContent').textContent = '';
  document.dispatchEvent(new CustomEvent('zad:wird-updated', {
    detail: {
      index,
      done
    }
  }));
}

function ayahDomId(e) {
  return `${e.surahNumber}_${e.numberInSurah}`
}

function stripRepeatedBismillah(e, t) {
  if (!e || 1 !== t.numberInSurah || 1 === t.surahNumber || 9 === t.surahNumber) return e;
  let a = String(e).replace(/^\s+/, "");
  if (a.startsWith("﷽")) return a.slice(1).replace(/^\s+/, "");
  const r = "بسماللهالرحمنالرحيم";
  let n = "",
    o = 0;
  for (const e of a)
    if (o += e.length, !/[\u064B-\u065F\u0670\u06D6-\u06ED\s]/u.test(e)) {
      if (n += e.replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي"), n === r) return a.slice(o).replace(/^[\u064B-\u065F\u0670\u06D6-\u06ED\s]+/u, "");
      if (!r.startsWith(n)) break
    } return a
}

function cleanQuranDisplayText(value) {
  return String(value ?? '');
}

function getSelectedAyahReciter() {
  try {
    const e = Zad.storage.getItem(AYAH_RECITER_KEY);
    if (e && DAILY_AYAH_RECITERS[e]) return e
  } catch (e) {}
  return "husary_mujawwad"
}

function getSelectedFullSurahReciter() {
  try {
    const e = Zad.storage.getItem(FULL_SURAH_RECITER_KEY);
    if (e && AYAH_RECITERS[e]) return e
  } catch (e) {}
  return "husary_mujawwad"
}

function renderAyahReciterOptions() {
  const e = getSelectedAyahReciter();
  return Object.entries(DAILY_AYAH_RECITERS).map(([t, a]) => `<option value="${t}"${t===e?" selected":""}>${escapeHTML(a.label)}</option>`).join("")
}

function renderFullSurahReciterOptions() {
  const e = getSelectedFullSurahReciter();
  return Object.entries(AYAH_RECITERS).map(([t, a]) => `<option value="${t}"${t===e?" selected":""}>${escapeHTML(a.label)}</option>`).join("")
}

function syncReciterSelectors(e) {
  document.querySelectorAll(".ayahReciterSelect").forEach(t => {
    t.value !== e && (t.value = e)
  })
}

function clearAyahAudioStatuses() {
  document.querySelectorAll(".ayahAudioStatus").forEach(e => {
    e.textContent = "", e.classList.remove("bad")
  })
}

function changeAyahReciter(e) {
  if (AYAH_RECITERS[e]) {
    try {
      Zad.storage.setItem(AYAH_RECITER_KEY, e)
    } catch (e) {}
    if (stopAyahAudio(), ayahAudioPlayer) try {
      ayahAudioPlayer.pause(), ayahAudioPlayer.removeAttribute("src"), ayahAudioPlayer.load()
    } catch (e) {}
    stopFullSurahAudio(), clearAyahAudioStatuses(), syncReciterSelectors(e)
  }
}

function changeFullSurahReciter(e) {
  if (!AYAH_RECITERS[e]) return;
  try {
    Zad.storage.setItem(FULL_SURAH_RECITER_KEY, e)
  } catch (e) {}
  stopAyahAudio(), stopFullSurahAudio();
  const t = $("fullSurahReciterSelect");
  t && t.value !== e && (t.value = e);
  const a = $("fullSurahAudioStatus");
  a && (a.textContent = ZadI18n.t("quran.76520796ef", {v0:(AYAH_RECITERS[e].label)}))
}

function padAyahAudioNumber(e) {
  return String(Number(e)).padStart(3, "0")
}

function getAyahAudioPlayer() {
  return ayahAudioPlayer || (ayahAudioPlayer = new Audio, ayahAudioPlayer.preload = "auto", ayahAudioPlayer.playsInline = !0, ayahAudioPlayer.addEventListener("timeupdate", () => {
    if (activeAyahAudio && activeAyahAudio.endSeconds && ayahAudioPlayer.currentTime >= activeAyahAudio.endSeconds) {
      const e = activeAyahAudio;
      stopAyahAudio(!1);
      const t = $(`audioStatus_${e.id}`);
      t && (t.textContent = ZadI18n.t("quran.314204311e"))
    }
  }), ayahAudioPlayer.addEventListener("ended", () => {
    if (!activeAyahAudio) return;
    const e = activeAyahAudio;
    stopAyahAudio(!1);
    const t = $(`audioStatus_${e.id}`);
    t && (t.textContent = ZadI18n.t("quran.314204311e"))
  }), ayahAudioPlayer)
}

function setAyahAudioStatus(e, t, a = !1) {
  const r = $(`audioStatus_${e}`);
  r && (r.textContent = t || "", r.classList.toggle("bad", Boolean(a)))
}

function resetAyahAudioButton(e) {
  if (!e) return;
  const t = $(`audioBtn_${e}`);
  t && (t.disabled = !1, t.classList.remove("playing"), t.textContent = ZadI18n.t("quran.f0d0f186c5"))
}

function stopAyahAudio(e = !0) {
  if (e && (ayahAudioRequestToken += 1), ayahAudioPlayer) try {
    ayahAudioPlayer.pause()
  } catch (e) {}
  activeAyahAudio && (resetAyahAudioButton(activeAyahAudio.id), activeAyahAudio = null)
}

function pbReadVarint(e, t) {
  let a = 0,
    r = 1,
    n = 0;
  for (; t.pos < e.length;) {
    const o = e[t.pos++];
    if (a += (127 & o) * r, !(128 & o)) return a;
    if (r *= 128, n += 1, n > 9) throw new Error(ZadI18n.t("quran.fcd0a4c209"))
  }
  throw new Error(ZadI18n.t("quran.31ab102314"))
}

function pbReadLengthBytes(e, t) {
  const a = pbReadVarint(e, t),
    r = t.pos,
    n = r + a;
  if (n > e.length) throw new Error(ZadI18n.t("quran.4e5124cc5b"));
  return t.pos = n, e.subarray(r, n)
}

function pbSkipField(e, t, a) {
  if (0 !== a)
    if (1 !== a) {
      if (2 === a) {
        const a = pbReadVarint(e, t);
        return void(t.pos += a)
      }
      if (5 !== a) throw new Error(ZadI18n.t("quran.48ae5d7113"));
      t.pos += 4
    } else t.pos += 8;
  else pbReadVarint(e, t)
}

function parseWordSegmentPb(e) {
  const t = {
    pos: 0
  };
  let a = null,
    r = null;
  for (; t.pos < e.length;) {
    const n = pbReadVarint(e, t),
      o = Math.floor(n / 8),
      i = n % 8;
    if (0 === i) {
      const n = pbReadVarint(e, t);
      3 === o ? a = n : 4 === o && (r = n)
    } else pbSkipField(e, t, i)
  }
  return {
    startMs: a,
    endMs: r
  }
}

function parseVerseSegmentsPb(e) {
  const t = {
    pos: 0
  };
  let a = null,
    r = null;
  for (; t.pos < e.length;) {
    const n = pbReadVarint(e, t),
      o = n % 8;
    if (1 === Math.floor(n / 8) && 2 === o) {
      const n = parseWordSegmentPb(pbReadLengthBytes(e, t));
      null !== n.startMs && (null === a || n.startMs < a) && (a = n.startMs), null !== n.endMs && (null === r || n.endMs > r) && (r = n.endMs)
    } else pbSkipField(e, t, o)
  }
  return null === a ? null : {
    startMs: a,
    endMs: null === r ? a : r
  }
}

function parseTimingMapEntryPb(e) {
  const t = {
    pos: 0
  };
  let a = "",
    r = null;
  const n = new TextDecoder("utf-8");
  for (; t.pos < e.length;) {
    const o = pbReadVarint(e, t),
      i = Math.floor(o / 8),
      u = o % 8;
    1 === i && 2 === u ? a = n.decode(pbReadLengthBytes(e, t)) : 2 === i && 2 === u ? r = parseVerseSegmentsPb(pbReadLengthBytes(e, t)) : pbSkipField(e, t, u)
  }
  return {
    key: a,
    range: r
  }
}

function parseSurahTimingPb(e) {
  const t = new Uint8Array(e),
    a = {
      pos: 0
    },
    r = {};
  for (; a.pos < t.length;) {
    const e = pbReadVarint(t, a),
      n = e % 8;
    if (1 === Math.floor(e / 8) && 2 === n) {
      const e = parseTimingMapEntryPb(pbReadLengthBytes(t, a));
      e.key && e.range && (r[e.key] = e.range)
    } else pbSkipField(t, a, n)
  }
  return r
}

function timedReciterUrls(e, t, a) {
  const r = padAyahAudioNumber(t),
    n = encodeURIComponent(e.folderName).replace(/%2F/gi, "/");
  return [`${TIMED_QURAN_AUDIO_BASE}/${e.slug}/${r}.${a}`, `${TIMED_QURAN_HF_BASE}/${n}/${r}/${r}.${a}`]
}
async function fetchTimedSurahRanges(e, t) {
  const a = AYAH_RECITERS[e],
    r = `${e}:${t}`;
  if (ayahTimingCache.has(r)) return ayahTimingCache.get(r);
  let n = null;
  for (const o of timedReciterUrls(a, t, "pb")) try {
    const e = await Zad.fetch(o, {
      cache: "force-cache"
    });
    if (!e.ok) throw new Error(`HTTP ${e.status}`);
    const t = parseSurahTimingPb(await e.arrayBuffer());
    if (!Object.keys(t).length) throw new Error(ZadI18n.t("quran.4c2407fe22"));
    return ayahTimingCache.set(r, t), t
  } catch (e) {
    n = e
  }
  throw n || new Error(ZadI18n.t("quran.b111f1b901"))
}

function getTimedVerseRange(e, t, a) {
  if (!e) return null;
  const r = Number(t),
    n = Number(a),
    o = [`${r}:${n}`, `${String(r).padStart(3,"0")}:${n}`, `${r}:${String(n).padStart(3,"0")}`, `${String(r).padStart(3,"0")}:${String(n).padStart(3,"0")}`];
  for (const t of o)
    if (e[t]) return e[t];
  const i = `:${n}`,
    u = `:${String(n).padStart(3,"0")}`;
  for (const [t, a] of Object.entries(e))
    if (t.endsWith(i) || t.endsWith(u)) {
      const e = Number(String(t).split(":")[0]);
      if (!Number.isFinite(e) || e === r) return a
    } return null
}

function waitForAudioSeek(e, t, a = 3500) {
  return new Promise(r => {
    let n = !1;
    const o = () => {
        n || (n = !0, clearTimeout(s), e.removeEventListener("seeked", u), e.removeEventListener("canplay", l), r())
      },
      i = () => Number.isFinite(e.currentTime) && Math.abs(e.currentTime - t) < 1.5,
      u = () => o(),
      l = () => {
        i() && o()
      },
      s = setTimeout(o, a);
    e.addEventListener("seeked", u, {
      once: !0
    }), e.addEventListener("canplay", l);
    try {
      "function" == typeof e.fastSeek ? e.fastSeek(t) : e.currentTime = t
    } catch (a) {
      try {
        e.currentTime = t
      } catch (e) {}
    }
    i() && setTimeout(o, 40)
  })
}

function waitForAudioMetadata(e, t = 15e3) {
  return e.readyState >= 1 ? Promise.resolve() : new Promise((a, r) => {
    let n = !1;
    const o = t => {
        n || (n = !0, clearTimeout(l), e.removeEventListener("loadedmetadata", i), e.removeEventListener("error", u), t ? r(t) : a())
      },
      i = () => o(),
      u = () => o(new Error(ZadI18n.t("quran.092b415a8c"))),
      l = setTimeout(() => o(new Error(ZadI18n.t("quran.bc81669af7"))), t);
    e.addEventListener("loadedmetadata", i, {
      once: !0
    }), e.addEventListener("error", u, {
      once: !0
    })
  })
}
async function playDirectAyahAudio(e, t, a, r) {
  const n = getAyahAudioPlayer(),
    o = `${EVERYAYAH_AUDIO_BASE}/${e.folder}/${padAyahAudioNumber(t)}${padAyahAudioNumber(a)}.mp3`;
  n.muted = !1, n.src = o, n.currentTime = 0, activeAyahAudio.endSeconds = null, r === ayahAudioRequestToken && await n.play()
}
async function loadSingleTimedAudioSource(e, t, a) {
  if (a !== ayahAudioRequestToken) return !1;
  e.pause();
  try {
    e.removeAttribute("src"), e.load()
  } catch (e) {}
  e.src = t, e.muted = !0, e.preload = "auto", e.load();
  const r = e.play().catch(() => null);
  return await waitForAudioMetadata(e, 15e3), await r, a === ayahAudioRequestToken
}
async function loadTimedAudioSource(e, t, a) {
  let r = null;
  for (const n of t) {
    if (a !== ayahAudioRequestToken) return !1;
    try {
      return await loadSingleTimedAudioSource(e, n, a), !0
    } catch (e) {
      r = e
    }
  }
  throw r || new Error(ZadI18n.t("quran.092b415a8c"))
}
async function playTimedAyahAudio(e, t, a, r, n) {
  const o = getAyahAudioPlayer(),
    i = [],
    u = t.fullSurahBase ? `${t.fullSurahBase}${padAyahAudioNumber(a)}.mp3` : "";
  u && i.push(u), timedReciterUrls(t, a, "opus").forEach(e => {
    e && !i.includes(e) && i.push(e)
  });
  let l = !1,
    s = Promise.resolve();
  try {
    o.pause();
    try {
      o.removeAttribute("src"), o.load()
    } catch (e) {}
    o.src = i[0], o.muted = !0, o.preload = "auto", o.load(), s = o.play().catch(() => null), l = !0
  } catch (e) {}
  const c = await fetchTimedSurahRanges(e, a);
  if (n !== ayahAudioRequestToken) return;
  const d = getTimedVerseRange(c, a, r);
  if (!d || !Number.isFinite(d.startMs)) throw new Error(ZadI18n.t("quran.98f353197e"));
  const h = getTimedVerseRange(c, a, r + 1),
    A = 1 === Number(r) ? 0 : Math.max(0, d.startMs / 1e3 - .08);
  let y;
  y = h && Number.isFinite(h.startMs) ? Math.max(Number(d.endMs || d.startMs) / 1e3 + .45, h.startMs / 1e3 + .04) : Number(d.endMs || d.startMs) / 1e3 + 2;
  let f = null;
  for (let t = 0; t < i.length; t++) {
    const a = i[t];
    if (n !== ayahAudioRequestToken) return;
    try {
      if (0 === t && l ? (await waitForAudioMetadata(o, 15e3), await s) : await loadSingleTimedAudioSource(o, a, n), n !== ayahAudioRequestToken) return;
      if (await waitForAudioSeek(o, A, 5e3), n !== ayahAudioRequestToken) return;
      return activeAyahAudio.endSeconds = Math.max(A + .45, y), o.muted = !1, void(o.paused && await o.play())
    } catch (e) {
      f = e;
      try {
        o.pause()
      } catch (e) {}
      l = !1
    }
  }
  throw f || new Error(ZadI18n.t("quran.441fdb3f49"))
}
async function playAyahAudio(e, t) {
  const a = `${e}_${t}`,
    r = $(`audioBtn_${a}`);
  if (!r) return;
  if (getAyahAudioPlayer(), activeAyahAudio && activeAyahAudio.id === a) return stopAyahAudio(), void setAyahAudioStatus(a, ZadI18n.t("quran.d317c75a24"));
  stopFullSurahAudio(), stopAyahAudio(!1);
  const n = ++ayahAudioRequestToken,
    o = getSelectedAyahReciter(),
    i = AYAH_RECITERS[o];
  activeAyahAudio = {
    id: a,
    reciterKey: o,
    endSeconds: null
  }, r.disabled = !1, r.classList.add("playing"), r.textContent = ZadI18n.t("quran.a57fb3ade5"), setAyahAudioStatus(a, ZadI18n.t("quran.ba0b80ad0c", {v0:(i.label)}));
  try {
    if ("timed-surah" === i.type ? await playTimedAyahAudio(o, i, e, t, n) : await playDirectAyahAudio(i, e, t, n), n !== ayahAudioRequestToken) return;
    r.disabled = !1, r.classList.add("playing"), r.textContent = ZadI18n.t("quran.a57fb3ade5"), setAyahAudioStatus(a, ZadI18n.t("quran.d299dad576", {v0:(i.label)}))
  } catch (e) {
    if (console.error(e), n !== ayahAudioRequestToken) return;
    stopAyahAudio(!1), setAyahAudioStatus(a, ZadI18n.t("quran.bde6afb945"), !1)
  }
}

function getFullSurahAudioPlayer() {
  return fullSurahAudioPlayer || (fullSurahAudioPlayer = new Audio, fullSurahAudioPlayer.preload = "auto", fullSurahAudioPlayer.playsInline = !0, fullSurahAudioPlayer.addEventListener("playing", () => {
    if (!activeFullSurahAudio) return;
    const e = activeFullSurahAudio,
      t = $(`fullSurahBtn_${e.surahNumber}`);
    t && (t.disabled = !1, t.classList.add("playing"), t.textContent = ZadI18n.t("quran.a57fb3ade5"));
    const a = AYAH_RECITERS[e.reciterKey],
      r = $("fullSurahAudioStatus");
    r && (r.textContent = ZadI18n.t("quran.0955394c7b", {v0:(e.surahName),v1:(a.label)}))
  }), fullSurahAudioPlayer.addEventListener("ended", () => {
    if (!activeFullSurahAudio) return;
    const e = activeFullSurahAudio;
    stopFullSurahAudio(!1);
    const t = $("fullSurahAudioStatus");
    t && (t.textContent = ZadI18n.t("quran.e65402a5b7", {v0:(e.surahName)}))
  }), fullSurahAudioPlayer.addEventListener("error", () => {
    activeFullSurahAudio && handleFullSurahAudioError(new Error(ZadI18n.t("quran.10161a6b0c")))
  }), fullSurahAudioPlayer)
}

function resetFullSurahButtons() {
  document.querySelectorAll(".quranAudioPlayBtn").forEach(e => {
    e.classList.remove("playing"), e.disabled = !1, e.textContent = ZadI18n.t("quran.209c789b95")
  })
}

function stopFullSurahAudio(e = !0) {
  if (e && (fullSurahAudioRequestToken += 1), fullSurahAudioPlayer) try {
    fullSurahAudioPlayer.pause(), fullSurahAudioPlayer.currentTime = 0, fullSurahAudioPlayer.removeAttribute("src"), fullSurahAudioPlayer.load()
  } catch (e) {}
  resetFullSurahButtons(), activeFullSurahAudio = null
}

function stopAllQuranAudio() {
  try {
    stopAyahAudio()
  } catch (e) {}
  try {
    stopFullSurahAudio()
  } catch (e) {}
}

function handleFullSurahAudioError() {
  stopFullSurahAudio(false);
  const status = $('fullSurahAudioStatus');
  if (status) status.textContent = ZadI18n.t("quran.7b8befd816");
}

function fullSurahFileUrl(e, t) {
  const a = String(e.fullSurahBase || "");
  return a ? `${a}${padAyahAudioNumber(t)}.mp3` : ""
}
async function playFullSurah(e) {
  if (!quran || !Array.isArray(quran.surahs)) return;
  const t = quran.surahs.find(t => Number(t.number) === Number(e));
  if (!t) return;
  if (activeFullSurahAudio && activeFullSurahAudio.surahNumber === t.number) {
    stopFullSurahAudio();
    const e = $("fullSurahAudioStatus");
    return void(e && (e.textContent = ZadI18n.t("quran.d317c75a24")))
  }
  stopAyahAudio(), stopFullSurahAudio(!1);
  const a = ++fullSurahAudioRequestToken,
    r = getSelectedFullSurahReciter(),
    n = AYAH_RECITERS[r],
    o = fullSurahFileUrl(n, t.number),
    i = $(`fullSurahBtn_${t.number}`);
  if (!o) return;
  activeFullSurahAudio = {
    token: a,
    surahNumber: t.number,
    surahName: t.name,
    reciterKey: r
  }, resetFullSurahButtons(), i && (i.classList.add("playing"), i.textContent = ZadI18n.t("quran.a57fb3ade5"));
  const u = $("fullSurahAudioStatus");
  u && (u.textContent = ZadI18n.t("quran.b4f76b4b77", {v0:(t.name),v1:(n.label)}));
  try {
    const e = getFullSurahAudioPlayer();
    if (e.pause(), e.src = o, e.currentTime = 0, e.preload = "auto", e.load(), await e.play(), a !== fullSurahAudioRequestToken) return
  } catch (e) {
    if (a !== fullSurahAudioRequestToken) return;
    handleFullSurahAudioError(e)
  }
}

function renderFullQuranAudioSurahs() {
  const e = $("quranAudioSurahList");
  e && quran && Array.isArray(quran.surahs) && (e.innerHTML = quran.surahs.map(e => ("\n    <div class=\"quranAudioSurah\">\n      <div>\n        <div class=\"quranAudioSurahName\">" + (arabicDigits(e.number)) + " — " + (escapeHTML(e.name)) + "</div>\n        <div class=\"quranAudioSurahMeta\">" + ZadI18n.html("quran.aecf733746",{v0:(arabicDigits(e.ayahs.length))}) + "</div>\n      </div>\n      <button id=\"fullSurahBtn_" + (e.number) + "\" class=\"secondary quranAudioPlayBtn\" type=\"button\" onclick=\"playFullSurah(" + (e.number) + ")\">" + ZadI18n.html("quran.209c789b95") + "</button>\n    </div>\n  ")).join(""))
}

function initFullQuranAudioSection() {
  const e = $("fullSurahReciterSelect");
  if (e && (e.options.length || (e.innerHTML = renderFullSurahReciterOptions()), e.value = getSelectedFullSurahReciter()), !fullQuranAudioListRendered && quran && Array.isArray(quran.surahs)) renderFullQuranAudioSurahs(), fullQuranAudioListRendered = !0;
  else if (!fullQuranAudioListRendered) {
    const e = $("fullSurahAudioStatus");
    e && (e.textContent = ZadI18n.t("quran.b77f104703"))
  }
}

function renderAyahList(e) {
  let t = "",
    a = null;
  for (const r of e) {
    r.surahNumber !== a && (t += `<div class="surahTitle">${escapeHTML(r.surahName)}</div>`, 1 !== r.surahNumber && 9 !== r.surahNumber && (t += ("<div class=\"bismillah\">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>")), a = r.surahNumber);
    const e = ayahDomId(r);
    t += ("\n      <article class=\"ayahBlock\">\n        <div class=\"ayahMeta\">" + ZadI18n.html("quran.62276a88a5",{v0:(escapeHTML(r.surahName)),v1:(arabicDigits(r.numberInSurah))}) + "</div>\n        <div class=\"ayahText\"><span class=\"ayahSourceText\">" + (escapeHTML(cleanQuranDisplayText(r.text))) + "</span> <span class=\"ayahNumber\">﴿" + (arabicDigits(r.numberInSurah)) + "﴾</span></div>\n        <div class=\"ayahTools row\">\n          <button class=\"secondary\" id=\"tafsirBtn_" + (e) + "\" onclick=\"toggleTafsir(" + (r.surahNumber) + "," + (r.numberInSurah) + ")\">" + ZadI18n.html("quran.c576b23227") + "</button>\n          <button class=\"secondary ayahAudioBtn\" id=\"audioBtn_" + (e) + "\" onclick=\"playAyahAudio(" + (r.surahNumber) + "," + (r.numberInSurah) + ")\">" + ZadI18n.html("quran.f0d0f186c5") + "</button>\n          <select class=\"ayahReciterSelect\" aria-label=\"" + ZadI18n.html("quran-reader.30c636a4e4") + "\" onchange=\"changeAyahReciter(this.value)\">" + (renderAyahReciterOptions()) + "</select>\n          <div id=\"audioStatus_" + (e) + "\" class=\"ayahAudioStatus\" aria-live=\"polite\"></div>\n        </div>\n        <div id=\"tafsir_" + (e) + "\" class=\"tafsirBox hidden\" aria-live=\"polite\"></div>\n      </article>")
  }
  return t || ("<div class=\"status\">" + ZadI18n.html("quran.3c1dfff402") + "</div>")
}

function renderSurah(number) {
  const target = $('surahContent');
  const surah = quran?.surahs?.find(s => s.number === number);
  if (target && surah) target.innerHTML = renderAyahList(surah.ayahs.map(a => ({
    ...a,
    surahNumber: surah.number,
    surahName: surah.name
  })));
}

function searchQuran() {
  const e = normalizeArabic($("searchInput").value.trim());
  if (e.length < 2) return void($("searchResults").innerHTML = ("<div class=\"status\">" + ZadI18n.html("quran.e51a0f5f31") + "</div>"));
  const t = flatAyahs.filter(t => normalizeArabic(t.text).includes(e)).slice(0, 80);
  $("searchResults").innerHTML = t.length ? renderAyahList(t) : ("<div class=\"status\">" + ZadI18n.html("quran.c19b06bfe3") + "</div>")
}
async function toggleTafsir(e, t) {
  const a = `${e}_${t}`,
    r = $(`tafsir_${a}`),
    n = $(`tafsirBtn_${a}`);
  if (!r || !n) return;
  if (!r.classList.contains("hidden")) return r.classList.add("hidden"), void(n.textContent = ZadI18n.t("quran.c576b23227"));
  if (r.classList.remove("hidden"), n.textContent = ZadI18n.t("quran.81c16e3588"), "1" === r.dataset.loaded) return;
  r.textContent = ZadI18n.t("quran.0831089d25"), n.disabled = !0;
  const o = `${TAFSIR_CACHE_PREFIX}${e}_${t}`;
  try {
    const a = Zad.storage.getItem(o);
    if (a) return r.textContent = a, void(r.dataset.loaded = "1");
    const n = await Zad.fetch(`${TAFSIR_API_BASE}${e}/${t}`, {
      cache: "force-cache"
    });
    if (!n.ok) throw new Error(ZadI18n.t("quran.7681a50093", {v0:(n.status)}));
    const i = await n.json(),
      u = i && i.result ? i.result : i,
      l = u && "string" == typeof u.translation ? u.translation.trim() : "";
    if (!l) throw new Error(ZadI18n.t("quran.2884dd18f0"));
    const s = u && Array.isArray(u.footnotes) ? u.footnotes.filter(Boolean).map(e => "string" == typeof e ? e : e.text || e.content || "").filter(Boolean) : [],
      c = s.length ? ZadI18n.t("quran.f6d27c669e", {v0:(l),v1:(s.join("\n"))}) : l;
    r.textContent = c, r.dataset.loaded = "1";
    try {
      Zad.storage.setItem(o, c)
    } catch (e) {}
  } catch (e) {
    console.error(e), r.innerHTML = ("<span class=\"bad\">" + ZadI18n.html("quran.fbd80e923e") + "</span>"), r.dataset.loaded = "0"
  } finally {
    n.disabled = !1
  }
}

function getQuranPdfUrl() {
  return new URL('quran.pdf', location.href).href;
}

function openQuranMushaf() {
  location.href = 'reader.html?book=quran';
}

function openQuranMushafExternal() {
  try {
    window.open(getQuranPdfUrl(), "_blank", "noopener,noreferrer") || alert(ZadI18n.t("quran.ca26257d05"))
  } catch (e) {
    console.error(e), alert(ZadI18n.t("quran.083c173e9d"))
  }
}

function saveQuranPdf() {
  try {
    const e = document.createElement("a");
    e.href = getQuranPdfUrl(), e.download = "القرآن الكريم.pdf", document.body.appendChild(e), e.click(), e.remove()
  } catch (e) {
    console.error(e), alert(ZadI18n.t("quran.83eb17f592"))
  }
}

function getBookPdfUrl() {
  return new URL('book.pdf', location.href).href;
}

function openBook() {
  location.href = 'reader.html?book=usul';
}

function closeBook() {
  const e = $("bookViewerCard"),
    t = $("bookViewer");
  t && t.removeAttribute("src"), e && e.classList.add("hidden")
}

function openBookExternal() {
  try {
    window.open(getBookPdfUrl(), "_blank", "noopener,noreferrer") || alert(ZadI18n.t("quran.8b94506a2f"))
  } catch (e) {
    console.error(e), alert(ZadI18n.t("quran.1ab192d90b"))
  }
}

function saveBookPdf() {
  try {
    const e = document.createElement("a");
    e.href = getBookPdfUrl(), e.download = BOOK_FILE_NAME, document.body.appendChild(e), e.click(), e.remove()
  } catch (e) {
    console.error(e), alert(ZadI18n.t("quran.3122325352"))
  }
}

function saveSettings() {
  const start = $('startDate').value || localTodayISO();
  Zad.storage.setItem(START_KEY, start);
  Zad.storage.setItem(AMOUNT_KEY, String(dailyHizb));
  showToday();
  Zad.toast(ZadI18n.t("quran.58d1f7e44b"));
}

function resetTodayStart() {
  $("startDate").value = localTodayISO(), saveSettings()
}

function portionDateKey(e) {
  return `${Zad.storage.getItem(START_KEY)||localTodayISO()}_hizb_${dailyHizb}_portion_${e}`
}

function getDoneMap() {
  return Zad.readJSON(DONE_KEY, {});
}

function markDone() {
  const e = getDoneMap();
  e[portionDateKey(currentPortion)] = !0, Zad.storage.setItem(DONE_KEY, JSON.stringify(e)), renderPortion(currentPortion)
}

function clearProgress() {
  confirm(ZadI18n.t("quran.26d2f802ec")) && (Zad.storage.removeItem(DONE_KEY), renderPortion(currentPortion))
}

function clearQuranCache() {
  Zad.storage.removeItem(QURAN_STORE_KEY);
  quran = null;
  flatAyahs = [];
  portions = [];
  init().then(() => window.v22InitQuranReader?.());
}
window.stopAllQuranAudio = stopAllQuranAudio, window.stopAyahAudio = stopAyahAudio, window.stopFullSurahAudio = stopFullSurahAudio, window.initFullQuranAudioSection = initFullQuranAudioSection, document.addEventListener("click", () => {
  const e = $("palettePanel");
  e && e.classList.add("hidden")
});
let __zadWirdInitStarted = !1;
window.zadEnsureWirdInit = function() {
  __zadWirdInitStarted || (__zadWirdInitStarted = !0, init())
}

document.addEventListener('click', event => {
  if (event.target.closest('[data-quran-retry]')) init().then(() => window.v22InitQuranReader?.());
});

// These summary labels are generated after Quran data loads, so refresh their render site.
document.addEventListener('zad:language', () => {
  updateSummaryLabels();
  if(fullQuranAudioListRendered)renderFullQuranAudioSurahs();
  const audioStatus=document.getElementById('fullSurahAudioStatus');
  if(audioStatus)audioStatus.textContent=ZadI18n.t('quran-reader.0c7775c313');
});
