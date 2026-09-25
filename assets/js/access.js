(function() {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = v => Zad.escape(String(v ?? '').trim());
  async function sbReady() {
    for (let i = 0; i < 60; i++) {
      if (window.zadSupabase?.auth) return window.zadSupabase;
      await new Promise(r => setTimeout(r, 100))
    }
    return null
  }

  function tokenIat(token) {
    try {
      const p = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return Number(p.iat || 0) * 1000
    } catch (_) {
      return 0
    }
  }

  function enrichCard(card, profile, user) {
    if (!card) return;
    let box = card.querySelector('.zadProfileIdentity');
    if (!box) {
      box = document.createElement('div');
      box.className = 'zadProfileIdentity';
      card.querySelector('.zadProfileCopy')?.appendChild(box)
    }
    const name = esc(profile?.username || profile?.display_name || user?.user_metadata?.username || user?.user_metadata?.display_name) || ZadI18n.t("access.58fffe6bec");
    const banned = profile?.account_status === 'banned';
    box.innerHTML = ("<strong>@" + (name) + "</strong><span class=\"zadProfileBadge" + (banned?' bad':'') + "\">" + (banned?ZadI18n.t("access.630d2cffed"):ZadI18n.t("access.8488a53a70")) + "</span><small>" + ZadI18n.html("access.8837e22ea3") + "</small>");
    const av = card.querySelector('.zadProfileAvatar'),
      file = card.querySelector('[data-profile-file]');
    if (av && file && !av.dataset.openPhoto) {
      av.dataset.openPhoto = '1';
      av.title = ZadI18n.t("access.4587134346");
      av.addEventListener('click', () => file.click())
    }
  }
  async function loadAccountState(showMessage = false) {
    const sb = await sbReady();
    if (!sb) return;
    const s = await sb.auth.getSession();
    const session = s.data?.session;
    const user = session?.user;
    if (!user) return;
    const p = await sb.from('profiles').select('username,display_name,avatar_url,account_status,ban_reason,banned_at,force_logout_at').eq('id', user.id).maybeSingle();
    if (p.error) return;
    const profile = p.data || {};
    document.querySelectorAll('.zadProfileCard').forEach(c => enrichCard(c, profile, user));
    const issued = tokenIat(session.access_token || '');
    const force = profile.force_logout_at ? new Date(profile.force_logout_at).getTime() : 0;
    if (profile.account_status === 'banned') {
      if (showMessage || !Zad.session.getItem('zad_ban_notice')) {
        Zad.session.setItem('zad_ban_notice', '1');
        alert(ZadI18n.t("access.6c3ca4d526") + (profile.ban_reason ? ZadI18n.t("access.64bc927df7") + profile.ban_reason : ''))
      }
      await sb.auth.signOut();
      return;
    }
    if (force && issued && force > issued) {
      if (showMessage || !Zad.session.getItem('zad_kick_notice')) {
        Zad.session.setItem('zad_kick_notice', '1');
        alert(ZadI18n.t("access.7f6005e5fb"))
      }
      await sb.auth.signOut();
    }
  }
  async function init() {
    const sb = await sbReady();
    if (!sb) return;
    setTimeout(() => loadAccountState(false), 250);
    sb.auth.onAuthStateChange((_e, s) => {
      if (s) {
        Zad.session.removeItem('zad_kick_notice');
        setTimeout(() => loadAccountState(true), 300)
      }
    });
    setInterval(() => {
      if (!document.hidden) loadAccountState(false)
    }, 30000);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) loadAccountState(false)
    }, {
      passive: true
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {
    once: true
  });
  else init();
})();

