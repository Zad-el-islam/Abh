! function() {
  "use strict";
  const e = e => document.getElementById(e);
  let t = null,
    a = null,
    n = "home";

  function d(e) {
    try {
      return Number(e).toLocaleString(ZadI18n.locale)
    } catch (t) {
      return String(e)
    }
  }

  function o() {
    const t = Math.max(0, Number(Zad.storage.getItem("zad_points_v1") || 0) || 0),
      a = Math.floor(t / 100) + 1,
      n = function() {
        let e = [];
        try {
          e = Zad.readJSON("zad_points_visit_days_v1", []) || []
        } catch (e) {}
        const t = new Set(Array.isArray(e) ? e : []),
          a = e => `${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;
        let n = 0,
          d = new Date;
        for (d.setHours(0, 0, 0, 0), t.has(a(d)) || d.setDate(d.getDate() - 1); t.has(a(d));) n++, d.setDate(d.getDate() - 1);
        return n
      }(),
      o = function(e, t) {
        let a = 0;
        return e >= 100 && a++, e >= 300 && a++, e >= 700 && a++, e >= 1500 && a++, e >= 3e3 && a++, e >= 5e3 && a++, t >= 7 && a++, t >= 30 && a++, a
      }(t, n);
    e("zadPanelStatsPoints") && (e("zadPanelStatsPoints").textContent = d(t)), e("zadPanelStatsLevel") && (e("zadPanelStatsLevel").textContent = d(a)), e("zadPanelStatsStreak") && (e("zadPanelStatsStreak").textContent = d(n) + ZadI18n.t("account-panel.a5d6bac583")), e("zadPanelStatsBadges") && (e("zadPanelStatsBadges").textContent = d(o))
  }

  function l(t = "", a = "") {
    const n = e("zadPanelAuthMessage");
    n && (n.textContent = t, n.className = "zadPanelAuthMessage" + (a ? " " + a : ""))
  }

  let lastConnectionStatus=null;
  function s(t, a = !1) {
    lastConnectionStatus={key:Object.keys(ZadI18nCatalog).find(k=>ZadI18nCatalog[k][ZadI18n.locale]===t),ready:a};
    const n = e("zadPanelAuthStatus");
    n && (n.querySelector("span").textContent = t, n.classList.toggle("ready", a))
  }

  function i() {
    e("zadPanelLoggedChoice")?.classList.remove("hidden"), e("zadPanelAccountSettingsScreen")?.classList.add("hidden"), "auth" === n && (e("zadMyPanelHeadSmall") && (e("zadMyPanelHeadSmall").textContent = ZadI18n.t("settings.66dcee1f46")), e("zadMyPanelHeadTitle") && (e("zadMyPanelHeadTitle").textContent = ZadI18n.t("account-panel.3f3089b756")))
  }

  function c(t) {
    const n = e("zadMyPanelToggle"),
      d = Boolean(a);
    a = t || null, t ? (n?.classList.add("online"), e("zadPanelGuest")?.classList.add("hidden"), e("zadPanelLogged")?.classList.remove("hidden"), d || i(), e("zadPanelUserName") && (e("zadPanelUserName").textContent = t.user_metadata?.username || t.user_metadata?.display_name || ZadI18n.t("access.58fffe6bec"))) : (n?.classList.remove("online"), e("zadPanelGuest")?.classList.remove("hidden"), e("zadPanelLogged")?.classList.add("hidden"), e("zadPanelAccountSettingsScreen")?.classList.add("hidden"), window.zadShowAuthScreen?.("choice", !0), e("zadPanelUserName") && (e("zadPanelUserName").textContent = "—"))
  }
  document.addEventListener('zad:language',()=>{if(lastConnectionStatus?.key)s(ZadI18n.t(lastConnectionStatus.key),lastConnectionStatus.ready);if(e('zadMyPanelOverlay')?.classList.contains('open'))window.zadMyPanelShow(n);});
  async function r() {
    try {
      if (t = window.zadSupabase || null, !t || !t.auth) return void s(ZadI18n.t("account-panel.7336ac1ffd"), !1);
      const {
        data: e,
        error: a
      } = await t.auth.getSession();
      if (a) throw a;
      c(e?.session?.user || null), s(ZadI18n.t("account-panel.bc812898d7"), !0), t.auth.onAuthStateChange(function(e, t) {
        c(t?.user || null)
      })
    } catch (e) {
      console.error("panel auth init error", e), s(ZadI18n.t("account-panel.87d66a6fbc"), !1)
    }
  }
  window.zadToggleMyPanel = function(t) {
    t?.stopPropagation?.();
    const a = e("zadMyPanelOverlay");
    a && (a.classList.add("open"), a.setAttribute("aria-hidden", "false"), document.documentElement.style.overflow = "hidden", window.zadMyPanelShow("home"))
  }, window.zadCloseMyPanelPage = function() {
    const t = e("zadMyPanelOverlay");
    t && (t.classList.remove("open"), t.setAttribute("aria-hidden", "true"), document.documentElement.style.overflow = "", window.zadMyPanelShow("home"))
  }, window.zadMyPanelShow = function(t) {
    const d = {
        home: e("zadMyPanelViewHome"),
        auth: e("zadMyPanelViewAuth"),
        leaderboard: e("zadMyPanelViewLeaderboard"),
        stats: e("zadMyPanelViewStats")
      },
      l = Object.prototype.hasOwnProperty.call(d, t) ? t : "home";
    n = l, Object.values(d).forEach(e => e?.classList.add("hidden"));
    const s = {
      home: [ZadI18n.t("account-panel.4d582e9ec6"), ZadI18n.t("account-panel.b7a28bfccf")],
      auth: [ZadI18n.t("settings.66dcee1f46"), ZadI18n.t("account-panel.3f3089b756")],
      leaderboard: [ZadI18n.t("account-panel.420ad59fd5"), ZadI18n.t("account-panel.96ba5e8c4c")],
      stats: [ZadI18n.t("account-panel.628efd7434"), ZadI18n.t("account-panel.b618dd87ad")]
    };
    d[l]?.classList.remove("hidden"), e("zadMyPanelHeadSmall").textContent = s[l][0], e("zadMyPanelHeadTitle").textContent = s[l][1], e("zadMyPanelBackBtn").classList.toggle("hidden", "home" === l), "auth" === l && (window.zadShowAuthScreen?.("choice", !0), a && i()), "stats" === l && o()
  }, window.zadMyPanelGoBack = function() {
    if ("auth" === n) {
      const t = e("zadPanelAccountSettingsScreen");
      if (t && !t.classList.contains("hidden")) return i(), void l("");
      const n = e("zadPanelAuthChoice");
      if (!a && n?.classList.contains("hidden")) return window.zadShowAuthScreen?.("choice", !0), l(""), e("zadMyPanelHeadSmall") && (e("zadMyPanelHeadSmall").textContent = ZadI18n.t("settings.66dcee1f46")), void(e("zadMyPanelHeadTitle") && (e("zadMyPanelHeadTitle").textContent = ZadI18n.t("account-panel.3f3089b756")))
    }
    window.zadMyPanelShow("home")
  }, window.zadOpenPanelAccountSettings = function() {
    a ? (e("zadPanelLoggedChoice")?.classList.add("hidden"), e("zadPanelAccountSettingsScreen")?.classList.remove("hidden"), e("zadMyPanelHeadSmall") && (e("zadMyPanelHeadSmall").textContent = ZadI18n.t("settings.66dcee1f46")), e("zadMyPanelHeadTitle") && (e("zadMyPanelHeadTitle").textContent = ZadI18n.t("account-panel.2fc160909f")), e("zadMyPanelBackBtn")?.classList.remove("hidden"), l("")) : l(ZadI18n.t("account-panel.1085a43fd2"), "bad")
  }, window.zadPanelSignIn = function() {
    return window.zadPanelAuthSubmit?.()
  }, window.zadPanelSignUp = function() {
    window.zadSetAuthMode?.("signup", !0)
  }, window.zadPanelSignOut = async function() {
    if (!t || !t.auth) return;
    l(ZadI18n.t("account-panel.36cedaea09"));
    const {
      error: e
    } = await t.auth.signOut({
      scope: "local"
    });
    if (e) return l(Zad.errorText(e), "bad");
    c(null), l(ZadI18n.t("account-panel.95e69d3acc"), "ok")
  }, document.addEventListener("keydown", function(t) {
    "Escape" === t.key && e("zadMyPanelOverlay")?.classList.contains("open") && window.zadCloseMyPanelPage()
  }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", r, {
    once: !0
  }) : r()
}()

