/* Auth-linked roles and legacy sessions are verified by the server on every request. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id),
    esc = Zad.escape,
    SESSION = 'zad_admin_session_v2';
  const staffClient = window.supabase.createClient(Zad.config.url,Zad.config.key,{auth:{storage:Zad.session,storageKey:'zad_staff_auth_v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
  const roleLabel = role => ({owner:'المالك · OWNER',admin:'مدير · ADMIN',moderator:'مشرف · MODERATOR',user:'مستخدم · USER'}[role] || 'مستخدم · USER');
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
    if (saved && (saved.kind === 'auth' || typeof saved.token === 'string' && saved.token.length <= 256) && Number(saved.expires) > Date.now() && Number(saved.expires) <= Date.now() + 12 * 3600000) session = saved;
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
    $('commentsGrid').textContent = '';
    $('staffGrid').textContent = '';
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
    const headers={apikey:Zad.config.key,'content-type':'application/json'};
    if(auth&&session.kind==='auth'){const current=await staffClient.auth.getSession();const token=current.data?.session?.access_token;if(!token){clearSession();throw new Error('session expired');}headers.authorization='Bearer '+token;}
    const r = await Zad.fetch(Zad.config.url + '/functions/v1/' + name, {
      method: 'POST',
      headers,
      body: JSON.stringify(auth ? {
        ...body,
        ...(session.kind!=='auth'?{token:session.token}:{})
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
    $('adminName').textContent = (session.name || 'الإدارة')+' · '+roleLabel(session.role);
    document.querySelector('[data-tab="users"]').classList.toggle('hidden',session.role==='moderator');
    $('ownerStaff').classList.toggle('hidden',session.role!=='owner');
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
      if(data.auth_session){const result=await staffClient.auth.setSession(data.auth_session);if(result.error)throw result.error;}
      else if(typeof data.session_token!=='string'||!data.session_token)throw new Error('invalid response');
      session={kind:data.auth_session?'auth':'legacy',...(data.auth_session?{}:{token:data.session_token}),role:data.role||'admin',name:String(data.admin_display_name||$('adminUser').value),expires:Math.min(Date.parse(data.expires_at)||Date.now()+12*3600000,Date.now()+12*3600000)};
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
    const token = session?.token, authLinked=session?.kind==='auth';
    clearSession();
    $('adminUser').focus();
    if(authLinked){const result=await staffClient.auth.signOut();if(result.error)message('loginStatus','تعذر تأكيد تسجيل الخروج من الخادم.',true);}
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
    if(session?.role==='moderator')return;
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
      const title=card.querySelector('h3');title.textContent=user.display_name||user.username||'مستخدم';
      const role=document.createElement('span');role.className='badge';role.textContent=roleLabel(user.role);title.after(role);
      const handle=document.createElement('p');handle.className='meta';handle.dir='ltr';handle.textContent='@'+(user.username||'');role.after(handle);
      if(user.role==='owner'||session.role!=='owner'&&user.role&&user.role!=='user')card.querySelector('.admin-actions').remove();
      if(session.role==='owner'&&user.role!=='owner'){
        const field=document.createElement('label');field.textContent='الصلاحية';const select=document.createElement('select');
        for(const value of ['user','moderator','admin']){const o=document.createElement('option');o.value=value;o.textContent=roleLabel(value);select.append(o);}select.value=user.role||'user';field.append(select);card.append(field);
        select.addEventListener('change',()=>{const next=select.value;if(!confirm('تغيير صلاحية @'+user.username+' إلى '+roleLabel(next)+'؟')){select.value=user.role||'user';return;}action('zad-admin-users',{action:'set_role',user_id:user.id,role:next},'تم تحديث الصلاحية.');});
      }
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
      document.querySelectorAll('#commentsGrid [data-act],#staffGrid [data-act]').forEach(b=>b.disabled=false);
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
    if (kind === 'kick' && !confirm('تسجيل خروج @' + name + ' من جميع الأجهزة؟')) return;
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
      if (reason === null || !confirm('تأكيد رفض المقطع أو إلغاء نشره؟')) return;
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
    await Promise.all([loadUsers(), loadVideos(),loadComments(true),loadStaff()]);
  }

  let commentOffset=0, commentRequest=0;
  async function loadComments(reset=true){const request=++commentRequest;if(reset)commentOffset=0;$('refreshComments').disabled=true;$('moreComments').disabled=true;message('commentsState','جارٍ تحميل التعليقات…');try{
    const data=await api('zad-admin-comments',{action:'list',q:$('commentSearch').value.trim(),offset:commentOffset});if(request!==commentRequest||!session)return;
    if(reset)$('commentsGrid').textContent='';
    for(const c of data.comments||[]){const card=document.createElement('article');card.className='admin-card';card.innerHTML=`<h3 dir="auto">${esc(c.profile?.display_name||c.profile?.username||'مستخدم')}</h3><p class="meta">@${esc(c.profile?.username||'')} · ${esc(date(c.created_at))}</p><p dir="auto">${esc(c.body)}</p><p class="meta" dir="auto">${esc(c.zad_talk_submissions?.title||'')} · ${c.status==='hidden'?'مخفي':'ظاهر'}</p>${c.status!=='hidden'?'<button type="button" class="secondary" data-act="hide">إخفاء التعليق</button>':''}`;
    card.querySelector('[data-act]')?.addEventListener('click',()=>{if(confirm('إخفاء هذا التعليق وردوده من العرض العام؟'))action('zad-admin-comments',{action:'hide',comment_id:c.id},'تم إخفاء التعليق.');});$('commentsGrid').append(card);}
    commentOffset=data.next_offset;$('moreComments').classList.toggle('hidden',!data.has_more);message('commentsState',$('commentsGrid').children.length?'':'لا توجد تعليقات مطابقة.');
  }catch(e){message('commentsState',friendly(e),true);}finally{if(request===commentRequest){$('refreshComments').disabled=false;$('moreComments').disabled=false;}}}
  async function loadStaff(){if(session?.role!=='owner')return;try{const data=await api('zad-admin-users',{action:'list_staff'});if(session?.role!=='owner')return;$('staffGrid').textContent='';for(const staff of (data.staff||[]).filter(x=>!x.user_id)){const card=document.createElement('article');card.className='admin-card';card.innerHTML=`<h3 dir="auto">${esc(staff.display_name||staff.username)}</h3><p class="meta">${esc(roleLabel(staff.role))} · ${staff.is_active?'نشط':'موقوف'}</p><button type="button" class="secondary" data-act="legacy">${staff.is_active?'إيقاف الدخول':'تفعيل الدخول'}</button>`;card.querySelector('button').addEventListener('click',()=>{if(confirm((staff.is_active?'إيقاف دخول حساب الإدارة وإلغاء جلساته: ':'تفعيل دخول حساب الإدارة: ')+staff.username+'؟'))action('zad-admin-users',{action:'legacy_access',admin_id:staff.id,active:!staff.is_active},'تم تحديث دخول الإدارة.');});$('staffGrid').append(card);}}catch(e){message('appStatus',friendly(e),true);}}
  $('refreshComments').addEventListener('click',()=>loadComments(true));$('moreComments').addEventListener('click',()=>loadComments(false));let commentTimer;$('commentSearch').addEventListener('input',()=>{clearTimeout(commentTimer);commentTimer=setTimeout(()=>loadComments(true),300);});
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
      $('commentsPane').classList.toggle('hidden', b.dataset.tab !== 'comments');
      document.querySelectorAll('video').forEach(v => v.pause());
    });
    b.addEventListener('keydown', e => {
      if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        const visible=tabs.filter(t=>!t.classList.contains('hidden')), index=visible.indexOf(b);
        const next=e.key==='Home'?visible[0]:e.key==='End'?visible.at(-1):visible[(index+(e.key==='ArrowRight'?1:-1)+visible.length)%visible.length];
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
    api('zad-admin-auth',{action:'me'}).then(data=>{session.role=data.role;session.name=data.admin_display_name||session.name;showApp();loadAll();}).catch(()=>clearSession());
  }
})();
