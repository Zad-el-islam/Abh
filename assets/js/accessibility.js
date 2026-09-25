/* Focus, keyboard navigation and semantics for the retained module dialogs. */
(() => {
  'use strict';
  const closers = {
    zadAuthOverlay: () => zadCloseAuth(),
    zadMyPanelOverlay: () => zadCloseMyPanelPage(),
    zadLeaderboardOverlay: () => zadCloseLeaderboard?.(),
    zadStatsOverlay: () => zadCloseStats?.(),
    v21LanguagePanel: () => v21CloseLanguage(),
    zadPointsPanel: () => zadClosePointsPanel(),
    zadHelpModal: () => closeZadHelp(),
    zadTalkCommentsSheet: () => document.querySelector('[data-zt-comments-close]')?.click(),
    zadTalkLeaderboardSheet: () => document.querySelector('[data-zt-rank-close]')?.click()
  };
  const visible = el => el.id === 'zadPointsPanel' ? !el.classList.contains('hidden') : el.classList.contains('open') || el.classList.contains('show');
  const tracked = new Map();
  let active = null,
    queued = false;
  const focusable = root => [...root.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(el => !el.closest('[hidden],.hidden,[aria-hidden="true"]') && getComputedStyle(el).display !== 'none');

  function update() {
    queued = false;
    for (const [id, close] of Object.entries(closers)) {
      const el = document.getElementById(id);
      if (!el) continue;
      let state = tracked.get(el);
      if (!state) {
        state = {
          open: false,
          trigger: null
        };
        tracked.set(el, state);
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        el.tabIndex = -1;
        const h = el.querySelector('h2,h3,strong');
        if (h) {
          if (!h.id) h.id = id + 'Label';
          el.setAttribute('aria-labelledby', h.id);
        } else el.setAttribute('aria-label', ZadI18n.t("accessibility.aab880ce66"));
        el.addEventListener('click', e => {
          if (e.target === el) close();
        });
      }
      const open = visible(el);
      el.setAttribute('aria-hidden', String(!open));
      if (open && !state.open) {
        state.trigger = document.activeElement;
        state.open = true;
        active = el;
        queueMicrotask(() => {
          (focusable(el)[0] || el).focus({
            preventScroll: true
          });
        });
      }
      if (!open && state.open) {
        state.open = false;
        if (active === el) active = null;
        if (state.trigger?.isConnected) state.trigger.focus({
          preventScroll: true
        });
      }
    }
    const shown = [...tracked].filter(([el, s]) => el.isConnected && s.open).map(([el]) => el);
    active = shown.at(-1) || null;
    document.querySelectorAll('.site-header,#mainContent,.site-footer,#contextBar').forEach(el => {
      el.inert = !!active;
    });
    if (active) document.documentElement.style.overflow = 'hidden';
    else if (!document.querySelector('dialog[open]')) document.documentElement.style.overflow = '';
  }
  const observer = new MutationObserver(() => {
    if (!queued) {
      queued = true;
      queueMicrotask(update);
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['class']
  });
  document.addEventListener('keydown', e => {
    if (!active) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closers[active.id]?.();
      return;
    }
    if (e.key === 'Tab') {
      const items = focusable(active),
        first = items[0],
        last = items.at(-1);
      if (!first) {
        e.preventDefault();
        active.focus();
        return;
      }
      if (e.shiftKey && (document.activeElement === first || !active.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !active.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener('keydown', e => {
    const tab = e.target.closest?.('[role=tab]');
    if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const tabs = [...tab.parentElement.querySelectorAll('[role=tab]')];
    let index = tabs.indexOf(tab);
    const rtl = document.dir === 'rtl';
    if (e.key === 'Home') index = 0;
    else if (e.key === 'End') index = tabs.length - 1;
    else index = (index + (e.key === 'ArrowRight' ? (rtl ? -1 : 1) : (rtl ? 1 : -1)) + tabs.length) % tabs.length;
    e.preventDefault();
    tabs[index].click();
    tabs[index].focus();
  });
  // Decorative emoji are removed only from interface nodes, never from source or user content.
  function tidyUI(scope) {
    const iconTargets = '.heartFeatureIcon,.zadBookGlyph,.v21SeerahSourceIcon,.glyph,.v21KnowledgeDisclaimerIcon,.zadComingIcon';
    scope.querySelectorAll?.(iconTargets).forEach(el => {
      el.innerHTML = Zad.icon(el.classList.contains('heartFeatureIcon') ? 'heart' : 'book');
    });
    const source = '.v22Arabic,.v22Translation,.ayahText,.qvArabic,.qvTranslation,.hadithText,.hadithMeta,.heartDhikrText,.verse,.heartDailyItem p,.heartDailyItem .heartSource,.zadSource,.zadText,#zadDailyText,.heartWord p,.heartRemedyVerse,.heartRemedyHadith,.heartRemedyDua,.ztClipTitle,.ztCreatorLine,.ztCommentBody,.zadProfileIdentity,.book-cover';
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.parentElement && !n.parentElement.closest('script,style,' + source) && n.parentElement.closest('button,.glyph,.v21SeerahSourceIcon,.v21PlayerPlaceholder,.zadPointsRank,.zadRankRewardIcon,.zadRankStepIcon,h1,h2,h3,.zadPointsNextText')) nodes.push(n);
    }
    for (const n of nodes) n.nodeValue = n.nodeValue.replace(/\p{Extended_Pictographic}\uFE0F?|\uFE0F/gu, '');
    scope.querySelectorAll?.('button').forEach(b => {
      if (!b.hasAttribute('type')) b.type = 'button';
      if (!b.textContent.trim() && !b.hasAttribute('aria-label')) b.setAttribute('aria-label', b.title || (ZadI18n.t("settings.ca90c297b0")));
    });
    scope.querySelectorAll?.('a[target="_blank"]').forEach(a => a.rel = 'noopener noreferrer');
  }
  tidyUI(document.body);
  // Restrict content clean-up to explicit renders, avoiding a perpetual mutation loop.
  document.addEventListener('zad:route', () => tidyUI(document.body));
  document.addEventListener('click', e => {
    if (e.target.closest('.heartTabs,.heartMoodGrid,.zadTabs,.v21MediaTabs,.v22QModes')) setTimeout(() => tidyUI(document.getElementById('mainContent')), 0);
  });
  update();
})();

