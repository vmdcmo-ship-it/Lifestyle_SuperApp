// Stub server mô phỏng OpenClaw để smoke-test contract — KHÔNG đụng tài khoản thật.
// Chạy: node scripts/openclaw-stub.mjs   (cổng mặc định 5678, đổi qua OPENCLAW_STUB_PORT)
//
// Hợp đồng:
//   POST <bất kỳ path> body {action, account_id, params, correlation_id}
//   -> { status: "ok"|"checkpoint"|"error", data?, message? }
//
// Quy ước mô phỏng (tất định, dễ kiểm chứng):
//   - check_phone: số kết thúc số chẵn -> has_zalo=true; lẻ -> false.
//   - Mọi action: nếu phone/postId/groupId chứa "0000" -> trả checkpoint.
//   - nếu chứa "9999" -> trả error.
//   - Nếu đặt OPENCLAW_TOKEN, yêu cầu header Authorization: Bearer <token>.

import { createServer } from 'node:http';

const PORT = Number(process.env.OPENCLAW_STUB_PORT ?? '5678');
const TOKEN = process.env.OPENCLAW_TOKEN ?? '';

function decide(action, params) {
  const probe = `${params?.phone ?? ''}${params?.postId ?? ''}${params?.groupId ?? ''}`;
  if (probe.includes('0000')) {
    return { status: 'checkpoint', message: 'stub: mô phỏng captcha/checkpoint' };
  }
  if (probe.includes('9999')) {
    return { status: 'error', message: 'stub: mô phỏng lỗi thực thi' };
  }
  if (action === 'check_phone') {
    const phone = String(params?.phone ?? '');
    const lastDigit = Number(phone.slice(-1));
    const hasZalo = Number.isFinite(lastDigit) && lastDigit % 2 === 0;
    return hasZalo
      ? { status: 'ok', data: { has_zalo: true, display_name: `Stub User ${phone.slice(-4)}` } }
      : { status: 'ok', data: { has_zalo: false } };
  }
  return { status: 'ok' };
}

const server = createServer((req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'chỉ nhận POST' }));
    return;
  }
  if (TOKEN && req.headers.authorization !== `Bearer ${TOKEN}`) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: 'token sai' }));
    return;
  }
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    let payload = {};
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'JSON không hợp lệ' }));
      return;
    }
    const result = decide(payload.action, payload.params ?? {});
    const stamp = new Date().toISOString().slice(11, 19);
    process.stdout.write(
      `[${stamp}] ${String(payload.action).padEnd(13)} acc=${payload.account_id ?? '-'} ` +
        `params=${JSON.stringify(payload.params ?? {})} -> ${result.status}\n`,
    );
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  });
});

server.listen(PORT, '127.0.0.1', () => {
  process.stdout.write(`OpenClaw STUB chạy tại http://127.0.0.1:${PORT}  (token=${TOKEN ? 'BẬT' : 'tắt'})\n`);
  process.stdout.write('Quy ước: phone lẻ=no_zalo, chẵn=has_zalo; chứa 0000=checkpoint; 9999=error.\n');
});
