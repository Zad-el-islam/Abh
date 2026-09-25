! function() {
  "use strict";
  const t = t => document.getElementById(t),
    e = "zad_points_v1",
    n = "function" == typeof window.zadAddPoints ? window.zadAddPoints.bind(window) : null,
    a = "function" == typeof window.zadRefreshPoints ? window.zadRefreshPoints.bind(window) : null,
    r = "function" == typeof window.zadGetPoints ? window.zadGetPoints.bind(window) : null,
    o = "function" == typeof window.zadMyPanelShow ? window.zadMyPanelShow.bind(window) : null,
    i = "function" == typeof window.zadOpenLeaderboard ? window.zadOpenLeaderboard.bind(window) : null,
    s = "function" == typeof window.zadOpenStats ? window.zadOpenStats.bind(window) : null,
    d = "function" == typeof window.showZadMainHub ? window.showZadMainHub.bind(window) : null;
  let c = null,
    l = null,
    u = "",
    m = !1,
    _ = null,
    w = [],
    f = Promise.resolve(),
    y = [],
    h = "points",
    p = !1,
    z = "",
    S = null;
  const v = t => {
      try {
        return Number(t).toLocaleString(ZadI18n.locale)
      } catch (e) {
        return String(t)
      }
    },
    b = t => Math.max(0, Number(t) || 0);

  function g(t, e) {
    const n = String(e || "");
    return n.startsWith("wird-done:") ? n.endsWith(":2") ? "daily_wird_2" : "daily_wird_1" : n.startsWith("heart-daily:") ? "daily_zad" : n.startsWith("azkar-morning:") ? "daily_azkar_morning" : n.startsWith("azkar-evening:") ? "daily_azkar_evening" : ""
  }

  function P(t, e = 12e3) {
    return Promise.race([t, new Promise((t, n) => setTimeout(() => n(new Error("request_timeout")), e))])
  }

  function L(t) {
    return {
      total_points: b(t?.total_points),
      level: Math.max(1, Number(t?.level) || 1),
      current_streak: b(t?.current_streak),
      lifetime_points: b(t?.lifetime_points),
      best_streak: b(t?.best_streak),
      season_activity: b(t?.season_activity),
      season_number: Math.max(1, Number(t?.season_number) || 1),
      season_starts_on: String(t?.season_starts_on || t?.starts_on || ""),
      season_ends_on: String(t?.season_ends_on || t?.ends_on || "")
    }
  }

  function C(t) {
    const e = String(t || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return e ? new Date(Number(e[1]), Number(e[2]) - 1, Number(e[3]), 12, 0, 0, 0) : null
  }

  function E() {
    O().forEach(t => {
      if (t.querySelector(".zadSeasonBanner")) return;
      const e = document.createElement("div");
      e.className = "zadSeasonBanner", e.innerHTML = ("<div><small>" + ZadI18n.html("account-sync.34979d28c3") + "</small><strong>" + ZadI18n.html("account-sync.a5ec04652a") + "</strong></div><span>" + ZadI18n.html("account-sync.a3e7d85b06") + "</span>");
      const n = t.querySelector(".zadLeaderboardTabs");
      n?.parentNode ? n.parentNode.insertBefore(e, n) : t.prepend(e)
    });
    const e = t("zadPointsPanel");
    if (e && !e.querySelector(".zadSeasonMini")) {
      const t = document.createElement("div");
      t.className = "zadSeasonMini", t.innerHTML = ("<b>" + ZadI18n.html("account-sync.34979d28c3") + "</b><span>" + ZadI18n.html("account-sync.f2ea1311fb") + "</span>");
      const n = e.querySelector(".zadPointsPanelHead");
      n ? n.insertAdjacentElement("afterend", t) : e.prepend(t)
    }
  }

  function k(t) {
    if (!t) return;
    S = {
      season_number: Math.max(1, Number(t.season_number) || 1),
      season_starts_on: String(t.season_starts_on || t.starts_on || ""),
      season_ends_on: String(t.season_ends_on || t.ends_on || "")
    }, E();
    const e = function(t) {
        const e = C(t);
        if (!e) return "—";
        try {
          return new Intl.DateTimeFormat(ZadI18n.locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }).format(e)
        } catch (e) {
          return String(t || "—")
        }
      }(S.season_ends_on),
      n = function(t) {
        const e = C(t?.season_ends_on || t?.ends_on);
        if (!e) return 0;
        const n = new Date,
          a = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 12, 0, 0, 0);
        return Math.max(0, Math.ceil((e - a) / 864e5))
      }(S);
    document.querySelectorAll(".zadSeasonBanner").forEach(t => {
      const a = t.querySelector("small"),
        r = t.querySelector("strong"),
        o = t.querySelector("span");
      a && (a.textContent = ZadI18n.t("account-sync.31ce8a451b", {v0:(v(S.season_number))})), r && (r.textContent = ZadI18n.t("account-sync.b82cbce1ff", {v0:(e)})), o && (o.textContent = 0 === n ? ZadI18n.t("account-sync.5059e32976") : ZadI18n.t("account-sync.37aaeb4f01", {v0:(v(n))}))
    }), document.querySelectorAll(".zadSeasonMini").forEach(t => {
      const n = t.querySelector("b"),
        a = t.querySelector("span");
      n && (n.textContent = ZadI18n.t("account-sync.31ce8a451b", {v0:(v(S.season_number))})), a && (a.textContent = ZadI18n.t("account-sync.c93c449f76", {v0:(e)}))
    })
  }

  function M(e, n) {
    const a = t(e);
    a && (a.textContent = n)
  }

  function N() {
    if (!l || !_) return;
    const n = _.total_points,
      r = _.level,
      o = _.current_streak,
      i = _.lifetime_points,
      s = ((t, e) => {
        let n = 0;
        return [100, 300, 700, 1500, 3e3, 5e3].forEach(e => {
          t >= e && n++
        }), e >= 7 && n++, e >= 30 && n++, n
      })(i, _.best_streak);
    if (a) {
      let t = null,
        n = !1;
      try {
        t = Zad.storage.getItem(e), n = null !== t, Zad.storage.setItem(e, String(i)), a()
      } catch (t) {} finally {
        try {
          n ? Zad.storage.setItem(e, t) : Zad.storage.removeItem(e)
        } catch (t) {}
      }
    } ["zadPointsValue", "zadPointsChipValue", "zadPointsPanelValue", "zadStatsPoints", "zadPanelStatsPoints"].forEach(t => M(t, v(n))), M("zadPointsLevel", ZadI18n.t("account-sync.4a756ec14d", {v0:(v(r))})), M("zadStatsLevel", v(r)), M("zadPanelStatsLevel", v(r));
    const d = n % 100,
      c = t("zadPointsLevelLabel");
    if (c) {
      c.replaceChildren();
      const t = document.createElement("span");
      t.className = "zadLevelWord", t.textContent = ZadI18n.t("account-sync.de249f953b");
      const e = document.createElement("b");
      e.className = "zadLevelNumber", e.textContent = v(r), c.append(t, e)
    }
    M("zadPointsProgressText", `${v(d)} / ${v(100)}`), t("zadPointsProgressBar") && (t("zadPointsProgressBar").style.width = `${d}%`), M("zadPointsStreak", v(o)), M("zadStatsStreak", ZadI18n.t("account-sync.38356da9c1", {v0:(v(o))})), M("zadPanelStatsStreak", ZadI18n.t("account-sync.38356da9c1", {v0:(v(o))})), M("zadPointsBadges", v(s)), M("zadStatsBadges", v(s)), M("zadPanelStatsBadges", v(s)), k(_), document.documentElement.dataset.zadPointsSource = "account"
  }

  function x() {
    _ = null, delete document.documentElement.dataset.zadPointsSource;
    try {
      a?.()
    } catch (t) {}
  }
  async function $() {
    if (!c || !l) return null;
    const t = l.id,
      {
        data: e,
        error: n
      } = await P(c.rpc("zad_get_my_season_stats"));
    if (n) throw n;
    if (!l || l.id !== t) return null;
    const a = Array.isArray(e) ? e[0] : e;
    return _ = L(a || {}), N(), _
  }
  async function q() {
    if (!c || !l) return 0;
    const {
      data: t,
      error: e
    } = await P(c.rpc("zad_get_today_wird_choice"));
    if (e) throw e;
    const n = Array.isArray(t) ? t[0] : t,
      a = Number(n && "object" == typeof n ? n.choice_amount ?? n.zad_get_today_wird_choice ?? 0 : n || 0),
      r = 2 === a ? 2 : 1 === a ? 1 : 0;
    return window.zadSetWirdChoiceFromServer?.(r), r
  }

  function A(t) {
    if (!t || "server_bonus" === t) return f;
    const e = l?.id || "";
    return f = f.then(async () => {
      if (!c || !l || l.id !== e) return;
      const {
        data: n,
        error: a
      } = await P(c.rpc("zad_claim_event", {
        p_event_type: t
      }));
      if (a) throw a;
      if (!l || l.id !== e) return;
      const r = Array.isArray(n) ? n[0] : n;
      r ? (_ = L(r), N()) : await $(), t.startsWith("daily_wird") && await q(), Z() && W(!0)
    }).catch(t => {
      console.error("Zad secure points error:", t), $().catch(() => {}), q().catch(() => {})
    }), f
  }

  function B() {
    w.splice(0).forEach(t => {
      try {
        n?.(...t)
      } catch (t) {}
    }), x()
  }

  function O() {
    return [t("zadMyPanelViewLeaderboard"), t("zadLeaderboardOverlay")].filter(Boolean)
  }

  function T(t) {
    const e = t.querySelector(".zadLeaderboardTabs");
    e && !e.classList.contains("zadLiveTabs") && (e.classList.add("zadLiveTabs"), e.replaceChildren(), [
      ["points", ZadI18n.t("account-sync.88cb104fda")],
      ["streak", ZadI18n.t("account-sync.84dfdfff5d")],
      ["activity", ZadI18n.t("account-sync.511d73730f")]
    ].forEach(([t, n]) => {
      const a = document.createElement("button");
      a.type = "button", a.dataset.boardMode = t, a.textContent = n, a.addEventListener("click", () => {
        h = t, H()
      }), e.appendChild(a)
    }));
    const n = t.querySelector(".zadComingCard");
    n && n.classList.add("zadLiveLeaderboardHost"), E(), S && k(S)
  }

  function H() {
    O().forEach(t => {
      T(t), t.querySelectorAll("[data-board-mode]").forEach(t => {
          t.classList.toggle("active", t.dataset.boardMode === h)
        }),
        function(t) {
          if (!t) return;
          if (t.replaceChildren(), p) {
            const e = document.createElement("div");
            return e.className = "zadLiveBoardStatus", e.textContent = ZadI18n.t("account-sync.82c001950e"), void t.appendChild(e)
          }
          if (z) {
            const e = document.createElement("div");
            return e.className = "zadLiveBoardStatus", e.textContent = ZadI18n.t("account-sync.1129d3ba46"), void t.appendChild(e)
          }
          const e = function() {
            const t = y.slice();
            return "streak" === h ? t.sort((t, e) => e.current_streak - t.current_streak || e.total_points - t.total_points) : "activity" === h ? t.sort((t, e) => e.season_activity - t.season_activity || e.total_points - t.total_points || e.current_streak - t.current_streak) : t.sort((t, e) => e.total_points - t.total_points || e.current_streak - t.current_streak), t
          }();
          if (!e.length) {
            const e = document.createElement("div");
            return e.className = "zadLiveBoardStatus", e.textContent = ZadI18n.t("account-sync.ea9006c52a"), void t.appendChild(e)
          }
          const n = document.createElement("div");
          n.className = "zadLiveBoardList", e.forEach((t, e) => {
            const a = document.createElement("div");
            a.className = "zadLiveBoardRow", l && t.display_name && (l.user_metadata?.display_name || "").trim() === t.display_name.trim() && a.classList.add("isMe");
            const r = document.createElement("div");
            r.className = "zadLiveBoardRank", r.textContent = v(e + 1);
            const o = document.createElement("div");
            o.className = "zadLiveBoardPerson";
            const i = document.createElement("strong");
            i.textContent = t.display_name || ZadI18n.t("access.58fffe6bec");
            const s = document.createElement("small");
            s.textContent = ZadI18n.t("account-sync.e38a7755d4", {v0:(v(t.level)),v1:(v(t.current_streak))}), o.append(i, s);
            const d = document.createElement("div");
            d.className = "zadLiveBoardPoints", d.textContent = "streak" === h ? ZadI18n.t("account-sync.38356da9c1", {v0:(v(t.current_streak))}) : "activity" === h ? ZadI18n.t("account-sync.0e996bcf84", {v0:(v(t.season_activity))}) : ZadI18n.t("account-sync.801445e790", {v0:(v(t.total_points))}), a.append(r, o, d), n.appendChild(a)
          }), t.appendChild(n)
        }(t.querySelector(".zadComingCard"))
    })
  }
  async function W(t = !1) {
    if (c && !p)
      if (!y.length || t) {
        p = !0, z = "", H();
        try {
          const {
            data: t,
            error: e
          } = await P(c.rpc("zad_get_leaderboard", {
            p_limit: 100
          }));
          if (e) throw e;
          y = (Array.isArray(t) ? t : []).map(t => ({
            display_name: String(t?.display_name || ZadI18n.t("access.58fffe6bec")).slice(0, 80),
            total_points: b(t?.total_points),
            level: Math.max(1, Number(t?.level) || 1),
            current_streak: b(t?.current_streak),
            season_activity: b(t?.season_activity),
            lifetime_points: b(t?.lifetime_points),
            season_number: Math.max(1, Number(t?.season_number) || 1)
          }))
        } catch (t) {
          y = [], z = "load failed"
        } finally {
          p = !1, H()
        }
      } else H()
  }

  function Z() {
    return Boolean(!t("zadMyPanelViewLeaderboard")?.classList.contains("hidden") || t("zadLeaderboardOverlay")?.classList.contains("open"))
  }
  async function D(t) {
    const e = t || null,
      n = e?.id || "",
      a = n !== u;
    if (l = e, u = n, m = !0, window.__zadActiveUserId = n, a && window.zadSetWirdChoiceFromServer?.(0), !l) return w.length ? B() : x(), void(Z() && W(!0));
    const r = function() {
      const t = new Set;
      return w.splice(0).forEach(([e, n]) => {
        const a = g(0, n);
        a && "server_bonus" !== a && t.add(a)
      }), t
    }();
    (function() {
      const t = function() {
          try {
            return Zad.readJSON("zad_points_ledger_v1", {}) || {}
          } catch (t) {
            return {}
          }
        }(),
        e = function() {
          const t = new Date,
            e = t => String(t).padStart(2, "0");
          return `${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`
        }(),
        n = [],
        a = t[`wird-done:${e}:1`],
        r = t[`wird-done:${e}:2`],
        o = t[`wird-done:${e}`];
      return r && n.push("daily_wird_2"), a && n.push("daily_wird_1"), !a && !r && o && n.push(Number(o?.points) >= 20 ? "daily_wird_2" : "daily_wird_1"), t[`heart-daily:${e}`] && n.push("daily_zad"), t[`azkar-morning:${e}`] && n.push("daily_azkar_morning"), t[`azkar-evening:${e}`] && n.push("daily_azkar_evening"), n
    })().forEach(t => r.add(t)), r.forEach(t => A(t)), await f, !a && _ || await $(), await q().catch(() => 0), Z() && W(!0)
  }
  async function I() {
    if (!c) return null;
    const {
      data: t,
      error: e
    } = await P(c.rpc("zad_get_current_season"));
    if (e) throw e;
    const n = Array.isArray(t) ? t[0] : t;
    return n && k(n), n || null
  }
  function updateCopy(){
        const t = document.querySelector(".zadAuthNote");
        t && (t.textContent = ZadI18n.t("account-sync.56836c41d1"));
        const e = document.querySelector("#zadStatsOverlay .zadUtilityHero p");
        e && (e.textContent = ZadI18n.t("account-sync.a9387c53ff"));
        const n = document.querySelector("#zadMyPanelViewStats .zadMyPanelHero p");
        n && (n.textContent = ZadI18n.t("account-sync.31425dbc5f"));
        const a = document.querySelector("#zadMyPanelViewStats .zadMyPanelHero strong");
        a && (a.textContent = ZadI18n.t("account-sync.82bbf37999"));
        const r = document.querySelector("#zadLeaderboardOverlay .zadUtilityHero p");
        r && (r.textContent = ZadI18n.t("account-sync.5fde933c72"))

  }
  document.addEventListener('zad:language',()=>{
    updateCopy();
    const keys={points:'account-sync.88cb104fda',streak:'account-sync.84dfdfff5d',activity:'account-sync.511d73730f'};
    O().forEach(root=>root.querySelectorAll('[data-board-mode]').forEach(btn=>btn.textContent=ZadI18n.t(keys[btn.dataset.boardMode])));
    if(S)k(S);if(l&&_)N();
  });
  async function V() {
    if (updateCopy(), E(), O().forEach(T), H(), c = await async function() {
        for (let t = 0; t < 50; t++) {
          if (window.zadSupabase?.auth) return window.zadSupabase;
          await new Promise(t => setTimeout(t, 100))
        }
        return null
      }(), !c) return m = !0, void B();
    try {
      await I().catch(() => {
        document.querySelectorAll(".zadSeasonBanner strong").forEach(e => e.textContent = ZadI18n.t("account-sync.b0af552f04"));
      });
      const {
        data: t,
        error: e
      } = await c.auth.getSession();
      if (e) throw e;
      await D(t?.session?.user || null), c.auth.onAuthStateChange(function(t, e) {
        setTimeout(() => D(e?.user || null).catch(t => {
          console.error("Zad session sync error:", t)
        }), 0)
      })
    } catch (t) {
      m = !0, B()
    }
    window.addEventListener("focus", () => {
      I().catch(() => {}), l && $().catch(() => {}), Z() && W(!0)
    }), document.addEventListener("visibilitychange", () => {
      "visible" === document.visibilityState && (I().catch(() => {}), l && $().catch(() => {}), Z() && W(!0))
    })
  }
  window.zadClaimWirdChoiceServer = async function(t) {
    const e = 2 === Number(t) ? 2 : 1;
    for (let t = 0; t < 40 && (!c || !l); t++) await new Promise(t => setTimeout(t, 100));
    if (!c || !l) throw new Error("not_authenticated");
    return await A(2 === e ? "daily_wird_2" : "daily_wird_1"), q()
  }, window.zadAddPoints = function(t, e) {
    if (!m) return w.push([t, e]), !0;
    if (!l) return !!n && n(t, e);
    const a = g(0, e);
    return !!a && (A(a), !0)
  }, window.zadGetPoints = function() {
    return l && _ ? _.total_points : r ? r() : 0
  }, window.zadRefreshPoints = function() {
    if (l && _) N();
    else try {
      a?.()
    } catch (t) {}
  }, o && (window.zadMyPanelShow = function(t) {
    const e = o(t);
    return "stats" === t && (l ? $().catch(t => console.error("Zad stats error:", t)) : x()), "leaderboard" === t && W(!0), e
  }), i && (window.zadOpenLeaderboard = function() {
    const t = i();
    return W(!0), t
  }), s && (window.zadOpenStats = function() {
    const t = s();
    return l && $().catch(t => console.error("Zad stats error:", t)), t
  }), d && (window.showZadMainHub = function() {
    const t = d(...arguments);
    return l && _ && N(), t
  }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", V, {
    once: !0
  }) : V()
}()

