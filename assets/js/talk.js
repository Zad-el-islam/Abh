(function() {
  'use strict';

  const ZT_SB = 'https://bzrhrvgddtnhctcdlgmy.supabase.co';
  const ZT_KEY = 'sb_publishable_HzCPiZYRuFb3hm_duGCHVA_J020y2YL';
  const ZT_FN = ZT_SB + '/functions/v1/';
  let ztOffset = 0;
  let ztLoading = false;
  let ztHasMore = true;
  let ztObserver = null;
  const ztRequestedId = (() => {
    try {
      return new URLSearchParams(location.search).get('zad_talk') || ''
    } catch (_) {
      return ''
    }
  })();

  function ztDeepLink(id) {
    const u = new URL(location.href);
    u.searchParams.set('zad_talk', String(id));
    u.hash = 'media';
    return u.href;
  }

  async function ztShareClip(item, button, article) {
    const id = String(item?.id || '').trim();
    if (!id) return;
    const url = ztDeepLink(id);
    const title = ztEscText(item?.title) || ZadI18n.t("talk.48988cb485");
    let completed = false;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          get text() { return ZadI18n.t("talk.f36f66cd88"); },
          url
        });
        completed = true;
      } else {
        await navigator.clipboard.writeText(url);
        completed = true;
        const old = button?.querySelector('.ztActionLabel')?.textContent || button?.textContent;
        const lab = button?.querySelector('.ztActionLabel');
        if (lab) {
          lab.textContent = ZadI18n.t("talk.b46c53fdcf");
          setTimeout(() => lab.textContent = old || ZadI18n.t("talk.ace24891ce"), 1400)
        }
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      try {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        completed = true;
      } catch (_) {}
    }
    if (completed) {
      try {
        const stats = await ztEdge('zad-talk-social', {
          action: 'share',
          id
        });
        const count = article?.querySelector('[data-zt-share-count]');
        if (count) count.textContent = ztFormatCount(stats.share_count || 0);
      } catch (_) {}
    }
  }
  async function ztAuthToken() {
    try {
      const sb = window.zadSupabase;
      if (!sb?.auth) return '';
      const s = await sb.auth.getSession();
      return s.data?.session?.access_token || '';
    } catch (_) {
      return ''
    }
  }

  async function ztEdge(name, body) {
    const token = await ztAuthToken();
    const headers = {
      'apikey': ZT_KEY,
      'content-type': 'application/json'
    };
    if (token) headers.authorization = 'Bearer ' + token;
    const r = await Zad.fetch(ZT_FN + name, {
      method: 'POST',
      headers,
      body: JSON.stringify(body || {})
    });
    const text = await r.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {}
    } catch (_) {}
    if (!r.ok) throw new Error(data.message || data.error || ZadI18n.t("talk.b0ac4a192e"));
    return data;
  }

  function ztEscText(v) {
    return String(v ?? '').trim()
  }

  function ztFormatCount(n) { return new Intl.NumberFormat(ZadI18n.locale, {notation:'compact',maximumFractionDigits:1}).format(Number(n)||0); }

  function ztAvatarHTML(url, name = '') {
    const safe = Zad.mediaURL(url);
    return safe ? `<img src="${Zad.escape(safe)}" alt="" loading="lazy" data-fallback="${Zad.escape(String(name).slice(0,1))}">` : `<span>${Zad.escape(String(name).slice(0,1))||Zad.icon('user')}</span>`;
  }

  function ztEnsureFeed() {
    const pane = document.querySelector('[data-v21-media-pane="watch"]');
    if (!pane) return null;
    let shell = pane.querySelector('#zadTalkFeed');
    if (shell) return shell;
    pane.innerHTML = ("<div class=\"zadTalkWatchTop\"><div class=\"ztWatchTitle\"><strong>" + ZadI18n.html("gateways.fe99b36520") + "</strong><small>" + ZadI18n.html("talk.4a6331444d") + "</small></div><button type=\"button\" id=\"ztLeaderboardBtn\" class=\"ztLeaderboardBtn\">" + ZadI18n.html("talk.38bb230f93") + "</button></div><div id=\"zadTalkFeed\" class=\"zadTalkFeedShell\"></div><div id=\"zadTalkFeedState\" class=\"zadTalkFeedState\">" + ZadI18n.html("talk.36c689432d") + "</div><button type=\"button\" id=\"zadTalkMore\" class=\"zadTalkMore hidden\">" + ZadI18n.html("talk.4ec10c8064") + "</button>");
    shell = pane.querySelector('#zadTalkFeed');
    pane.querySelector('#zadTalkMore')?.addEventListener('click', () => ztLoadFeed(false));
    pane.querySelector('#ztLeaderboardBtn')?.addEventListener('click', ztOpenLeaderboard);
    ztOffset = 0;
    ztHasMore = true;
    ztEnsureCommentsSheet();
    ztEnsureLeaderboardSheet();
    ztAttachDesktopWheel(shell);
    return shell;
  }

  let ztWheelBusy = false;

  function ztAttachDesktopWheel(shell) {
    /* Native page scrolling is intentionally retained. */ }

  function ztEnsureLeaderboardSheet() {
    let sheet = document.getElementById('zadTalkLeaderboardSheet');
    if (sheet) return sheet;
    sheet = document.createElement('section');
    sheet.id = 'zadTalkLeaderboardSheet';
    sheet.className = 'zadTalkLeaderboardSheet';
    sheet.setAttribute('aria-hidden', 'true');
    sheet.innerHTML = ("<div class=\"ztLeaderboardBackdrop\" data-zt-rank-close></div><div class=\"ztLeaderboardPanel\"><div class=\"ztLeaderboardHead\"><div><small>" + ZadI18n.html("talk.f2f2bed5a5") + "</small><strong>" + ZadI18n.html("talk.38bb230f93") + "</strong></div><button type=\"button\" data-zt-rank-close aria-label=\"" + ZadI18n.html("settings.ca90c297b0") + "\">✕</button></div><div class=\"ztLeaderboardNote\">" + ZadI18n.html("talk.e85632ffc2") + "</div><div class=\"ztLeaderboardList\" id=\"ztLeaderboardList\"><div class=\"ztLeaderboardState\">" + ZadI18n.html("talk.23072eab2c") + "</div></div><button type=\"button\" class=\"ztLeaderboardRefresh\" id=\"ztLeaderboardRefresh\">" + ZadI18n.html("talk.654b0d1dbe") + "</button></div>");
    document.body.appendChild(sheet);
    sheet.querySelectorAll('[data-zt-rank-close]').forEach(x => x.addEventListener('click', ztCloseLeaderboard));
    sheet.querySelector('#ztLeaderboardRefresh')?.addEventListener('click', () => ztLoadLeaderboard(true));
    return sheet;
  }

  function ztCloseLeaderboard() {
    const s = document.getElementById('zadTalkLeaderboardSheet');
    if (!s) return;
    s.classList.remove('open');
    s.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('ztLeaderboardOpen');
  }
  async function ztOpenLeaderboard() {
    const s = ztEnsureLeaderboardSheet();
    s.classList.add('open');
    s.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('ztLeaderboardOpen');
    await ztLoadLeaderboard(false);
  }

  function ztRankMedal(i) {
    return ZadI18n.number(i + 1);
  }
  async function ztLoadLeaderboard(force = false) {
    const list = document.getElementById('ztLeaderboardList');
    if (!list) return;
    if (!force && list.dataset.loaded === '1') return;
    list.innerHTML = ("<div class=\"ztLeaderboardState\">" + ZadI18n.html("talk.23072eab2c") + "</div>");
    try {
      const d = await ztEdge('zad-talk-leaderboard', {
        limit: 12
      });
      const users = Array.isArray(d.users) ? d.users : [];
      list.textContent = '';
      if (!users.length) {
        list.innerHTML = ("<div class=\"ztLeaderboardState\">" + ZadI18n.html("talk.e315466444") + "</div>");
        return
      }
      users.forEach((u, i) => {
        const row = document.createElement('article');
        row.className = 'ztLeaderboardRow';
        const rank = document.createElement('div');
        rank.className = 'ztRankNo';
        rank.dataset.rank=String(i+1);
        rank.textContent = ztRankMedal(i);
        const avatar = document.createElement('div');
        avatar.className = 'ztRankAvatar';
        avatar.innerHTML = ztAvatarHTML(u.avatar_url, u.username || u.display_name || '');
        const copy = document.createElement('div');
        copy.className = 'ztRankCopy';
        const name = document.createElement('strong');
        name.textContent = '@' + (ztEscText(u.username || u.display_name) || ZadI18n.t("talk.85b3bbf3ce"));
        const stats = document.createElement('small');
        stats.dataset.counts=JSON.stringify([u.like_count,u.comment_count,u.share_count,u.video_count]);
        stats.textContent = ZadI18n.t("talk.9ca4c06105", {v0:(ztFormatCount(u.like_count)),v1:(ztFormatCount(u.comment_count)),v2:(ztFormatCount(u.share_count)),v3:(ztFormatCount(u.video_count))});
        copy.append(name, stats);
        const score = document.createElement('b');
        score.className = 'ztRankScore';
        score.dataset.score=String(u.score||0);
        score.innerHTML = ("" + (ztFormatCount(u.score)) + "<small>" + ZadI18n.html("talk.69ff4ac820") + "</small>");
        row.append(rank, avatar, copy, score);
        list.appendChild(row);
      });
      list.dataset.loaded = '1';
    } catch (e) {
      list.innerHTML = ("<div class=\"ztLeaderboardState\">" + ZadI18n.html("talk.f0ea9b6e15") + "</div>")
    }
  }

  let ztCommentOffset=0, ztReplyTo=null, ztCommentBusy=false, ztCommentEpoch=0, ztCommentLoading=false, ztReturnFocus=null;
  function ztEnsureCommentsSheet() {
    let sheet=document.getElementById('zadTalkCommentsSheet');if(sheet)return sheet;
    sheet=document.createElement('section');sheet.id='zadTalkCommentsSheet';sheet.className='zadTalkCommentsSheet';sheet.setAttribute('aria-hidden','true');
    sheet.innerHTML=`<div class="ztCommentsBackdrop" data-zt-comments-close></div><div class="ztCommentsPanel" role="dialog" aria-modal="true" aria-labelledby="ztCommentsTitle"><div class="ztCommentsHead"><strong id="ztCommentsTitle">${ZadI18n.html('talk.5f285a4c6a')}</strong><button type="button" data-zt-comments-close aria-label="${ZadI18n.html('settings.ca90c297b0')}">✕</button></div><div class="ztCommentsList" id="ztCommentsList"></div><button type="button" id="ztCommentsMore" class="secondary hidden" data-i18n="social.more">${ZadI18n.html('social.more')}</button><button type="button" id="ztReplyCancel" class="secondary hidden" data-i18n="social.cancel">${ZadI18n.html('social.cancel')}</button><div class="ztCommentComposer"><input id="ztCommentInput" maxlength="500" placeholder="${ZadI18n.html('talk.029d5fc7bd')}"><button type="button" id="ztCommentSend">${ZadI18n.html('talk.8b1e3b105d')}</button></div><div class="ztCommentsStatus" id="ztCommentsStatus" role="status"></div></div>`;
    document.body.append(sheet);
    sheet.querySelectorAll('[data-zt-comments-close]').forEach(b=>b.addEventListener('click',ztCloseComments));
    sheet.querySelector('#ztCommentSend').addEventListener('click',ztSubmitComment);
    sheet.querySelector('#ztCommentsMore').addEventListener('click',()=>ztLoadComments(false));
    sheet.querySelector('#ztReplyCancel').addEventListener('click',()=>ztSetReply(null));
    sheet.querySelector('#ztCommentInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ztSubmitComment();}});
    sheet.addEventListener('keydown',e=>{if(e.key==='Escape')ztCloseComments();if(e.key==='Tab'){const nodes=[...sheet.querySelectorAll('button,input,a')].filter(n=>!n.disabled&&!n.classList.contains('hidden')&&!n.closest('[hidden]'));if(!nodes.length)return;const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
    return sheet;
  }
  function ztSetReply(comment){ztReplyTo=comment?.id||null;const b=document.getElementById('ztReplyCancel');b?.classList.toggle('hidden',!comment);if(b)b.textContent=ZadI18n.t('social.cancel')+(comment?' — '+(comment.display_name||comment.username||''):'');if(comment)document.getElementById('ztCommentInput')?.focus();}
  function ztCloseComments(){const s=document.getElementById('zadTalkCommentsSheet');if(!s)return;ztCommentEpoch++;ztCommentLoading=false;s.classList.remove('open');s.setAttribute('aria-hidden','true');s.dataset.clipId='';ztSetReply(null);document.documentElement.classList.remove('ztCommentsOpen');ztReturnFocus?.focus();}
  function ztCommentError(e){const status=document.getElementById('ztCommentsStatus');if(status)status.textContent=Zad.errorText(e,ZadI18n.t('social.failed'));if(/login_required|unauthorized|not_authenticated/i.test(e?.message||''))window.zadOpenAuth?.();}
  function ztCommentRow(c,id){
    const row=document.createElement('article');row.className='ztCommentRow';row.dataset.commentId=String(c.id);
    const av=document.createElement('div');av.className='ztCommentAvatar';av.innerHTML=ztAvatarHTML(c.avatar_url,c.display_name||c.username);
    const body=document.createElement('div');body.className='ztCommentBody';
    const name=document.createElement('strong');name.textContent=c.display_name||c.username||ZadI18n.t('social.publisher');
    const txt=document.createElement('p');txt.dir='auto';txt.textContent=c.body||'';txt.setAttribute('data-source-content','');
    const time=document.createElement('small');time.dataset.commentTime=c.created_at||'';try{time.textContent=new Intl.DateTimeFormat(ZadI18n.locale,{dateStyle:'medium'}).format(new Date(c.created_at));}catch(_){}
    const actions=document.createElement('div');actions.className='ztCommentActions';
    const like=document.createElement('button');like.type='button';like.className='secondary';like.setAttribute('aria-pressed',String(!!c.liked));like.dataset.commentLikes=String(c.like_count||0);
    const likeText=()=>{like.textContent=ZadI18n.t('talk.27813f1a76')+' · '+ztFormatCount(like.dataset.commentLikes);};likeText();
    like.addEventListener('click',async()=>{like.disabled=true;try{const d=await ztEdge('zad-talk-social',{action:'comment_like',id,comment_id:c.id,liked:like.getAttribute('aria-pressed')!=='true'});like.dataset.commentLikes=String(d.like_count||0);like.setAttribute('aria-pressed',String(!!d.liked));likeText();}catch(e){ztCommentError(e);}finally{like.disabled=false;}});actions.append(like);
    if(!c.parent_comment_id){const reply=document.createElement('button');reply.type='button';reply.className='secondary';reply.dataset.i18n='social.reply';reply.textContent=ZadI18n.t('social.reply');reply.addEventListener('click',()=>ztSetReply(c));actions.append(reply);}
    if(c.can_delete){const del=document.createElement('button');del.type='button';del.className='secondary';del.dataset.i18n='social.delete';del.textContent=ZadI18n.t('social.delete');del.addEventListener('click',async()=>{if(!confirm(ZadI18n.t('social.confirm')))return;del.disabled=true;try{await ztEdge('zad-talk-social',{action:'comment_delete',id,comment_id:c.id});await ztLoadComments(true);const article=document.querySelector(`.zadTalkClip[data-id="${CSS.escape(id)}"]`);ztLoadSocial(article,id,true);}catch(e){ztCommentError(e);}finally{del.disabled=false;}});actions.append(del);}
    body.append(name,txt,time,actions);row.append(av,body);
    if(!c.parent_comment_id&&c.reply_count){const toggle=document.createElement('button');toggle.type='button';toggle.className='secondary';toggle.dataset.replyCount=String(c.reply_count);toggle.textContent=ZadI18n.t('social.replies',{count:ztFormatCount(c.reply_count)});toggle.setAttribute('aria-expanded','false');const replies=document.createElement('div');replies.className='ztReplies';replies.hidden=true;let offset=0,loaded=false;
      const more=document.createElement('button');more.type='button';more.className='secondary';more.dataset.i18n='social.more';more.textContent=ZadI18n.t('social.more');
      async function load(){more.disabled=true;toggle.disabled=true;try{const d=await ztEdge('zad-talk-social',{action:'comments',id,parent_comment_id:c.id,offset});(d.comments||[]).forEach(x=>replies.insertBefore(ztCommentRow(x,id),more));offset=d.next_offset;more.hidden=!d.has_more;loaded=true;}catch(e){ztCommentError(e);}finally{more.disabled=false;toggle.disabled=false;}}
      replies.append(more);more.addEventListener('click',load);toggle.addEventListener('click',async()=>{replies.hidden=!replies.hidden;toggle.setAttribute('aria-expanded',String(!replies.hidden));if(!replies.hidden&&!loaded)await load();});body.append(toggle,replies);
    }
    return row;
  }
  async function ztLoadComments(reset){const sheet=document.getElementById('zadTalkCommentsSheet'),id=sheet?.dataset.clipId;if(!id||ztCommentLoading&&!reset)return;if(reset){ztCommentEpoch++;ztCommentOffset=0;}const epoch=ztCommentEpoch;ztCommentLoading=true;const list=document.getElementById('ztCommentsList'),more=document.getElementById('ztCommentsMore');more.disabled=true;
    try{const d=await ztEdge('zad-talk-social',{action:'comments',id,offset:ztCommentOffset});if(epoch!==ztCommentEpoch||sheet.dataset.clipId!==id)return;if(reset)list.textContent='';const comments=d.comments||[];comments.forEach(c=>list.append(ztCommentRow(c,id)));if(!list.children.length)list.innerHTML=`<div class="ztCommentsEmpty">${ZadI18n.html('talk.409c7d9759')}</div>`;ztCommentOffset=d.next_offset??ztCommentOffset+comments.length;more.classList.toggle('hidden',!d.has_more);
    }catch(e){if(epoch===ztCommentEpoch)ztCommentError(e);}finally{if(epoch===ztCommentEpoch){ztCommentLoading=false;more.disabled=false;}}
  }
  async function ztOpenComments(article,id){const sheet=ztEnsureCommentsSheet();ztReturnFocus=document.activeElement;ztSetReply(null);sheet.dataset.clipId=id;sheet.classList.add('open');sheet.setAttribute('aria-hidden','false');document.documentElement.classList.add('ztCommentsOpen');document.getElementById('ztCommentsList').textContent='';document.getElementById('ztCommentsStatus').textContent='';document.getElementById('ztCommentInput').value='';document.getElementById('ztCommentInput').focus();await ztLoadComments(true);}
  async function ztSubmitComment(){const sheet=document.getElementById('zadTalkCommentsSheet'),id=sheet?.dataset.clipId,input=document.getElementById('ztCommentInput'),text=ztEscText(input?.value),epoch=ztCommentEpoch;if(!id||!text||ztCommentBusy)return;const button=document.getElementById('ztCommentSend');ztCommentBusy=true;button.disabled=true;try{const d=await ztEdge('zad-talk-social',{action:'comment',id,comment:text,...(ztReplyTo?{parent_comment_id:ztReplyTo}:{})});if(sheet.dataset.clipId!==id||epoch!==ztCommentEpoch)return;input.value='';ztSetReply(null);document.getElementById('ztCommentsStatus').textContent='';const count=document.querySelector(`.zadTalkClip[data-id="${CSS.escape(id)}"] [data-zt-comment-count]`);if(count)count.textContent=ztFormatCount(d.comment_count||0);await ztLoadComments(true);}catch(e){if(epoch===ztCommentEpoch)ztCommentError(e);}finally{ztCommentBusy=false;button.disabled=false;}}

  async function ztOpenProfile(id){if(!id)return;document.getElementById('ztPublicProfile')?.remove();const dialog=document.createElement('dialog');dialog.id='ztPublicProfile';dialog.className='ztPublicProfile';dialog.innerHTML=`<div class="ztCommentsHead"><strong>${ZadI18n.html('social.profile')}</strong><button type="button" aria-label="${ZadI18n.html('settings.ca90c297b0')}">×</button></div><div class="ztPublicIdentity"></div><h2>${ZadI18n.html('social.recent')}</h2><div class="ztPublicVideos"></div><p class="ztProfileState" role="status"></p><button type="button" class="secondary ztProfileMore">${ZadI18n.html('social.more')}</button>`;document.body.append(dialog);dialog.querySelector('.ztCommentsHead button').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>dialog.remove());dialog.showModal();let offset=0;const more=dialog.querySelector('.ztProfileMore');async function load(){more.disabled=true;try{const data=await ztEdge('zad-talk-feed',{user_id:id,offset,limit:4});if(!dialog.isConnected)return;const p=data.profile||{};dialog.querySelector('.ztPublicIdentity').innerHTML=`<div class="ztCreatorMini">${ztAvatarHTML(p.avatar_url,p.display_name||p.username)}</div><strong dir="auto">${Zad.escape(p.display_name||p.username||ZadI18n.t('social.publisher'))}</strong><small dir="ltr">${p.username?'@'+Zad.escape(p.username):''}</small>`;for(const item of data.items||[]){const a=document.createElement('a');a.href=ztDeepLink(item.id);a.textContent=item.title||ZadI18n.t('talk.48988cb485');a.className='ztPublicLink';dialog.querySelector('.ztPublicVideos').append(a);}offset=data.next_offset;more.hidden=!data.has_more;if(!offset)dialog.querySelector('.ztProfileState').textContent=ZadI18n.t('talk.6ae8a709e9');}catch(e){dialog.querySelector('.ztProfileState').textContent=ZadI18n.t('social.failed');}finally{more.disabled=false;}}more.addEventListener('click',load);await load();}
  function ztSetSocial(article, d) {
    if (!article || !d) return;
    const like = article.querySelector('[data-zt-like]');
    like?.classList.toggle('liked', !!d.liked);
    const lc = article.querySelector('[data-zt-like-count]');
    if (lc) lc.textContent = ztFormatCount(d.like_count || 0);
    const cc = article.querySelector('[data-zt-comment-count]');
    if (cc) cc.textContent = ztFormatCount(d.comment_count || 0);
    const sc = article.querySelector('[data-zt-share-count]');
    if (sc) sc.textContent = ztFormatCount(d.share_count || 0);
  }
  async function ztLoadSocial(article, id, force = false) {
    if (!article || (!force && article.dataset.socialLoaded === '1')) return;
    try {
      const d = await ztEdge('zad-talk-social', {
        action: 'stats',
        id
      });
      ztSetSocial(article, d);
      article.dataset.socialLoaded = '1'
    } catch (_) {}
  }
  async function ztToggleLike(article, id) {
    const b = article?.querySelector('[data-zt-like]');
    if (b) b.disabled = true;
    try {
      const d = await ztEdge('zad-talk-social', {
        action: 'like',
        id
      });
      ztSetSocial(article, d);
      if (d.liked) {
        const heart = article.querySelector('.ztBigHeart');
        if (heart) {
          heart.classList.remove('pop');
          void heart.offsetWidth;
          heart.classList.add('pop')
        }
      }
    } catch (_) {} finally {
      if (b) b.disabled = false
    }
  }

  let ztActiveVideo=null;
  function ztAttachObserver() {
    ztObserver?.disconnect();if(!window.IntersectionObserver)return;
    const ratios=new Map(),shell=document.getElementById('zadTalkFeed');
    ztObserver=new IntersectionObserver(entries=>{
      entries.forEach(e=>ratios.set(e.target,e.isIntersecting?e.intersectionRatio:0));
      const best=[...ratios].sort((a,b)=>b[1]-a[1])[0];
      const active=best&&best[1]>=.6&&!document.hidden?best[0]:null;
      shell.querySelectorAll('video').forEach(v=>{if(v!==active)v.pause();});
      if(active&&active!==ztActiveVideo){active.preload='metadata';if(!matchMedia('(prefers-reduced-motion: reduce)').matches)active.play().catch(()=>{});}
      ztActiveVideo=active;
      if(active&&active.closest('.zadTalkClip')===shell.lastElementChild&&ztHasMore&&!ztLoading)ztLoadFeed(false);
    },{root:shell,threshold:[0,.6,.9]});
    shell.querySelectorAll('video').forEach(v=>ztObserver.observe(v));
  }

  function ztActionButton(kind, icon, label, countAttr) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ztAction ztAction' + kind;
    b.dataset['zt' + kind] = '1';
    b.setAttribute('aria-label', label);
    const i = document.createElement('span');
    i.className = 'ztActionIcon';
    i.innerHTML = Zad.icon(kind === 'Like' ? 'heart' : kind === 'Comment' ? 'message' : 'arrow');
    const c = document.createElement('b');
    c.setAttribute(countAttr, '');
    c.textContent = ZadI18n.number(0);
    const l = document.createElement('small');
    l.className = 'ztActionLabel';
    l.textContent = label;
    b.append(i, c, l);
    return b;
  }

  function ztAddClip(item) {
    const shell = document.getElementById('zadTalkFeed');
    if (!shell) return;
    const article = document.createElement('article');
    article.className = 'zadTalkClip';
    article.dataset.id = item.id || '';
    article.dataset.creatorId = item.creator_user_id || item.submitter_user_id || '';
    const video = document.createElement('video');
    const safeMedia = Zad.mediaURL(item.media_url);
    if (!safeMedia || Array.from(shell.children).some(e => e.dataset.id === String(item.id))) return;
    video.src = safeMedia;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'none';
    video.loop = true;
    video.muted = true;
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('aria-label', ztEscText(item.title) || ZadI18n.t("talk.72ed64e002"));
    video.addEventListener('play', () => document.querySelectorAll('video').forEach(v => {
      if (v !== video) v.pause();
    }));

    const shade = document.createElement('div');
    shade.className = 'ztVideoShade';
    const overlay = document.createElement('div');
    overlay.className = 'zadTalkClipOverlay';
    const creator = document.createElement('button');
    creator.type = 'button';
    creator.addEventListener('click',()=>ztOpenProfile(article.dataset.creatorId));
    creator.className = 'ztCreatorLine';
    const mini = document.createElement('div');
    mini.className = 'ztCreatorMini';
    mini.innerHTML = ztAvatarHTML(item.creator_avatar, item.creator_name || item.submitter_name || '');
    const cname = document.createElement('strong');
    cname.textContent = ztEscText(item.creator_name || item.submitter_name) || ZadI18n.t('social.publisher');
    const handle=document.createElement('small');handle.className='ztHandle';handle.dir='ltr';handle.textContent=item.creator_username?'@'+item.creator_username:'';
    const identity=document.createElement('span');identity.append(cname,handle);creator.append(mini, identity);
    const title = document.createElement('p');
    title.className = 'ztClipTitle';
    title.textContent = ztEscText(item.title) || ZadI18n.t("talk.48988cb485");
    overlay.append(creator, title);

    const rail = document.createElement('div');
    rail.className = 'ztActionRail';
    const av = document.createElement('div');
    av.className = 'ztRailAvatar';
    av.innerHTML = ztAvatarHTML(item.creator_avatar, item.creator_name || item.submitter_name || '');
    rail.appendChild(av);
    const like = ztActionButton('Like', '♥', ZadI18n.t("talk.27813f1a76"), 'data-zt-like-count');
    like.setAttribute('data-zt-like', '');
    like.addEventListener('click', e => {
      e.stopPropagation();
      ztToggleLike(article, item.id)
    });
    const comment = ztActionButton('Comment', '💬', ZadI18n.t("talk.af9ec083a6"), 'data-zt-comment-count');
    comment.setAttribute('data-zt-comment', '');
    comment.addEventListener('click', e => {
      e.stopPropagation();
      ztOpenComments(article, item.id)
    });
    const share = ztActionButton('Share', '↗', ZadI18n.t("talk.ace24891ce"), 'data-zt-share-count');
    share.setAttribute('data-zt-share', '');
    share.addEventListener('click', e => {
      e.stopPropagation();
      ztShareClip(item, share, article)
    });
    rail.append(like, comment, share);

    const play = document.createElement('div');
    play.className = 'ztPlayHint';
    play.textContent = '▶';
    const heart = document.createElement('div');
    heart.className = 'ztBigHeart';
    heart.textContent = '♥';
    video.addEventListener('dblclick', e => {
      e.preventDefault();
      ztToggleLike(article, item.id)
    });
    article.append(video, shade, overlay, rail, play, heart);
    shell.appendChild(article);
    video.addEventListener('play', () => article.classList.add('playing'));
    video.addEventListener('pause', () => article.classList.remove('playing'));
    ztLoadSocial(article, item.id);
  }

  async function ztLoadFeed(reset, focusId = '') {
    const shell = ztEnsureFeed();
    if (!shell || ztLoading) return;
    if (reset) {
      shell.textContent = '';
      ztOffset = 0;
      ztHasMore = true;
    }
    if (!ztHasMore && !focusId) return;
    ztLoading = true;
    const state = document.getElementById('zadTalkFeedState'),
      more = document.getElementById('zadTalkMore');
    state.classList.remove('hidden');
    state.textContent = ZadI18n.t("gateways.95c22c9a49");
    more.classList.add('hidden');
    try {
      const data = await ztEdge('zad-talk-feed', focusId ? {
        id: focusId
      } : {
        offset: ztOffset,
        limit: 4
      });
      if (!shell.isConnected) return;
      const items = Array.isArray(data.items) ? data.items : [];
      items.forEach(ztAddClip);
      ztOffset = Number(data.next_offset ?? ztOffset + items.length);
      ztHasMore = !!data.has_more;
      state.classList.toggle('hidden', !!shell.children.length);
      state.textContent = focusId ? ZadI18n.t("talk.c1ad4818c0") : ZadI18n.t("talk.6ae8a709e9");
      more.textContent = ZadI18n.t("talk.4ec10c8064");
      more.classList.toggle('hidden', !ztHasMore || !!focusId);
      ztAttachObserver();
    } catch (_) {
      if (!shell.isConnected) return;
      state.textContent = ZadI18n.t("talk.6b3f52c7de");
      more.textContent = ZadI18n.t("quran-reader.14d5786f2e");
      more.classList.remove('hidden');
    } finally {
      ztLoading = false;
      if (!shell.isConnected && document.getElementById('zadTalkFeed')) ztLoadFeed(true);
    }
  }
  async function ztWaitClient() {
    for (let i = 0; i < 50; i++) {
      if (window.zadSupabase?.storage) return window.zadSupabase;
      await new Promise(r => setTimeout(r, 100));
    }
    throw new Error(ZadI18n.t("talk.803a7d6ffb"));
  }

  async function ztUpload() {
    const titleEl = document.getElementById('v21VideoTitle');
    const fileEl = document.getElementById('v21VideoFile');
    const status = document.getElementById('v21SubmitStatus');
    const btn = document.querySelector('[data-v21-submit-video]');
    const title = ztEscText(titleEl?.value);
    const file = fileEl?.files?.[0];

    function setMsg(msg, kind = '') {
      if (!status) return;
      status.textContent = msg;
      status.className = 'v21SubmitStatus' + (kind ? ' ' + kind : '');
    }

    if (title.length < 2 || title.length > 140) return setMsg(ZadI18n.t("talk.01f4f3920b"), 'bad');
    if (!file) return setMsg(ZadI18n.t("talk.9cd141a110"), 'bad');
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'];
    if (!allowed.includes((file.type || '').toLowerCase())) return setMsg(ZadI18n.t("talk.4ab7cc8e55"), 'bad');
    if (!file.size || file.size > 50 * 1024 * 1024) return setMsg(ZadI18n.t("talk.cc3e4285e4"), 'bad');

    if (btn?.disabled) return;
    if (btn) btn.disabled = true;
    if (!(await Zad.fileSignature(file, 'video').catch(() => false))) {
      if (btn) btn.disabled = false;
      return setMsg(ZadI18n.t("talk.d30147cfc4"), 'bad');
    }
    let progress = document.getElementById('zadTalkUploadProgress');
    if (!progress) {
      progress = document.createElement('div');
      progress.id = 'zadTalkUploadProgress';
      progress.className = 'zadTalkUploadProgress';
      progress.innerHTML = '<i></i>';
      status?.insertAdjacentElement('beforebegin', progress);
    }
    const bar = progress.querySelector('i');
    if (bar) bar.style.width = '8%';

    try {
      setMsg(ZadI18n.t("talk.b478bc9818"));
      const ticket = await ztEdge('zad-talk-create-upload', {
        title,
        submitter_name: null,
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size
      });
      if (bar) bar.style.width = '25%';

      setMsg(ZadI18n.t("talk.17f4aaae14"));
      const sb = await ztWaitClient();
      const up = await sb.storage.from('zad-talk-media').uploadToSignedUrl(
        ticket.path, ticket.token, file, {
          contentType: file.type,
          upsert: false
        }
      );
      if (up.error) throw up.error;
      if (bar) bar.style.width = '82%';

      setMsg(ZadI18n.t("talk.4c4e937eb6"));
      const done = await ztEdge('zad-talk-finalize-upload', {
        id: ticket.id,
        receipt: ticket.receipt
      });
      if (!done.ok) throw new Error(ZadI18n.t("talk.3b7e7db693"));
      if (bar) bar.style.width = '100%';
      setMsg(ZadI18n.t("talk.e7048f2210"), 'ok');
      if (titleEl) titleEl.value = '';
      if (fileEl) fileEl.value = '';
      setTimeout(() => {
        if (progress) progress.remove()
      }, 1200);
    } catch (err) {
      console.error('Zad Talk upload:', err);
      setMsg(Zad.errorText(err, ZadI18n.t("talk.b37bb900f7")), 'bad');
      if (bar) bar.style.width = '0';
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function ztPatchPublish() {
    const pane = document.querySelector('[data-v21-media-pane="publish"]');
    if (!pane) return;
    const steps = pane.querySelectorAll('.v21PublishSteps>div span');
    const ar = document.documentElement.lang === 'ar';
    const texts = [ZadI18n.t("talk.65acc2e78a"), ZadI18n.t("quran-reader.67d4210971"), ZadI18n.t("talk.633ec2761e"), ZadI18n.t("talk.b5abd9ed8b")];
    steps.forEach((x, i) => {
      if (texts[i]) x.textContent = texts[i]
    });
    const card = pane.querySelector('.v21SubmitCard');
    if (card && !card.querySelector('.zadTalkNoAccountNote')) {
      const note = document.createElement('div');
      note.className = 'zadTalkNoAccountNote';
      note.style.cssText = 'margin:10px 0;padding:10px 12px;border:1px solid var(--line);border-radius:13px;background:var(--card2);color:var(--muted);font-size:12px;line-height:1.8';
      note.textContent = ZadI18n.t("talk.aefcd2ba0d");
      card.querySelector('h2')?.insertAdjacentElement('afterend', note);
    }
  }

  document.addEventListener('error', e=>{const img=e.target;if(img.matches?.('img[data-fallback]')){const fallback=document.createElement('span');fallback.textContent=img.dataset.fallback||'—';img.replaceWith(fallback);}},true);
  document.addEventListener('zad:route',()=>{ztCloseComments();ztCloseLeaderboard();document.getElementById('ztPublicProfile')?.close();});
  document.addEventListener('click', e => {
    const submit = e.target.closest?.('[data-v21-submit-video]');
    if (submit) {
      e.preventDefault();
      e.stopImmediatePropagation();
      ztUpload();
      return;
    }
    const tab = e.target.closest?.('[data-v21-media-tab]');
    if (tab) {
      setTimeout(() => {
        ztPatchPublish();
        if (tab.dataset.v21MediaTab === 'watch') ztLoadFeed(true);
      }, 0);
    }
    const mediaCard = e.target.closest?.('[data-v21-view="media"]');
    if (mediaCard) {
      setTimeout(() => {
        ztPatchPublish();
        ztLoadFeed(true)
      }, 0);
    }
  }, true);

  /* If the media page is already open when this script initializes. */
  setTimeout(() => {
    if (ztRequestedId) {
      try {
        window.__v21Render?.('media', true)
      } catch (_) {}
      setTimeout(() => {
        ztPatchPublish();
        ztLoadFeed(true, ztRequestedId);
      }, 80);
      return;
    }
    if (document.querySelector('[data-v21-media-pane="watch"]')) {
      ztPatchPublish();
      ztLoadFeed(true);
    }
  }, 200);


  let chromeLocale=ZadI18n.locale;
  document.addEventListener('zad:language',()=>{
    const labels={'.ztLeaderboardHead small':'talk.f2f2bed5a5','.ztLeaderboardHead strong':'talk.38bb230f93','.ztLeaderboardNote':'talk.e85632ffc2','#ztLeaderboardRefresh':'talk.654b0d1dbe','.ztCommentsHead strong':'talk.5f285a4c6a','#ztCommentSend':'talk.8b1e3b105d','.zadTalkNoAccountNote':'talk.aefcd2ba0d'};
    for(const [selector,key] of Object.entries(labels))document.querySelectorAll(selector).forEach(el=>el.textContent=ZadI18n.t(key));
    document.querySelectorAll('button[data-zt-rank-close],button[data-zt-comments-close]').forEach(el=>el.setAttribute('aria-label',ZadI18n.t('settings.ca90c297b0')));
    const input=document.getElementById('ztCommentInput');if(input)input.placeholder=ZadI18n.t('talk.029d5fc7bd');
    // Only dedicated system-state nodes participate; comments/names/captions never do.
    for(const el of document.querySelectorAll('.ztLeaderboardState,.ztCommentsEmpty,#ztCommentsStatus')){
      const key=Object.keys(ZadI18nCatalog).find(k=>ZadI18nCatalog[k][chromeLocale]===el.textContent);
      if(key)el.textContent=ZadI18n.t(key);
    }
    document.querySelectorAll('.ztRankNo[data-rank]').forEach(el=>el.textContent=ZadI18n.number(el.dataset.rank));
    document.querySelectorAll('.ztRankCopy small[data-counts]').forEach(el=>{const c=JSON.parse(el.dataset.counts);el.textContent=ZadI18n.t('talk.9ca4c06105',Object.fromEntries(c.map((n,i)=>['v'+i,ztFormatCount(n)])));});
    document.querySelectorAll('.ztRankScore[data-score]').forEach(el=>{el.innerHTML=ztFormatCount(el.dataset.score)+'<small>'+ZadI18n.html('talk.69ff4ac820')+'</small>';});
    document.querySelectorAll('[data-comment-time]').forEach(el=>{const date=new Date(el.dataset.commentTime);if(Number.isFinite(date.getTime()))el.textContent=new Intl.DateTimeFormat(ZadI18n.locale,{dateStyle:'medium'}).format(date);});
    document.querySelectorAll('[data-comment-likes]').forEach(el=>el.textContent=ZadI18n.t('talk.27813f1a76')+' · '+ztFormatCount(el.dataset.commentLikes));
    document.querySelectorAll('[data-reply-count]').forEach(el=>el.textContent=ZadI18n.t('social.replies',{count:ztFormatCount(el.dataset.replyCount)}));
    document.getElementById('ztPublicProfile')?.close();
    chromeLocale=ZadI18n.locale;
  });

  /* Public helper for later Android/WebView work. */
  window.zadTalkRefresh = function() {
    return ztLoadFeed(true)
  };
})();

document.addEventListener('visibilitychange', () => {
  if (document.hidden) document.querySelectorAll('video').forEach(v => v.pause());
});
document.addEventListener('zad:route', () => document.querySelectorAll('video').forEach(v => v.pause()));

