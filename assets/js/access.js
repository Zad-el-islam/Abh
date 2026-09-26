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
    const name = esc(profile?.display_name || profile?.username) || ZadI18n.t("access.58fffe6bec");
    const handle = esc(profile?.username || '');
    const banned = profile?.account_status === 'banned';
    box.innerHTML = `<strong dir="auto">${name}</strong>${handle?`<small dir="ltr">@${handle}</small>`:''}<span class="zadProfileBadge${banned?' bad':''}">${ZadI18n.t(banned?'access.630d2cffed':'access.8488a53a70')}</span>${profile.role==='owner'?`<span class="zadProfileBadge" data-i18n="roles.owner">${ZadI18n.t('roles.owner')}</span>`:''}${['owner','admin','moderator'].includes(profile.role)?`<a href="admin.html" data-i18n="roles.panel">${ZadI18n.t('roles.panel')}</a>`:''}`;
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
    const check = await Zad.fetch(Zad.config.url + '/functions/v1/zad-access-check', {
      method: 'POST',
      headers: { apikey: Zad.config.key, authorization: 'Bearer ' + session.access_token, 'content-type': 'application/json' },
      body: '{}'
    }).catch(() => null);
    if (check && [401, 403].includes(check.status)) {
      const result = await check.json().catch(() => ({}));
      const banned = ['account_banned', 'ip_banned'].includes(result.error);
      if (showMessage) alert(ZadI18n.t(banned ? 'access.6c3ca4d526' : 'access.7f6005e5fb'));
      await sb.auth.signOut({ scope: 'local' });
      return;
    }
    if (!check?.ok) return;
    const p = await sb.from('profiles').select('username,display_name,avatar_url,account_status,ban_reason,banned_at,force_logout_at').eq('id', user.id).maybeSingle();
    if (p.error) return;
    const profile = p.data || {};
    const verified = await check.json().catch(()=>({}));
    profile.role = verified.role || 'user';
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
