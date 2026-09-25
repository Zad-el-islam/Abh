! function() {
  "use strict";
  let t = null;
  const e = t => document.getElementById(t);

  function n(t = "", n = "") {
    const a = e("zadAuthMessage");
    a && (a.textContent = t, a.className = "zadAuthMessage" + (n ? " " + n : ""))
  }

  function a(t, n = !1) {
    const a = e("zadAuthStatus");
    a && (a.querySelector("span").textContent = t, a.classList.toggle("ready", n))
  }

  function s(t) {
    const n = e("zadMyPanelToggle"),
      a = e("zadAuthGuest"),
      s = e("zadAuthLogged");
    t ? (n?.classList.add("online"), a?.classList.add("hidden"), s?.classList.add("show"), e("zadAuthUserName") && (e("zadAuthUserName").textContent = t.user_metadata?.username || t.user_metadata?.display_name || ZadI18n.t("access.58fffe6bec"))) : (n?.classList.remove("online"), a?.classList.remove("hidden"), s?.classList.remove("show"), e("zadAuthUserName") && (e("zadAuthUserName").textContent = "—"))
  }
  async function o() {
    try {
      if (!window.supabase || "function" != typeof window.supabase.createClient) return void a(ZadI18n.t("account.5e33f9a8c9"), !1);
      t = window.supabase.createClient("https://bzrhrvgddtnhctcdlgmy.supabase.co", "sb_publishable_HzCPiZYRuFb3hm_duGCHVA_J020y2YL", {
        global: {
          fetch: Zad.fetch
        },
        auth: {
          storage: Zad.storage,
          persistSession: !0,
          autoRefreshToken: !0,
          detectSessionInUrl: !0
        }
      }), window.zadSupabase = t;
      const {
        data: e,
        error: n
      } = await t.auth.getSession();
      if (n) throw n;
      s(e?.session?.user || null), a(ZadI18n.t("account-panel.bc812898d7"), !0), t.auth.onAuthStateChange(function(t, e) {
        s(e?.user || null)
      })
    } catch (t) {
      console.error("Zad Supabase init error:", t), a(ZadI18n.t("account.7e1cb851f3"), !1)
    }
  }
  window.zadOpenAuth = function() {
    const t = e("zadAuthOverlay");
    t && (t.classList.add("open"), t.setAttribute("aria-hidden", "false"), document.documentElement.style.overflow = "hidden", n(""))
  }, window.zadCloseAuth = function() {
    const t = e("zadAuthOverlay");
    t && (t.classList.remove("open"), t.setAttribute("aria-hidden", "true"), document.documentElement.style.overflow = "")
  }, window.zadAuthSignIn = function() {
    return window.zadAuthSubmit?.()
  }, window.zadAuthSignUp = function() {
    window.zadSetAuthMode?.("signup", !1)
  }, window.zadAuthSignOut = async function() {
    if (!t) return;
    n(ZadI18n.t("account-panel.36cedaea09"));
    const {
      error: e
    } = await t.auth.signOut({
      scope: "local"
    });
    if (e) return n(Zad.errorText(e), "bad");
    s(null), n(ZadI18n.t("account-panel.95e69d3acc"), "ok")
  }, document.addEventListener("keydown", function(t) {
    "Escape" === t.key && e("zadAuthOverlay")?.classList.contains("open") && window.zadCloseAuth()
  }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", o, {
    once: !0
  }) : o()
}()

