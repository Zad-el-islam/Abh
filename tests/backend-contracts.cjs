/* Deployed canonical function contracts. Authentication is isolated here and tested in backend-security.cjs/live QA. Database/storage clients are test doubles. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {
  stripTypeScriptTypes
} = require('node:module');
const crypto = require('node:crypto');
const results = [];
const hash = s => crypto.createHash('sha256').update(s).digest('hex');

function client(resolve, extras = {}) {
  const log = [];
  return {
    log,
    from(table) {
      const ops = [];
      const chain = new Proxy({}, {
        get(_, method) {
          if (method === 'then') return (ok, bad) => Promise.resolve().then(() => {
            log.push({
              table,
              ops
            });
            return resolve(table, ops);
          }).then(ok, bad);
          return (...args) => {
            ops.push([method, ...args]);
            return chain;
          };
        }
      });
      return chain;
    },
    rpc: async () => ({
      data: null,
      error: null
    }),
    ...extras
  };
}

function handler(name, sb) {
  const file = path.join(__dirname, '../supabase/functions', name, 'index.ts');
  const source = fs.readFileSync(file, 'utf8').replace(/^import .*?;\n/, '');
  const runtime = fs.readFileSync(path.join(__dirname,'../supabase/functions/_shared/runtime.ts'),'utf8').replace(/^import .*?;\n/,'').replace(/^export /gm,'');
  let serve;
  const env={SUPABASE_URL:'https://test.invalid',SUPABASE_SERVICE_ROLE_KEY:'test-only-secret'};
  vm.runInNewContext(stripTypeScriptTypes(runtime,{mode:'transform'})+"\nuser=async()=>({user:{id:'23456789-1234-1234-1234-123456789012'},profile:{account_status:'active'},role:'user'});\n"+stripTypeScriptTypes(source), {
    Deno:{serve(fn){serve=fn;},env:{get:key=>env[key]}},createClient:()=>sb,Request,Response,Headers,AbortSignal,TextEncoder,TextDecoder,DataView,Uint8Array,atob,
    fetch:async()=>new Response(fs.readFileSync(path.join(__dirname,'fixtures/qa-video.mp4'))),crypto:crypto.webcrypto,console:{error(){},warn(){}}
  });
  return async body => {
    const response = await serve(new Request('https://test.invalid/function', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(body)
    }));
    return {
      status: response.status,
      body: await response.json()
    };
  };
}
async function test(name, fn) {
    try {
      await fn();
      results.push({
        name,
        status: 'passed'
      });
      console.log('PASS', name);
    } catch (error) {
      results.push({
        name,
        status: 'failed',
        error: error.message
      });
      console.error('FAIL', name, error.stack);
    }
  }
  (async () => {
    await test('Admin username cannot become a PostgREST OR filter or LIKE wildcard', async () => {
      const sb = client(() => ({
        count: 0,
        error: null
      }));
      const request = handler('zad-admin-auth', sb);
      const result = await request({
        action: 'login',
        username: 'reader_%\\),success.eq.true',
        password: 'test-only'
      });
      assert.equal(result.status, 401);
      assert(!sb.log.some(q => q.ops.some(o => o[0] === 'or')));
      const filter = sb.log.flatMap(q => q.ops).find(o => o[0] === 'ilike');
      assert.equal(filter[2], 'reader\\_\\%\\\\),success.eq.true');
    });
    await test('Admin login does not report success when session persistence fails', async () => {
      const sb = client((table, ops) => ({
        count: 0,
        error: table === 'zad_admin_sessions' && ops.some(o => o[0] === 'insert') ? {
          message: 'simulated write failure'
        } : null
      }), {
        rpc: async () => ({
          data: {
            admin_id: 'test-admin',
            username: 'admin'
          },
          error: null
        })
      });
      const result = await handler('zad-admin-auth', sb)({
        action: 'login',
        username: 'admin',
        password: 'test-only'
      });
      assert.equal(result.status, 500);
      assert(!result.body.session_token);
    });
    const receipt = 'a'.repeat(64);
    const baseRow = {
      id: '00000000-0000-0000-0000-000000000001',
      status: 'uploading',
      upload_receipt_hash: hash(receipt),
      upload_expires_at: new Date(Date.now() + 60000).toISOString(),
      submitter_user_id: '23456789-1234-1234-1234-123456789012',
      storage_path: '23456789-1234-1234-1234-123456789012/00000000-0000-0000-0000-000000000001/video.mp4',
      file_size: 1024,
      mime_type: 'video/mp4'
    };
    await test('Even a pending upload requires the matching receipt', async () => {
      const sb = client(() => ({
        data: {
          ...baseRow,
          status: 'pending', upload_verified_at: new Date().toISOString()
        },
        error: null
      }));
      const request = handler('zad-talk-finalize-upload', sb);
      assert.equal((await request({
        id: baseRow.id,
        receipt: 'b'.repeat(64)
      })).status, 403);
      assert.equal((await request({
        id: baseRow.id,
        receipt
      })).status, 200);
    });
    await test('Finalize rejects mismatched storage size/MIME and only accepts matching metadata', async () => {
      for (const metadata of [{
          size: 2048,
          mimetype: 'video/mp4'
        }, {
          size: 1024,
          mimetype: 'text/html'
        }, {
          size: 1024,
          mimetype: 'video/mp4'
        }]) {
        const sb = client((table, ops) => ({
          data: ops.some(o => o[0] === 'update') ? [{id:baseRow.id}] : baseRow,
          error: null
        }), {
          storage: {
            from: () => ({
              createSignedUrl: async()=>({data:{signedUrl:'https://test.invalid/video.mp4'},error:null}),
              list: async () => ({
                data: [{
                  name: 'video.mp4',
                  metadata
                }],
                error: null
              })
            })
          }
        });
        const result = await handler('zad-talk-finalize-upload', sb)({
          id: baseRow.id,
          receipt
        });
        const valid = metadata.size === 1024 && metadata.mimetype === 'video/mp4';
        assert.equal(result.status, valid ? 200 : 400);
        assert.equal(sb.log.some(q => q.ops.some(o => o[0] === 'update')), valid);
      }
    });
    await test('Feed pagination advances over scanned rows even when some cannot be emitted', async () => {
      const rows = [{
        id: 'one',
        storage_path: 'available.mp4',
        submitter_user_id: 'active'
      }, {
        id: 'two',
        storage_path: 'banned.mp4',
        submitter_user_id: 'banned'
      }, {
        id: 'three',
        storage_path: ''
      }, {
        id: 'four',
        storage_path: 'missing.mp4'
      }];
      const sb = client(table => ({
        data: table === 'profiles' ? [{
          id: 'active',
          account_status: 'active'
        }, {
          id: 'banned',
          account_status: 'banned'
        }] : rows,
        error: null
      }), {
        storage: {
          from: () => ({
            createSignedUrl: async file => file === 'available.mp4' ? {
              data: {
                signedUrl: 'https://test.invalid/available.mp4'
              },
              error: null
            } : {
              error: {
                message: 'missing'
              }
            }
          })
        }
      });
      const result = await handler('zad-talk-feed', sb)({
        offset: 8,
        limit: 4
      });
      assert.equal(result.status, 200);
      assert.equal(result.body.items.length, 1);
      assert.equal(result.body.next_offset, 12);
      assert.equal(result.body.has_more, true);
    });
    const failed = results.filter(r => r.status === 'failed').length;
    fs.writeFileSync(path.join(__dirname, 'backend-results.json'), JSON.stringify({
      passed: results.length - failed,
      failed,
      scope: 'Canonical deployed function contracts with mocked authentication/database/storage. Actual runtime guards are separately tested; this suite is not live integration.',
      results
    }, null, 2));
    process.exitCode = failed ? 1 : 0;
  })().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
