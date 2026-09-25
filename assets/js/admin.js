/* The server verifies the custom admin session for every operation. UI state grants no authority. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id),
    esc = Zad.escape,
    SESSION = 'zad_admin_session_v2';
  const labels = {
    pending: 'بانتظار المراجعة',
    approved: 'منشور',
    rejected: 'مرفوض',
    uploading: 'قيد الرفع'
  };
  let session = null,
    users = [],
    videos = [],
    userRequest = 0,
    videoRequest = 0,
    actionBusy = false;
  Zad.storage.removeItem('zad_admin_token');
  Zad.storage.removeItem('zad_admin_name');
  try {
    const saved = JSON.parse(Zad.session.getItem(SESSION));
    if (saved && typeof saved.token === 'string' && saved.token.length <= 256 && Number(saved.expires) > Date.now() && Number(saved.expires) <= Date.now() + 12 * 3600000) session = saved;
    else Zad.session.removeItem(SESSION);
  } catch (_) {
    Zad.session.removeItem(SESSION);
  }

  function message(id, text, bad = false) {
    $(id).textContent = text;
    $(id).classList.toggle('bad', bad);
  }

  function clearSession() {
    session = null;
    Zad.session.removeItem(SESSION);
    document.querySelectorAll('video').forEach(v => v.pause());
    $('appView').classList.add('hidden');
    $('loginView').classList.remove('hidden');
    $('logoutBtn').classList.add('hidden');
    $('adminName').textContent = '';
    users = [];
    videos = [];
    $('usersGrid').textContent = '';
    $('videosGrid').textContent = '';
  }

  function friendly(error) {
    if (error?.status === 429) return 'محاولات كثيرة. انتظر ١٥ دقيقة قبل المحاولة مجددًا.';
    if (error?.status === 403) return 'هذا الحساب أو عنوان الموقع غير مسموح له بتنفيذ الطلب.';
    return Zad.errorText(error, 'تعذر الاتصال بالخادم الآن. تحقق من الاتصال وحاول مرة أخرى.');
  }
  async function api(name, body, auth = true) {
    if (auth && (!session || session.expires <= Date.now())) {
      clearSession();
      throw new Error('session expired');
    }
    const r = await Zad.fetch(Zad.config.url + '/functions/v1/' + name, {
      method: 'POST',
      headers: {
        apikey: Zad.config.key,
        'content-type': 'application/json'
      },
      body: JSON.stringify(auth ? {
        ...body,
        token: session.token
      } : body)
    });
    let data;
    try {
      data = await r.json();
    } catch (_) {
      throw new Error('invalid response');
    }
    if (!r.ok || data.ok === false) {
      const error = new Error(data.error || 'request failed');
      error.status = r.status;
      if (auth && r.status === 401) {
        clearSession();
        message('loginStatus', 'انتهت جلسة الإدارة. سجّل الدخول من جديد.', true);
      }
      throw error;
    }
    return data;
  }

  function showApp() {
    if (!session) return;
    $('loginView').classList.add('hidden');
    $('appView').classList.remove('hidden');
    $('logoutBtn').classList.remove('hidden');
    $('adminName').textContent = session.name || 'الإدارة';
  }
  async function login(e) {
    e.preventDefault();
    if ($('loginBtn').disabled) return;
    $('loginBtn').disabled = true;
    message('loginStatus', 'جارٍ التحقق…');
    try {
      const data = await api('zad-admin-auth', {
        action: 'login',
        username: $('adminUser').value.trim(),
        password: $('adminPass').value
      }, false);
      if (typeof data.session_token !== 'string' || !data.session_token) throw new Error('invalid response');
      session = {
        token: data.session_token,
        name: String(data.admin_display_name || $('adminUser').value),
        expires: Date.now() + 12 * 3600000
      };
      Zad.session.setItem(SESSION, JSON.stringify(session));
      $('adminPass').value = '';
      message('loginStatus', '');
      showApp();
      await loadAll();
    } catch (error) {
      message('loginStatus', error.status === 401 ? 'اسم المستخدم أو كلمة المرور غير صحيحة.' : friendly(error), true);
    } finally {
      $('loginBtn').disabled = false;
    }
  }
  async function logout() {
    const token = session?.token;
    clearSession();
    $('adminUser').focus();
    if (token) try {
      await api('zad-admin-auth', {
        action: 'logout',
        token
      }, false);
    } catch (_) {
      message('loginStatus', 'تم تسجيل الخروج من هذا الجهاز. تعذر تأكيد إلغاء الجلسة على الخادم؛ ستنتهي خلال ١٢ ساعة.', true);
    }
  }

  function date(value) {
    try {
      return new Intl.DateTimeFormat('ar-EG', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value));
    } catch (_) {
      return '—';
    }
  }
  const number = value => Math.max(0, Number(value) || 0).toLocaleString('ar-EG');
  async function loadUsers() {
    const request = ++userRequest;
    $('refreshUsers').disabled = true;
    message('usersState', 'جارٍ تحميل الحسابات…');
    try {
      const data = await api('zad-admin-users', {
        action: 'list',
        q: $('userSearch').value.trim()
      });
      if (request !== userRequest || !session) return;
      users = Array.isArray(data.users) ? data.users : [];
      renderUsers();
      message('usersState', users.length ? '' : 'لا توجد حسابات مطابقة.');
    } catch (error) {
      message('usersState', friendly(error) + ' استخدم زر «تحديث الحسابات» للمحاولة.', true);
    } finally {
      if (request === userRequest) $('refreshUsers').disabled = false;
    }
  }

  function renderUsers() {
    const grid = $('usersGrid');
    grid.textContent = '';
    for (const user of users) {
      const card = document.createElement('article');
      card.className = 'admin-card';
      const name = String(user.username || user.display_name || 'مستخدم زاد الإسلام'),
        avatar = Zad.mediaURL(user.avatar_url),
        banned = user.account_status === 'banned';
      card.innerHTML = `<div class="admin-user-head"><div class="admin-avatar">${avatar?`<img src="${esc(avatar)}" alt="" loading="lazy">`:esc(name.slice(0,1))}</div><div><h3 dir="auto">@${esc(name)}</h3><div class="meta">${number(user.video_count)} مقطع · أُنشئ ${esc(date(user.created_at))}</div><span class="badge ${banned?'banned':''}">${banned?'محظور':'نشط'}</span></div></div>${user.ban_reason?`<p class="meta">سبب الحظر: ${esc(user.ban_reason)}</p>`:''}<div class="admin-actions"><button type="button" class="secondary" data-act="kick">تسجيل خروج الحساب</button><button type="button" class="secondary" data-act="${banned?'unban':'ban'}">${banned?'فك الحظر':'حظر الحساب والاتصال'}</button><button type="button" class="danger" data-act="delete">حذف الحساب</button></div>`;
      card.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => userAction(user, b.dataset.act)));
      grid.append(card);
    }
    $('sUsers').textContent = number(users.length);
    $('sBanned').textContent = number(users.filter(u => u.account_status === 'banned').length);
  }
  async function loadVideos() {
    const request = ++videoRequest;
    $('refreshVideos').disabled = true;
    message('videosState', 'جارٍ تحميل المقاطع…');
    try {
      const data = await api('zad-talk-admin-list', {
        status: $('videoStatus').value
      });
      if (request !== videoRequest || !session) return;
      videos = Array.isArray(data.items) ? data.items : [];
      renderVideos();
      message('videosState', '');
    } catch (error) {
      message('videosState', friendly(error) + ' استخدم زر «تحديث المقاطع» للمحاولة.', true);
    } finally {
      if (request === videoRequest) $('refreshVideos').disabled = false;
    }
  }

  function renderVideos() {
    const q = Zad.normalize($('videoSearch').value),
      items = videos.filter(v => !q || Zad.normalize(v.title + ' ' + (v.submitter_name || '')).includes(q)),
      grid = $('videosGrid');
    grid.querySelectorAll('video').forEach(v => v.pause());
    grid.textContent = '';
    if (!items.length) grid.innerHTML = '<p class="empty-state">لا توجد مقاطع مطابقة.</p>';
    for (const video of items) {
      const card = document.createElement('article');
      card.className = 'admin-card';
      const url = Zad.mediaURL(video.media_url);
      card.innerHTML = `${url?`<video src="${esc(url)}" controls playsinline preload="none" aria-label="${esc(video.title||'مقطع للمراجعة')}"></video>`:'<p class="notice">معاينة المقطع غير متاحة. حدّث القائمة قبل المراجعة.</p>'}<h3 dir="auto">${esc(video.title)}</h3><p class="meta">الناشر: ${esc(video.submitter_name||'بدون حساب')} · ${esc(labels[video.status]||video.status)} · ${esc(date(video.created_at))}</p>${video.rejection_reason?`<p class="meta">سبب الرفض: ${esc(video.rejection_reason)}</p>`:''}<div class="admin-actions">${video.status!=='approved'?`<button type="button" data-act="approve" ${!url||video.status==='uploading'?'disabled':''}>اعتماد ونشر</button>`:''}${video.status!=='rejected'?'<button type="button" data-act="reject" class="secondary">رفض / إلغاء النشر</button>':''}<button type="button" data-act="delete" class="danger">حذف المقطع</button></div>`;
      card.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => videoAction(video, b.dataset.act)));
      card.querySelector('video')?.addEventListener('play', e => document.querySelectorAll('video').forEach(v => {
        if (v !== e.target) v.pause();
      }));
      grid.append(card);
    }
    $('sVideos').textContent = number(videos.length);
    $('sPending').textContent = number(videos.filter(v => v.status === 'pending').length);
  }
  async function action(name, body, success) {
    if (actionBusy) return;
    actionBusy = true;
    document.querySelectorAll('[data-act]').forEach(b => b.disabled = true);
    message('appStatus', 'جارٍ تنفيذ العملية…');
    try {
      await api(name, body);
      message('appStatus', success);
      await loadAll();
    } catch (error) {
      message('appStatus', friendly(error), true);
      renderUsers();
      renderVideos();
    } finally {
      actionBusy = false;
    }
  }
  async function userAction(user, kind) {
    if (actionBusy) return;
    const name = String(user.username || user.display_name || user.id);
    let reason = null;
    if (kind === 'ban') {
      reason = prompt('سبب حظر @' + name + ' (اختياري):', '');
      if (reason === null) return;
      if (!confirm('سيُحظر الحساب وعناوين الاتصال المرتبطة به حتى فك الحظر. هل تؤكد؟')) return;
    }
    if (kind === 'unban' && !confirm('فك حظر @' + name + ' وكل عناوين الاتصال المرتبطة به؟')) return;
    if (kind === 'kick' && !confirm('طلب تسجيل خروج @' + name + ' من واجهة الموقع؟ قد يستغرق ظهوره حتى التحقق التالي.')) return;
    if (kind === 'delete' && prompt('سيُحذف الحساب @' + name + ' نهائيًا مع مقاطعه وتعليقاته وتفاعلاته. لا يمكن التراجع. اكتب «حذف» للتأكيد:') !== 'حذف') return;
    await action('zad-admin-users', {
      action: kind,
      user_id: user.id,
      reason: reason?.slice(0, 500) || null
    }, 'تم تحديث الحساب.');
  }
  async function videoAction(video, kind) {
    if (actionBusy) return;
    let reason = null;
    if (kind === 'reject') {
      reason = prompt('سبب رفض المقطع أو إلغاء نشره (اختياري):', '');
      if (reason === null) return;
    }
    if (kind === 'approve' && !confirm('اعتماد ونشر المقطع «' + String(video.title || '') + '» للعامة؟')) return;
    if (kind === 'delete' && !confirm('حذف المقطع وملفه نهائيًا؟ لا يمكن التراجع.')) return;
    await action('zad-talk-admin-review', {
      action: kind,
      id: video.id,
      reason: reason?.slice(0, 500) || null
    }, 'تم تحديث المقطع.');
  }
  async function loadAll() {
    await Promise.all([loadUsers(), loadVideos()]);
  }
  $('loginForm').addEventListener('submit', login);
  $('logoutBtn').addEventListener('click', logout);
  $('refreshUsers').addEventListener('click', loadUsers);
  $('refreshVideos').addEventListener('click', loadVideos);
  $('refreshAll').addEventListener('click', loadAll);
  $('videoStatus').addEventListener('change', loadVideos);
  $('videoSearch').addEventListener('input', renderVideos);
  let timer;
  $('userSearch').addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(loadUsers, 300);
  });
  const tabs = [...document.querySelectorAll('[data-tab]')];
  tabs.forEach(b => {
    b.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.toggle('active', t === b);
        t.setAttribute('aria-selected', String(t === b));
      });
      $('videosPane').classList.toggle('hidden', b.dataset.tab !== 'videos');
      $('usersPane').classList.toggle('hidden', b.dataset.tab !== 'users');
      document.querySelectorAll('video').forEach(v => v.pause());
    });
    b.addEventListener('keydown', e => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        const next = e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs.at(-1) : tabs.find(t => t !== b);
        next.click();
        next.focus();
      }
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelectorAll('video').forEach(v => v.pause());
    else if (session && session.expires <= Date.now()) {
      clearSession();
      message('loginStatus', 'انتهت جلسة الإدارة. سجّل الدخول من جديد.', true);
    }
  });
  if (session) {
    showApp();
    loadAll();
  }
})();
