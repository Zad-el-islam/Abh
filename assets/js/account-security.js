! function() {
  "use strict";
  const e = "zad_auth_guard_v2",
    t = 6e5;
  let n = !1;

  function a(e) {
    return document.getElementById(e)
  }

  function r(e) {
    return String(e || "").normalize("NFKC").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 24)
  }

  function s(e) {
    const t = r(e);
    return t.length < 3 ? ZadI18n.t("account-security.879cb11f52") : t.length > 24 ? ZadI18n.t("account-security.a437909481") : /^[\p{L}\p{N}_-]+$/u.test(t) ? "" : ZadI18n.t("account-security.1787169396")
  }
  async function o(e) {
    if (!window.crypto?.subtle || "function" != typeof TextEncoder) throw new Error("secure_browser_required");
    const t = r(e).toLowerCase(),
      n = (new TextEncoder).encode("zad-alrouh:v1:" + t),
      a = await window.crypto.subtle.digest("SHA-256", n);
    return "u_" + Array.from(new Uint8Array(a), function(e) {
      return e.toString(16).padStart(2, "0")
    }).join("") + "@users.zad-alrouh.invalid"
  }

  function i(e) {
    const t = String(e || "");
    return t.length < 12 ? ZadI18n.t("account-security.816122c2c5") : t.length > 128 ? ZadI18n.t("account-security.d3197dd541") : /[\p{L}]/u.test(t) && /[0-9٠-٩]/.test(t) ? "" : ZadI18n.t("account-security.e2974482ff")
  }

  function u(e, t) {
    const n = function(e) {
      const t = String(e || "");
      if (!t) return {
        level: "",
        get label() { return ZadI18n.t("account-security.1ec4331730"); }
      };
      let n = 0;
      return t.length >= 12 && n++, t.length >= 16 && n++, /[\p{L}]/u.test(t) && n++, /[0-9٠-٩]/.test(t) && n++, /[^\p{L}\p{N}\s]/u.test(t) && n++, n >= 5 ? {
        level: "strong",
        get label() { return ZadI18n.t("account-security.9ffc6bc719"); }
      } : n >= 3 && !i(t) ? {
        level: "medium",
        get label() { return ZadI18n.t("account-security.722d16529f"); }
      } : {
        level: "weak",
        get label() { return ZadI18n.t("account-security.f1ce06689b"); }
      }
    }(e.value);
    t.dataset.level = n.level;
    const a = t.querySelector("b");
    a && (a.textContent = n.label)
  }

  function d(e) {
    const t = String(e?.code || "").toLowerCase(),
      n = String(e?.message || "").toLowerCase();
    return t.includes("invalid_credentials") || n.includes("invalid login")
  }

  function c(e) {
    const t = String(e?.code || "").toLowerCase(),
      n = String(e?.message || "").toLowerCase();
    return n.includes("secure_browser_required") ? ZadI18n.t("account-security.3318b3a1f8") : n.includes("username_taken") || "23505" === t ? ZadI18n.t("account-security.c3e41ea253") : n.includes("invalid_username") ? ZadI18n.t("account-security.1787169396") : n.includes("username_account_required") ? ZadI18n.t("account-security.0068340da2") : n.includes("not_authenticated") || t.includes("not_authenticated") ? ZadI18n.t("account-security.f1d0c0e83f") : d(e) ? ZadI18n.t("account-security.f03be3e32b") : t.includes("email_not_confirmed") || n.includes("email not confirmed") ? ZadI18n.t("account-security.62a3510153") : t.includes("user_already_exists") || n.includes("already registered") ? ZadI18n.t("account-security.c3e41ea253") : t.includes("over_request_rate_limit") || n.includes("rate limit") ? ZadI18n.t("account-security.6223ca3f58") : t.includes("weak_password") || n.includes("password") ? ZadI18n.t("account-security.4556e6a9ce") : ZadI18n.t("account-security.79ce05804d")
  }

  function l() {
    try {
      const t = JSON.parse(Zad.session.getItem(e) || "{}");
      return t && "object" == typeof t ? t : {}
    } catch (e) {
      return {}
    }
  }

  function f(t) {
    try {
      Zad.session.setItem(e, JSON.stringify(t))
    } catch (e) {}
  }

  function w() {
    const e = Date.now(),
      n = l();
    return Number(n.blockUntil || 0) > e ? {
      ok: !1,
      seconds: Math.max(1, Math.ceil((n.blockUntil - e) / 1e3))
    } : ((!n.startedAt || e - n.startedAt > t) && f({
      startedAt: e,
      failures: 0
    }), {
      ok: !0
    })
  }

  function g() {
    const e = Date.now(),
      n = l();
    (!n.startedAt || e - n.startedAt > t) && (n.startedAt = e, n.failures = 0), n.failures = Number(n.failures || 0) + 1, n.failures >= 5 && (n.blockUntil = e + 6e4), f(n)
  }

  function h() {
    f({
      startedAt: Date.now(),
      failures: 0
    })
  }

  function p(e) {
    e.forEach(function(e) {
      const t = a(e);
      t && (t.value = "", t.type = "password")
    })
  }

  function m(e, t, n) {
    const r = a(e ? "zadPanelAuthMessage" : "zadAuthMessage");
    r && (r.textContent = t || "", r.className = (e ? "zadPanelAuthMessage" : "zadAuthMessage") + (n ? " " + n : ""))
  }
  const z = {
    main: "choice",
    panel: "choice"
  };

  function b(e, t) {
    const n = Boolean(t),
      r = ["choice", "login", "signup"].includes(e) ? e : "choice";
    z[n ? "panel" : "main"] = r;
    const s = n ? "zadPanelAuth" : "zadAuth";
    if (a(s + "Choice")?.classList.toggle("hidden", "choice" !== r), a(s + "LoginScreen")?.classList.toggle("hidden", "login" !== r), a(s + "SignupScreen")?.classList.toggle("hidden", "signup" !== r), m(n, ""), "choice" !== r) {
      const e = a(n ? "login" === r ? "zadPanelLoginUsername" : "zadPanelSignupUsername" : "login" === r ? "zadAuthLoginUsername" : "zadAuthSignupUsername");
      window.requestAnimationFrame(function() {
        e?.focus()
      })
    }
  }
  async function S(e) {
    const t = await e.auth.getUser();
    if (t.error || !t.data?.user) throw t.error || new Error("not_authenticated");
    return t.data.user
  }
  async function P(e, t, n) {
    if (!n) throw new Error("current_password_required");
    const a = await e.auth.signInWithPassword({
      email: t.email,
      password: n
    });
    if (a.error) throw a.error;
    return a.data?.user || t
  }
  async function y(e) {
    if (n) return;
    const t = w();
    if (!t.ok) return m(e, ZadI18n.t("account-security.125c06a8e5") + t.seconds + ZadI18n.t("account-security.a5c5b0e5ce"), "bad");
    const i = window.zadSupabase;
    if (!i?.auth) return m(e, ZadI18n.t("account-security.dc2d053e27"), "bad");
    const u = r(a(e ? "zadPanelLoginUsername" : "zadAuthLoginUsername")?.value),
      d = String(a(e ? "zadPanelLoginPassword" : "zadAuthLoginPassword")?.value || ""),
      l = s(u);
    if (l) return m(e, l, "bad");
    if (!d) return m(e, ZadI18n.t("account-security.7bc05923ed"), "bad");
    n = !0, m(e, ZadI18n.t("account-security.7477d44921"));
    try {
      const t = await async function(e, t) {
        try {
          const n = await e.rpc("zad_resolve_login_username", {
            p_username: t
          });
          if (!n.error && "string" == typeof n.data && n.data) return n.data
        } catch (e) {}
        return o(t)
      }(i, u), n = await i.auth.signInWithPassword({
        email: t,
        password: d
      });
      if (n.error) return g(), m(e, c(n.error), "bad");
      h(), p([e ? "zadPanelLoginPassword" : "zadAuthLoginPassword"]), m(e, ZadI18n.t("account-security.6ef0725a8e"), "ok")
    } catch (t) {
      g(), m(e, c(t), "bad")
    } finally {
      n = !1
    }
  }
  async function v(e) {
    if (n) return;
    const t = w();
    if (!t.ok) return m(e, ZadI18n.t("account-security.125c06a8e5") + t.seconds + ZadI18n.t("account-security.a5c5b0e5ce"), "bad");
    const u = window.zadSupabase;
    if (!u?.auth) return m(e, ZadI18n.t("account-security.dc2d053e27"), "bad");
    const d = r(a(e ? "zadPanelSignupUsername" : "zadAuthSignupUsername")?.value),
      l = String(a(e ? "zadPanelSignupPassword" : "zadAuthSignupPassword")?.value || ""),
      f = String(a(e ? "zadPanelSignupPasswordConfirm" : "zadAuthSignupPasswordConfirm")?.value || ""),
      z = s(d);
    if (z) return m(e, z, "bad");
    const b = i(l);
    if (b) return m(e, b, "bad");
    if (l !== f) return m(e, ZadI18n.t("account-security.817411395c"), "bad");
    n = !0, m(e, ZadI18n.t("account-security.683e9a5890"));
    try {
      const t = await async function(e, t) {
        const n = await e.rpc("zad_username_available", {
          p_username: t
        });
        if (!n.error && "boolean" == typeof n.data) return n.data;
        const a = String(n.error?.code || "").toLowerCase(),
          r = String(n.error?.message || "").toLowerCase();
        if (a.includes("pgrst202") || r.includes("zad_username_available")) return null;
        throw n.error || new Error("username_check_failed")
      }(u, d);
      if (!1 === t) return m(e, ZadI18n.t("account-security.55a2f85bac"), "bad");
      const n = await o(d),
        a = {
          data: {
            username: d,
            display_name: d
          }
        },
        r = await u.auth.signUp({
          email: n,
          password: l,
          options: a
        });
      if (r.error) return g(), m(e, c(r.error), "bad");
      h(), p([e ? "zadPanelSignupPassword" : "zadAuthSignupPassword", e ? "zadPanelSignupPasswordConfirm" : "zadAuthSignupPasswordConfirm"]), m(e, r.data?.session ? ZadI18n.t("account-security.7d8b0842f2") : ZadI18n.t("account-security.a2ad27de2b"), "ok")
    } catch (t) {
      g(), m(e, c(t), "bad")
    } finally {
      n = !1
    }
  }

  function A(e, t) {
    try {
      Object.defineProperty(window, e, {
        value: t,
        writable: !1,
        configurable: !1
      })
    } catch (n) {
      window[e] = t
    }
  }

  function _(e) {
    if (!e || 1 !== e.nodeType) return;
    const t = String(e.getAttribute("href") || "").trim();
    /^\s*(?:javascript|vbscript|data):/i.test(t) && (e.removeAttribute("href"), e.setAttribute("aria-disabled", "true")), "_blank" === e.target && (e.rel = "noopener noreferrer")
  }

  function E(el) {
    if (!el || el.nodeType !== 1) return;
    el.removeAttribute('srcdoc');
    const value = el.getAttribute('src');
    if (value) {
      try {
        const url = new URL(value, location.href);
        if (url.origin !== location.origin && !['https://www.youtube.com', 'https://www.youtube-nocookie.com'].includes(url.origin)) el.removeAttribute('src');
      } catch (_) {
        el.removeAttribute('src');
      }
    }
    el.referrerPolicy = 'strict-origin-when-cross-origin';
  }

  function L(e) {
    e?.matches?.("a") && _(e), e?.matches?.("iframe") && E(e), e?.querySelectorAll?.("a").forEach(_), e?.querySelectorAll?.("iframe").forEach(E)
  }
  A("zadAuthSignIn", function() {
    return y(!1)
  }), A("zadAuthSignUp", function() {
    return v(!1)
  }), A("zadPanelSignIn", function() {
    return y(!0)
  }), A("zadPanelSignUp", function() {
    return v(!0)
  }), A("zadShowAuthScreen", b), A("zadSetAuthMode", b), A("zadAuthSubmit", function() {
    return "signup" === z.main ? v(!1) : y(!1)
  }), A("zadPanelAuthSubmit", function() {
    return "signup" === z.panel ? v(!0) : y(!0)
  }), A("zadChangeUsername", async function(e) {
    if (n) return;
    const t = w();
    if (!t.ok) return m(e, ZadI18n.t("account-security.125c06a8e5") + t.seconds + ZadI18n.t("account-security.a5c5b0e5ce"), "bad");
    const o = window.zadSupabase;
    if (!o?.auth) return m(e, ZadI18n.t("account-security.dc2d053e27"), "bad");
    const i = e ? "zadPanel" : "zadAuth",
      u = r(a(i + "NewUsername")?.value),
      l = String(a(i + "UsernameCurrentPassword")?.value || ""),
      f = s(u);
    if (f) return m(e, f, "bad");
    if (!l) return m(e, ZadI18n.t("account-security.167f2bb9d6"), "bad");
    n = !0, m(e, ZadI18n.t("account-security.12d70c4f19"));
    try {
      const t = await S(o);
      if (r(t.user_metadata?.username).toLowerCase() === u.toLowerCase()) return m(e, ZadI18n.t("account-security.69cb35ddb2"), "bad");
      await P(o, t, l);
      const n = await o.rpc("zad_change_username", {
        p_new_username: u
      });
      if (n.error) throw n.error;
      const s = {
          ...t.user_metadata || {},
          username: u,
          display_name: u
        },
        d = await o.auth.updateUser({
          data: s
        });
      ! function(e) {
        const t = r(e) || ZadI18n.t("access.58fffe6bec"),
          n = a("zadAuthUserName"),
          s = a("zadPanelUserName");
        n && (n.textContent = t), s && (s.textContent = t)
      }(u), a(i + "NewUsername").value = "", a(i + "UsernameCurrentPassword").value = "", h(), m(e, d.error ? ZadI18n.t("account-security.65966c0bfe") : ZadI18n.t("account-security.381bcc413b"), "ok")
    } catch (t) {
      g(), String(t?.message || "").includes("current_password_required") ? m(e, ZadI18n.t("account-security.167f2bb9d6"), "bad") : d(t) ? m(e, ZadI18n.t("account-security.cf9a13df53"), "bad") : m(e, c(t), "bad")
    } finally {
      n = !1
    }
  }), A("zadChangePassword", async function(e) {
    if (n) return;
    const t = w();
    if (!t.ok) return m(e, ZadI18n.t("account-security.125c06a8e5") + t.seconds + ZadI18n.t("account-security.a5c5b0e5ce"), "bad");
    const r = window.zadSupabase;
    if (!r?.auth) return m(e, ZadI18n.t("account-security.dc2d053e27"), "bad");
    const s = e ? "zadPanel" : "zadAuth",
      o = String(a(s + "CurrentPassword")?.value || ""),
      u = String(a(s + "NewPassword")?.value || ""),
      l = String(a(s + "NewPasswordConfirm")?.value || "");
    if (!o) return m(e, ZadI18n.t("account-security.d945c2e2ad"), "bad");
    const f = i(u);
    if (f) return m(e, f, "bad");
    if (u !== l) return m(e, ZadI18n.t("account-security.aec3d25cfa"), "bad");
    if (u === o) return m(e, ZadI18n.t("account-security.1acb7bacf0"), "bad");
    n = !0, m(e, ZadI18n.t("account-security.fd94a33326"));
    try {
      const t = await S(r);
      await P(r, t, o);
      const n = await r.auth.updateUser({
        password: u
      });
      if (n.error) throw n.error;
      a(s + "CurrentPassword").value = "", a(s + "NewPassword").value = "", a(s + "NewPasswordConfirm").value = "", h(), m(e, ZadI18n.t("account-security.e26f72cdc4"), "ok")
    } catch (t) {
      g(), m(e, d(t) ? ZadI18n.t("account-security.cf9a13df53") : c(t), "bad")
    } finally {
      n = !1
    }
  }), L(document), document.querySelectorAll('input[type="password"]').forEach(function(e) {
    if (!e || "1" === e.dataset.zadPasswordReady) return;
    e.dataset.zadPasswordReady = "1";
    const t = document.createElement("div");
    t.className = "zadPasswordWrap", e.parentNode.insertBefore(t, e), t.appendChild(e);
    const n = document.createElement("button");
    n.type = "button", n.className = "zadPasswordEye", n.textContent = ZadI18n.t("account-security.00c914d2c3"), n.setAttribute("aria-label", ZadI18n.t("account-security.d794fa009d")), n.setAttribute("aria-pressed", "false"), n.addEventListener("click", function() {
      const t = "password" === e.type;
      e.type = t ? "text" : "password", n.textContent = t ? ZadI18n.t("quran-reader.80b44ac838") : ZadI18n.t("account-security.00c914d2c3"), n.setAttribute("aria-label", t ? ZadI18n.t("account-security.b53728d6c3") : ZadI18n.t("account-security.d794fa009d")), n.setAttribute("aria-pressed", t ? "true" : "false"), e.focus({
        preventScroll: !0
      })
    }), t.appendChild(n)
  }), ["zadAuthSignupPassword", "zadPanelSignupPassword", "zadPanelNewPassword"].forEach(function(e) {
    ! function(e) {
      if (!e || "1" === e.dataset.zadStrengthReady) return;
      e.dataset.zadStrengthReady = "1";
      const t = e.closest(".zadPasswordWrap");
      if (!t) return;
      const n = document.createElement("small");
      n.className = "zadPasswordStrength", n.innerHTML = ("<span class=\"zadPasswordStrengthTrack\"><i></i></span><b>" + ZadI18n.html("account-security.1ec4331730") + "</b>"), t.insertAdjacentElement("afterend", n), e.addEventListener("input", function() {
        u(e, n)
      }), u(e, n)
    }(a(e))
  }), b("choice", !1), b("choice", !0), ["zadAuthLoginUsername", "zadAuthLoginPassword"].forEach(function(e) {
    a(e)?.addEventListener("keydown", function(e) {
      "Enter" === e.key && (e.preventDefault(), window.zadAuthSignIn())
    })
  }), ["zadAuthSignupUsername", "zadAuthSignupPassword", "zadAuthSignupPasswordConfirm"].forEach(function(e) {
    a(e)?.addEventListener("keydown", function(e) {
      "Enter" === e.key && (e.preventDefault(), window.zadAuthSignUp())
    })
  }), ["zadPanelLoginUsername", "zadPanelLoginPassword"].forEach(function(e) {
    a(e)?.addEventListener("keydown", function(e) {
      "Enter" === e.key && (e.preventDefault(), window.zadPanelSignIn())
    })
  }), ["zadPanelSignupUsername", "zadPanelSignupPassword", "zadPanelSignupPasswordConfirm"].forEach(function(e) {
    a(e)?.addEventListener("keydown", function(e) {
      "Enter" === e.key && (e.preventDefault(), window.zadPanelSignUp())
    })
  }), a("zadPanelUsernameCurrentPassword")?.addEventListener("keydown", function(e) {
    "Enter" === e.key && (e.preventDefault(), window.zadChangeUsername(!0))
  }), a("zadPanelNewPasswordConfirm")?.addEventListener("keydown", function(e) {
    "Enter" === e.key && (e.preventDefault(), window.zadChangePassword(!0))
  });
  const C = new Set;
  let k = !1;

  function U(e) {
    if (!e || 1 !== e.nodeType && 9 !== e.nodeType) return;
    if (C.add(e), k) return;
    k = !0;
    const t = function() {
      k = !1, C.forEach(L), C.clear()
    };
    "function" == typeof queueMicrotask ? queueMicrotask(t) : Promise.resolve().then(t)
  }
  new MutationObserver(function(e) {
    e.forEach(function(e) {
      e.addedNodes.forEach(U)
    })
  }).observe(document.documentElement, {
    childList: !0,
    subtree: !0
  })
}()

