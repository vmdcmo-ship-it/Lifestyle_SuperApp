// Smoke-test server + router + contract (backend=mock). KHÔNG cần trình duyệt/selector.
// Dùng: node scripts/smoke.mjs   (service phải đang chạy ở backend mock)
// Hoặc đặt SMOKE_URL/SMOKE_TOKEN qua env.

const URL = process.env.SMOKE_URL ?? 'http://127.0.0.1:5678/webhook/bds-action';
const TOKEN = process.env.SMOKE_TOKEN ?? '';

async function call(body, token = TOKEN) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(URL, { method: 'POST', headers, body: JSON.stringify(body) });
  return { http: res.status, json: await res.json().catch(() => ({})) };
}

const cases = [
  {
    name: 'check_phone -> has_zalo (chẵn)',
    body: { action: 'check_phone', account_id: 'zalo_acc01', params: { phone: '84980532116' } },
    expect: (r) => r.json.status === 'ok' && r.json.data?.has_zalo === true,
  },
  {
    name: 'check_phone -> no_zalo (lẻ)',
    body: { action: 'check_phone', account_id: 'zalo_acc02', params: { phone: '84903111223' } },
    expect: (r) => r.json.status === 'ok' && r.json.data?.has_zalo === false,
  },
  {
    name: 'check_phone -> checkpoint (0000)',
    body: { action: 'check_phone', account_id: 'zalo_acc03', params: { phone: '84900000000' } },
    expect: (r) => r.json.status === 'checkpoint',
  },
  {
    name: 'add_friend -> ok',
    body: { action: 'add_friend', account_id: 'zalo_acc01', params: { phone: '84980532116', message: 'hi' } },
    expect: (r) => r.json.status === 'ok',
  },
  {
    name: 'send_message -> ok',
    body: { action: 'send_message', account_id: 'zalo_acc01', params: { phone: '84980532116', message: 'hi' } },
    expect: (r) => r.json.status === 'ok',
  },
  {
    name: 'add_group -> ok',
    body: { action: 'add_group', account_id: 'zalo_acc01', params: { phone: '84980532116', groupId: 'g1' } },
    expect: (r) => r.json.status === 'ok',
  },
  {
    name: 'fb_like -> ok',
    body: { action: 'fb_like', account_id: 'fb_acc01', params: { postId: 'post_1' } },
    expect: (r) => r.json.status === 'ok',
  },
  {
    name: 'fb_comment -> ok',
    body: { action: 'fb_comment', account_id: 'fb_acc01', params: { postId: 'post_1', text: 'hay quá' } },
    expect: (r) => r.json.status === 'ok',
  },
  {
    name: 'fb_comment -> error (9999)',
    body: { action: 'fb_comment', account_id: 'fb_acc01', params: { postId: 'post_9999', text: 'x' } },
    expect: (r) => r.json.status === 'error',
  },
  {
    name: 'action lạ -> error',
    body: { action: 'nuke', account_id: 'x', params: {} },
    expect: (r) => r.json.status === 'error',
  },
];

let pass = 0;
for (const c of cases) {
  try {
    const r = await call(c.body);
    const ok = c.expect(r);
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name}  -> ${JSON.stringify(r.json)}`);
    if (ok) pass += 1;
  } catch (e) {
    console.log(`FAIL  ${c.name}  -> ${e instanceof Error ? e.message : String(e)}`);
  }
}

// Test auth: nếu service bật token, gửi sai token phải 401.
if (TOKEN) {
  const r = await call(cases[0].body, 'sai-token');
  const ok = r.http === 401;
  console.log(`${ok ? 'PASS' : 'FAIL'}  auth: token sai -> 401  (http=${r.http})`);
  if (ok) pass += 1;
}

const total = cases.length + (TOKEN ? 1 : 0);
console.log(`\n${pass}/${total} PASS`);
process.exit(pass === total ? 0 : 1);
