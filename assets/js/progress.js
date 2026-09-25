! function() {
  "use strict";
  const t = t => document.getElementById(t),
    e = () => document.querySelector(".wrap"),
    n = "zad_points_v1",
    o = "zad_points_ledger_v1";

  function r() {
    const t = new Date,
      e = t => String(t).padStart(2, "0");
    return `${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`
  }

  function i(t) {
    try {
      return Math.max(0, Number(Zad.storage.getItem(t) || 0) || 0)
    } catch (t) {
      return 0
    }
  }

  function a(t) {
    try {
      return Number(t).toLocaleString(ZadI18n.locale)
    } catch (e) {
      return String(t)
    }
  }

  function d() {
    const e = i(n),
      o = Math.floor(e / 100) + 1;
    t("zadPointsValue") && (t("zadPointsValue").textContent = a(e)), t("zadPointsLevel") && (t("zadPointsLevel").textContent = ZadI18n.t("account-sync.4a756ec14d", {v0:(a(o))}))
  }

  function c(t) {
    "wird" === t ? window.zadEnsureWirdInit?.() : "zad" === t ? window.zadEnsureZadInit?.() : "heart" === t ? window.zadEnsureHeartInit?.() : "hadith" === t && window.zadEnsureHadithInit?.()
  }
  window.zadGetPoints = function() {
    return i(n)
  }, window.zadAddPoints = function(t, e) {
    if (!(t = Math.max(0, Number(t) || 0))) return !1;
    const r = function() {
      try {
        return Zad.readJSON(o, {}) || {}
      } catch (t) {
        return {}
      }
    }();
    if (e && r[e]) return !1;
    const a = i(n) + t;
    try {
      Zad.storage.setItem(n, String(a)), e && (r[e] = {
        points: t,
        at: (new Date).toISOString()
      }, Zad.storage.setItem(o, JSON.stringify(r)))
    } catch (t) {}
    return d(), !0
  }, window.showZadMainHub = function() {
    window.globalCloseSettings?.();
    const n = e();
    if (!n) return;
    n.classList.add("zadHubActive");
    const o = t("globalHomeToggle");
    o && (o.classList.add("active"), o.setAttribute("aria-current", "page")), Object.values({
      wird: t("wirdModule"),
      zad: t("zadModule"),
      heart: t("heartModule"),
      hadith: t("hadithModule")
    }).forEach(t => t?.classList.add("hidden"));
    const r = document.querySelector("nav.tabs");
    r && r.classList.add("hidden"), d(), window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    })
  }, window.enterZadSection = function(n) {
    ["wird", "zad", "heart", "hadith"].includes(n) || (n = "wird"), c(n);
    const o = e();
    o && o.classList.remove("zadHubActive");
    const r = t("globalHomeToggle");
    r && (r.classList.remove("active"), r.removeAttribute("aria-current")), "function" == typeof window.switchMainApp && window.switchMainApp(n, !1), window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto"
    })
  };
  const s = window.switchMainApp;
  "function" == typeof s && (window.switchMainApp = function(n, o = !0) {
    c(n);
    const r = e();
    r && r.classList.remove("zadHubActive");
    const i = t("globalHomeToggle");
    return i && (i.classList.remove("active"), i.removeAttribute("aria-current")), s.apply(this, arguments)
  });
  const u = window.markDone,
    l = "zad_wird_daily_choice_v2";

  function w() {
    return `${String(window.__zadActiveUserId||"local")}:${r()}`
  }

  function g(e, n = !0) {
    const o = 2 === Number(e) ? 2 : 1 === Number(e) ? 1 : 0,
      r = t("zadWirdChoiceOne"),
      i = t("zadWirdChoiceTwo"),
      a = t("zadWirdChoiceStatus");
    if (r && (r.classList.toggle("zadWirdChoiceSelected", 1 === o), r.disabled = o > 0, r.setAttribute("aria-pressed", String(1 === o)), r.innerHTML = 1 === o ? ("" + ZadI18n.html("progress.e1a6387bc4") + " <strong>+" + ZadI18n.number(10) + "</strong>") : ("" + ZadI18n.html("progress.fc74b4526e") + " <strong>+" + ZadI18n.number(10) + "</strong>")), i && (i.classList.toggle("zadWirdChoiceSelected", 2 === o), i.disabled = o > 0, i.setAttribute("aria-pressed", String(2 === o)), i.innerHTML = 2 === o ? ("" + ZadI18n.html("progress.523ccfa527") + " <strong>+" + ZadI18n.number(20) + "</strong>") : ("" + ZadI18n.html("progress.83786764c4") + " <strong>+" + ZadI18n.number(20) + "</strong>")), a && (a.textContent = 1 === o ? ZadI18n.t("progress.22b5b9b9a8") : 2 === o ? ZadI18n.t("progress.ca1eec3854") : ZadI18n.t("progress.15fd0e89d1")), n) try {
      const t = Zad.readJSON(l, {}) || {},
        e = w();
      o ? t[e] = o : delete t[e], Zad.storage.setItem(l, JSON.stringify(t))
    } catch (t) {}
    return o
  }
  window.zadSetWirdChoiceFromServer = function(t) {
    return g(t, !0)
  }, "function" == typeof u && (window.markDone = function() {
    return u.apply(this, arguments)
  }), window.zadCompleteWirdForPoints = async function(t) {
    const e = 2 === Number(t) ? 2 : 1,
      n = window.zadClaimWirdChoiceServer,
      o = document.getElementById("zadWirdChoiceOne"),
      r = document.getElementById("zadWirdChoiceTwo"),
      i = document.getElementById("zadWirdChoiceStatus");
    if ("function" != typeof n) return i && (i.textContent = ZadI18n.t("progress.acb0c8e851")), !1;
    o && (o.disabled = !0), r && (r.disabled = !0), i && (i.textContent = ZadI18n.t("progress.f067b6fd66"));
    try {
      const t = Number(await n(e)),
        o = 2 === t ? 2 : 1 === t ? 1 : 0;
      if (!o) throw new Error("wird_choice_not_confirmed");
      return g(o), o === e && "function" == typeof u && u.call(window), o === e
    } catch (t) {
      return g(0), i && (i.textContent = ZadI18n.t("progress.324acf2aef")), !1
    }
  };
  const h = "zad_azkar_points_done_v1";
  window.zadWasAzkarClaimed = function(t) {
    try {
      return !0 === Zad.readJSON(h, {})?.[`${String(t)}:${r()}`]
    } catch (t) {
      return !1
    }
  }, window.zadClaimAzkarPoints = function(t, e) {
    if ("morning" !== t && "evening" !== t) return !1;
    const n = `azkar-${t}:${r()}`,
      o = window.zadAddPoints?.(10, n);
    if (o) {
      try {
        const e = Zad.readJSON(h, {}) || {};
        e[`${t}:${r()}`] = !0, Zad.storage.setItem(h, JSON.stringify(e))
      } catch (t) {}
      e && (e.innerHTML = ("" + ZadI18n.html("progress.31ba5e00fd",{v0:("morning"===t?ZadI18n.t("heart-hadith.e40f0fc849"):ZadI18n.t("heart-hadith.0e2e265a8e"))}) + " <strong>+" + ZadI18n.number(10) + "</strong>"))
    }
    return !!o
  };
  document.addEventListener('zad:language',f);
  const m = window.heartCompleteDaily;

  function f() {
    d(), g(function() {
      try {
        const t = Zad.readJSON(l, {}) || {};
        return 2 === Number(t[w()]) ? 2 : 1 === Number(t[w()]) ? 1 : 0
      } catch (t) {
        return 0
      }
    }(), !1)
  }
  "function" == typeof m && (window.heartCompleteDaily = function() {
    const t = m.apply(this, arguments);
    return window.zadAddPoints?.(10, `heart-daily:${r()}`), t
  }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", f, {
    once: !0
  }) : f()
}()

