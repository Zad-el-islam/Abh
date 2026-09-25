! function() {
  "use strict";
  const t = t => document.getElementById(t),
    e = "zad_points_visit_days_v1";

  function n(t) {
    try {
      return Number(t).toLocaleString(ZadI18n.locale)
    } catch (e) {
      return String(t)
    }
  }

  function a(t = new Date) {
    const e = t => String(t).padStart(2, "0");
    return `${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`
  }

  function o() {
    const t = function(t, e) {
      try {
        return JSON.parse(Zad.storage.getItem(t) || "") || e
      } catch (t) {
        return e
      }
    }(e, []);
    return Array.isArray(t) ? Array.from(new Set(t)).sort() : []
  }

  function d() {
    const t = new Set(o());
    let e = 0,
      n = new Date;
    for (n.setHours(0, 0, 0, 0), t.has(a(n)) || n.setDate(n.getDate() - 1); t.has(a(n));) e++, n.setDate(n.getDate() - 1);
    return e
  }
  const i = [{
    min: 0,
    key: "seed",
    get title() { return ZadI18n.t("progress-display.cadd59f989"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.b36b8f7239"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.bd3d46f080"); }
  }, {
    min: 100,
    key: "leaf",
    get title() { return ZadI18n.t("progress-display.3a7baec449"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.ce278c5982"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.5366f56c37"); }
  }, {
    min: 300,
    key: "himma",
    get title() { return ZadI18n.t("progress-display.ccabe795d2"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.3237579923"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.6119e2e03a"); }
  }, {
    min: 700,
    key: "compass",
    get title() { return ZadI18n.t("progress-display.32bf739245"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.0a4d628aec"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.b895f12207"); }
  }, {
    min: 1500,
    key: "companion",
    get title() { return ZadI18n.t("progress-display.8f62bd8afc"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.e2eccb5b91"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.db3ce43929"); }
  }, {
    min: 3e3,
    key: "carrier",
    get title() { return ZadI18n.t("progress-display.402c28a4d5"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.8fe6e850f5"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.f77ccf86f2"); }
  }, {
    min: 5e3,
    key: "star",
    get title() { return ZadI18n.t("progress-display.23fe1e92cf"); },
    icon: "",
    get reward() { return ZadI18n.t("progress-display.423494efdf"); },
    rewardIcon: "",
    get rewardText() { return ZadI18n.t("progress-display.09e6a7ea20"); }
  }];

  function r() {
    const e = Math.max(0, Number(Zad.storage.getItem("zad_points_v1") || 0) || 0),
      a = Math.floor(e / 100) + 1,
      o = e % 100,
      r = d(),
      s = function(t) {
        let e = i[0];
        for (const n of i) {
          if (!(t >= n.min)) break;
          e = n
        }
        return e
      }(e),
      c = function(t, e) {
        let n = i.filter(e => e.min > 0 && t >= e.min).length;
        return e >= 7 && n++, e >= 30 && n++, n
      }(e, r);
    ["zadPointsValue", "zadPointsChipValue", "zadPointsPanelValue"].forEach(a => {
      t(a) && (t(a).textContent = n(e))
    }), t("zadPointsLevel") && (t("zadPointsLevel").textContent = ZadI18n.t("account-sync.4a756ec14d", {v0:(n(a))})), t("zadPointsLevelLabel") && (t("zadPointsLevelLabel").innerHTML = ("<span class=\"zadLevelWord\">" + ZadI18n.html("progress-display.961a0a03b9") + "</span><b class=\"zadLevelNumber\">" + (n(a)) + "</b>")), t("zadPointsProgressText") && (t("zadPointsProgressText").textContent = `${n(o)} / ١٠٠`), t("zadPointsProgressBar") && (t("zadPointsProgressBar").style.width = `${o}%`), t("zadPointsStreak") && (t("zadPointsStreak").textContent = n(r)), t("zadPointsBadges") && (t("zadPointsBadges").textContent = n(c)), t("zadPointsRankTitle") && (t("zadPointsRankTitle").textContent = s.title), t("zadPointsRankIcon") && (t("zadPointsRankIcon").textContent = s.icon), document.body.dataset.zadRank = s.key, t("zadRankRewardIcon") && (t("zadRankRewardIcon").textContent = s.rewardIcon || s.icon), t("zadRankRewardTitle") && (t("zadRankRewardTitle").textContent = s.reward), t("zadRankRewardText") && (t("zadRankRewardText").textContent = s.rewardText);
    const l = t("zadPointsPanel");
    l && !l.classList.contains("hidden") && function(e, a) {
      const o = t("zadRankRoad");
      if (!o) return;
      o.innerHTML = i.map(t => {
        const o = e >= t.min,
          d = t.key === a.key,
          i = d ? ZadI18n.t("progress-display.e59778e701") : o ? ZadI18n.t("progress-display.46ea59915e") : ZadI18n.t("account-sync.801445e790", {v0:(n(t.min))});
        return `<div class="zadRankStep ${o?"unlocked":""} ${d?"current":""}"><span class="zadRankStepIcon">${t.icon}</span><div class="zadRankStepCopy"><strong>${t.title}</strong><small>${t.reward} — ${t.rewardText}</small></div><span class="zadRankStepState">${i}</span></div>`
      }).join("");
      const d = i.findIndex(t => t.key === a.key);
      t("zadRankRoadCounter") && (t("zadRankRoadCounter").textContent = `${n(d+1)} / ${n(i.length)}`)
    }(e, s);
    const z = i.find(t => t.min > e);
    t("zadPointsNextText") && (t("zadPointsNextText").textContent = z ? ZadI18n.t("progress-display.bd4d06027a", {v0:(n(z.min-e)),v1:(z.title),v2:(z.reward)}) : ZadI18n.t("progress-display.989a415601"))
  }
  window.zadRefreshPoints = r, window.zadTogglePointsPanel = function(e) {
    e && e.stopPropagation();
    const n = t("zadPointsPanel"),
      a = t("zadPointsChip"),
      o = function() {
        let e = t("zadPointsBackdrop");
        return e || (e = document.createElement("div"), e.id = "zadPointsBackdrop", e.className = "zadPointsBackdrop hidden", e.addEventListener("click", () => window.zadClosePointsPanel?.()), document.body.appendChild(e)), e
      }();
    if (!n || !a) return;
    const d = n.classList.contains("hidden");
    n.classList.toggle("hidden", !d), o.classList.toggle("hidden", !d), document.body.classList.toggle("zadPointsOpen", d), a.setAttribute("aria-expanded", String(d)), r()
  }, window.zadClosePointsPanel = function() {
    const e = t("zadPointsPanel"),
      n = t("zadPointsChip"),
      a = t("zadPointsBackdrop");
    e?.classList.add("hidden"), a?.classList.add("hidden"), document.body.classList.remove("zadPointsOpen"), n?.setAttribute("aria-expanded", "false")
  }, document.addEventListener("click", t => {
    t.target.closest("#zadPointsPanel") || t.target.closest("#zadPointsChip") || window.zadClosePointsPanel?.()
  });
  document.addEventListener('zad:language',r);
  const s = window.zadAddPoints;

  function c() {
    ! function() {
      const t = a(),
        n = o();
      n.includes(t) || (n.push(t), n.sort(), function(t, e) {
        try {
          Zad.storage.setItem(t, JSON.stringify(e))
        } catch (t) {}
      }(e, n.slice(-400))), r()
    }()
  }
  window.zadAddPoints = function(t, e) {
    const n = "function" == typeof s && s.apply(this, arguments);
    return n && r(), n
  }, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", c, {
    once: !0
  }) : c()
}()

