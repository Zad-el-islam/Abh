(function() {
  'use strict';
  const BUCKET = 'zad-profile-avatars';

  function $(s, r = document) {
    return r.querySelector(s)
  }

  function esc(v) {
    return String(v ?? '').trim()
  }
  async function waitSb() {
    for (let i = 0; i < 60; i++) {
      if (window.zadSupabase?.auth && window.zadSupabase?.storage) return window.zadSupabase;
      await new Promise(r => setTimeout(r, 100))
    }
    return null
  }

  function avatarMarkup(url, name) {
    const safe = Zad.mediaURL(url);
    return safe ? ("<img src=\"" + (Zad.escape(safe)) + "\" alt=\"" + ZadI18n.html("profile.5501b1fc9f") + "\">") : `<span>${Zad.escape(String(name||'').slice(0,1))||Zad.icon('user')}</span>`;
  }

  function ensureCard(host, id) {
    if (!host || host.querySelector('.zadProfileCard')) return;
    const card = document.createElement('div');
    card.className = 'zadProfileCard';
    card.dataset.profileCard = id;
    card.innerHTML = ("<div class=\"zadProfileAvatar\" data-profile-avatar></div><div class=\"zadProfileCopy\"><strong>" + ZadI18n.html("profile.5c1fb85841") + "</strong><small>" + ZadI18n.html("profile.80a065c717") + "</small><div class=\"zadProfileActions\"><button type=\"button\" data-profile-pick>" + ZadI18n.html("profile.bdd2cb607f") + "</button><input type=\"file\" data-profile-file accept=\"image/jpeg,image/png,image/webp\" hidden></div><div class=\"zadProfileStatus\" data-profile-status></div></div>");
    const box = host.querySelector('.zadAuthUserBox,.zadPanelUserBox');
    if (box) box.insertAdjacentElement('afterend', card);
    else host.prepend(card);
    const pick = card.querySelector('[data-profile-pick]'),
      file = card.querySelector('[data-profile-file]');
    pick?.addEventListener('click', () => file?.click());
    file?.addEventListener('change', () => uploadAvatar(file.files?.[0], card));
  }

  function ensureUI() {
    ensureCard($('#zadAuthLogged'), 'main');
    ensureCard($('#zadPanelLoggedChoice'), 'panel')
  }

  function paint(profile, user) {
    ensureUI();
    const name = profile?.username || profile?.display_name || user?.user_metadata?.username || ZadI18n.t("access.58fffe6bec");
    const url = Zad.mediaURL(profile?.avatar_url || user?.user_metadata?.avatar_url);
    document.querySelectorAll('[data-profile-avatar]').forEach(x => x.innerHTML = avatarMarkup(url, name));
    const toggle = $('#zadMyPanelToggle');
    if (toggle) {
      toggle.classList.toggle('zadHasAvatar', !!url);
      toggle.innerHTML = url ? avatarMarkup(url, name) : Zad.icon('user');
      toggle.setAttribute('aria-label', ZadI18n.t("settings.66dcee1f46"));
    }
  }
  async function loadProfile(user) {
    ensureUI();
    if (!user) {
      paint(null, null);
      return
    }
    const sb = await waitSb();
    if (!sb) return;
    const p = await sb.from('profiles').select('username,display_name,avatar_url').eq('id', user.id).maybeSingle();
    paint(p.data || null, user)
  }
  async function uploadAvatar(file, card) {
    const status = card?.querySelector('[data-profile-status]');
    const set = (m, bad = false) => {
      if (status) {
        status.textContent = m;
        status.style.color = bad ? 'var(--color-danger)' : 'var(--muted)'
      }
    };
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return set(ZadI18n.t("profile.8e46e26896"), true);
    if (!file.size || file.size > 5 * 1024 * 1024) return set(ZadI18n.t("profile.080c3fce7b"), true);
    if (!(await Zad.fileSignature(file, 'image').catch(() => false))) return set(ZadI18n.t("profile.a788b398b6"), true);
    const sb = await waitSb();
    if (!sb) return set(ZadI18n.t("profile.6bc4197cc5"), true);
    const s = await sb.auth.getSession();
    const user = s.data?.session?.user;
    if (!user) return set(ZadI18n.t("profile.8d700b3aab"), true);
    set(ZadI18n.t("profile.7a14527971"));
    try {
      const path = `${user.id}/avatar`;
      const up = await sb.storage.from(BUCKET).upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '3600'
      });
      if (up.error) throw up.error;
      const pub = sb.storage.from(BUCKET).getPublicUrl(path);
      const url = pub.data?.publicUrl || '';
      if (!url) throw new Error(ZadI18n.t("profile.e3b5ab81d8"));
      const p = await sb.from('profiles').update({
        avatar_url: url,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      if (p.error) throw p.error;
      await sb.auth.updateUser({
        data: {
          ...user.user_metadata,
          avatar_url: url
        }
      }).catch(() => {});
      set(ZadI18n.t("profile.699f0ec44f"));
      await loadProfile(user);
    } catch (e) {
      set(Zad.errorText(e, ZadI18n.t("profile.14856702fe")), true)
    }
  }
  async function init() {
    ensureUI();
    const sb = await waitSb();
    if (!sb) return;
    const s = await sb.auth.getSession();
    await loadProfile(s.data?.session?.user || null);
    sb.auth.onAuthStateChange((_e, session) => setTimeout(() => loadProfile(session?.user || null), 0))
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {
    once: true
  });
  else init();
  window.zadRefreshProfileAvatar = init;
})();

