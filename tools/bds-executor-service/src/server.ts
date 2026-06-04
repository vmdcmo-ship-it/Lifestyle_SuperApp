import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { loadConfig } from './config.js';
import { SessionManager } from './browser/sessionManager.js';
import { ERROR, type ActionRequest, type ActionResponse } from './types.js';
import * as zalo from './actions/zalo.js';
import * as facebook from './actions/facebook.js';
import * as facebookPage from './actions/facebookPage.js';
import { runMock } from './actions/mock.js';

const config = loadConfig();
const sessions = new SessionManager(config);

async function dispatch(req: ActionRequest): Promise<ActionResponse> {
  const { action, account_id: accountId, params } = req;
  if (!accountId) return ERROR('thiếu account_id');
  if (config.backend === 'mock') {
    return runMock(action, params);
  }
  switch (action) {
    case 'check_phone':
      return zalo.checkPhone(sessions, accountId, params);
    case 'add_friend':
      return zalo.addFriend(sessions, accountId, params);
    case 'send_message':
      return zalo.sendMessage(sessions, accountId, params);
    case 'add_group':
      return zalo.addToGroup(sessions, accountId, params);
    case 'fb_like':
      return facebook.like(sessions, accountId, params);
    case 'fb_comment':
      return facebook.comment(sessions, accountId, params);
    case 'fb_message':
      return facebook.message(sessions, accountId, params);
    case 'fb_join_group':
      return facebook.joinGroup(sessions, accountId, params);
    case 'fb_search_pages':
      return facebookPage.searchPages(sessions, accountId, params);
    case 'fb_page_info':
      return facebookPage.pageInfo(sessions, accountId, params);
    case 'fb_page_follow':
      return facebookPage.pageFollow(sessions, accountId, params);
    case 'fb_page_interact':
      return facebookPage.pageInteract(sessions, accountId, params);
    case 'fb_page_message':
      return facebookPage.pageMessage(sessions, accountId, params);
    default:
      return ERROR(`action không hợp lệ: ${String(action)}`);
  }
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, code: number, body: ActionResponse): void {
  const json = JSON.stringify(body);
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(json);
}

const server = createServer((req, res) => {
  void (async () => {
    if (req.method !== 'POST') {
      send(res, 405, ERROR('chỉ nhận POST'));
      return;
    }
    if (config.token && req.headers.authorization !== `Bearer ${config.token}`) {
      send(res, 401, ERROR('unauthorized'));
      return;
    }
    let payload: ActionRequest;
    try {
      payload = JSON.parse((await readBody(req)) || '{}') as ActionRequest;
    } catch {
      send(res, 400, ERROR('JSON không hợp lệ'));
      return;
    }
    const stamp = new Date().toISOString().slice(11, 19);
    process.stdout.write(`[${stamp}] ${payload.action} acc=${payload.account_id} cid=${payload.correlation_id ?? '-'}\n`);
    try {
      const result = await dispatch(payload);
      process.stdout.write(`         -> ${result.status}${result.message ? ' (' + result.message + ')' : ''}\n`);
      send(res, 200, result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stdout.write(`         -> error: ${msg}\n`);
      send(res, 200, ERROR(msg));
    }
  })();
});

server.listen(config.port, '127.0.0.1', () => {
  process.stdout.write(
    `BDS Executor chạy http://127.0.0.1:${config.port}/webhook/bds-action ` +
      `| backend=${config.backend} | headless=${config.headless} | token=${config.token ? 'BẬT' : 'tắt'}\n`,
  );
});

async function shutdown(): Promise<void> {
  process.stdout.write('\nĐang đóng các phiên trình duyệt...\n');
  await sessions.closeAll();
  server.close();
  process.exit(0);
}
process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
