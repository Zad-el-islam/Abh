! function() {
  "use strict";
  const t = t => document.getElementById(t),
    e = t => {
      try {
        return Number(t).toLocaleString(ZadI18n.locale)
      } catch (e) {
        return String(t)
      }
    };

  function a(e) {
    try {
      window.zadClosePointsPanel?.()
    } catch (t) {}
    try {
      window.globalCloseSettings?.()
    } catch (t) {}
    try {
      window.zadCloseAuth?.()
    } catch (t) {}
    for (const a of ["zadLeaderboardOverlay", "zadStatsOverlay"]) a !== e && (t(a)?.classList.remove("open"), t(a)?.setAttribute("aria-hidden", "true"));
    const a = t(e);
    a && (a.classList.add("open"), a.setAttribute("aria-hidden", "false"), a.scrollTop = 0, document.documentElement.style.overflow = "hidden")
  }

  function n(e) {
    const a = t(e);
    a && (a.classList.remove("open"), a.setAttribute("aria-hidden", "true"), document.documentElement.style.overflow = "")
  }
  window.zadOpenLeaderboard = () => a("zadLeaderboardOverlay"), window.zadCloseLeaderboard = () => n("zadLeaderboardOverlay"), window.zadOpenStats = () => {
    (function() {
      const a = Math.max(0, Number(Zad.storage.getItem("zad_points_v1") || 0) || 0),
        n = Math.floor(a / 100) + 1,
        o = function() {
          let t = [];
          try {
            t = Zad.readJSON("zad_points_visit_days_v1", []) || []
          } catch (t) {}
          const e = new Set(Array.isArray(t) ? t : []),
            a = t => `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;
          let n = 0,
            o = new Date;
          for (o.setHours(0, 0, 0, 0), e.has(a(o)) || o.setDate(o.getDate() - 1); e.has(a(o));) n++, o.setDate(o.getDate() - 1);
          return n
        }(),
        d = function(t, e) {
          let a = 0;
          return t >= 100 && a++, t >= 300 && a++, t >= 700 && a++, t >= 1500 && a++, t >= 3e3 && a++, t >= 5e3 && a++, e >= 7 && a++, e >= 30 && a++, a
        }(a, o);
      t("zadStatsPoints") && (t("zadStatsPoints").textContent = e(a)), t("zadStatsLevel") && (t("zadStatsLevel").textContent = e(n)), t("zadStatsStreak") && (t("zadStatsStreak").textContent = e(o) + ZadI18n.t("account-panel.a5d6bac583")), t("zadStatsBadges") && (t("zadStatsBadges").textContent = e(d))
    })(), a("zadStatsOverlay")
  }, window.zadCloseStats = () => n("zadStatsOverlay"), document.addEventListener("keydown", e => {
    "Escape" === e.key && (t("zadLeaderboardOverlay")?.classList.contains("open") && window.zadCloseLeaderboard(), t("zadStatsOverlay")?.classList.contains("open") && window.zadCloseStats())
  })
}()

