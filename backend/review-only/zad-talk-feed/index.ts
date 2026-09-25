import { createClient } from 'npm:@supabase/supabase-js@2';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, apikey, authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
function json(b: unknown, s = 200) {
  return new Response(JSON.stringify(b), {
    status: s,
    headers: {
      ...cors,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
function adminKey() {
  const legacy = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
  if (legacy) return legacy;
  try {
    const x = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
    return x.default || '';
  } catch (_) {
    return '';
  }
}
function clientIp(req: Request) {
  let raw = (req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '').split(',')[0].trim();
  if (raw.startsWith('::ffff:')) raw = raw.slice(7);
  return raw || 'unknown';
}
async function sha(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
}
function idOk(s: string) {
  return /^[0-9a-f-]{36}$/i.test(s);
}
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', {
    headers: cors
  });
  if (req.method !== 'POST') return json({
    error: 'method_not_allowed'
  }, 405);
  try {
    const body = await req.json().catch(() => ({}));
    const focusId = String(body?.id || '').trim();
    const offset = Math.max(0, Number(body?.offset || 0) || 0);
    const limit = Math.min(8, Math.max(1, Number(body?.limit || 4) || 4));
    const url = Deno.env.get('SUPABASE_URL') || '';
    const key = adminKey();
    if (!url || !key) return json({
      error: 'server_config_error',
      message: 'إعدادات خادم زاد توك غير مكتملة.'
    }, 500);
    const sb = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    const ipRaw = clientIp(req);
    const ipHash = ipRaw === 'unknown' ? null : await sha(ipRaw);
    if (ipHash) {
      const b = await sb.from('zad_ip_bans').select('ip_hash').eq('ip_hash', ipHash).eq('is_active', true).maybeSingle();
      if (b.error) throw b.error;
      if (b.data) return json({
        error: 'ip_banned',
        message: 'تم حظر هذا الاتصال من زاد الإسلام.'
      }, 403);
    }
    const auth = req.headers.get('authorization') || '';
    const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
    if (token) {
      try {
        const u = await sb.auth.getUser(token);
        if (!u.error && u.data?.user) {
          const p = await sb.from('profiles').select('account_status').eq('id', u.data.user.id).maybeSingle();
          if (p.data?.account_status === 'banned') return json({
            error: 'account_banned',
            message: 'هذا الحساب موقوف من إدارة الموقع.'
          }, 403);
          if (ipHash) {
            const l = await sb.from('zad_user_ip_links').upsert({
              user_id: u.data.user.id,
              ip_hash: ipHash,
              last_seen_at: new Date().toISOString()
            }, {
              onConflict: 'user_id,ip_hash'
            });
            if (l.error) console.warn('ip_link', l.error.message);
          }
        }
      } catch (_) {}
    }
    let q = sb.from('zad_talk_submissions').select('id,title,description,submitter_name,submitter_user_id,storage_path,published_at').eq('status', 'approved').order('published_at', {
      ascending: false
    });
    if (focusId) {
      if (!idOk(focusId)) return json({
        error: 'invalid_id'
      }, 400);
      q = q.eq('id', focusId).limit(1);
    } else q = q.range(offset, offset + limit - 1);
    const {
      data,
      error
    } = await q;
    if (error) throw error;
    const pr = await sb.from('profiles').select('id,username,display_name,avatar_url,account_status').limit(500);
    const byId = new Map<string, any>(),
      byName = new Map<string, any>();
    if (!pr.error) for (const p of pr.data || []) {
      byId.set(p.id, p);
      const n = String(p.username || p.display_name || '').trim().toLowerCase();
      if (n && !byName.has(n)) byName.set(n, p);
    }
    const items = [];
    for (const row of data || []) {
      if (!row.storage_path) continue;
      let p = row.submitter_user_id ? byId.get(row.submitter_user_id) : null;
      if (!p && row.submitter_name) p = byName.get(String(row.submitter_name).trim().toLowerCase()) || null;
      if (p?.account_status === 'banned') continue;
      const signed = await sb.storage.from('zad-talk-media').createSignedUrl(row.storage_path, 3600);
      if (signed.error || !signed.data?.signedUrl) continue;
      items.push({
        ...row,
        creator_user_id: p?.id || row.submitter_user_id || null,
        creator_name: p?.username || p?.display_name || row.submitter_name || null,
        creator_avatar: p?.avatar_url || null,
        media_url: signed.data.signedUrl
      });
    }
    return json({
      ok: true,
      items,
      next_offset: focusId ? offset : offset + (data || []).length,
      has_more: focusId ? false : (data || []).length === limit
    });
  } catch (e) {
    console.error('zad-talk-feed', e);
    return json({
      error: 'server_error',
      message: 'تعذر تحميل المقاطع المعتمدة من الخادم.'
    }, 500);
  }
});
