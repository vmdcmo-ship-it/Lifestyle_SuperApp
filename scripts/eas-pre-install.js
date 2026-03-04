/**
 * EAS Build Pre-Install Hook - Monorepo Isolation
 *
 * Khi build trên EAS, monorepo upload cả repo → npm/yarn tại root
 * cố resolve workspace:* → fail. Hook này isolate app cần build lên root.
 *
 * Env: LIFESTYLE_BUILD_APP = "user" | "driver" | "merchant"
 * Đặt trong eas.json của từng app (profile preview/production).
 */
const fs = require('fs');
const path = require('path');

const buildDir = process.env.EAS_BUILD_WORKINGDIR || process.cwd();
const appName = process.env.LIFESTYLE_BUILD_APP || '';

const APP_DIRS = {
  user: 'apps/mobile-user',
  driver: 'apps/mobile-driver',
  merchant: 'apps/mobile-merchant',
};

if (!appName || !APP_DIRS[appName]) {
  console.log('[eas-pre-install] LIFESTYLE_BUILD_APP not set or invalid, skipping isolation.');
  process.exit(0);
}

const appDir = path.join(buildDir, APP_DIRS[appName]);
if (!fs.existsSync(appDir)) {
  console.log('[eas-pre-install] App dir not found:', APP_DIRS[appName]);
  process.exit(1);
}

const pkgPath = path.join(appDir, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.log('[eas-pre-install] package.json not found in', APP_DIRS[appName]);
  process.exit(1);
}

console.log('[eas-pre-install] Monorepo detected. Isolating', APP_DIRS[appName], '...');

// 1. Copy package.json và package-lock.json (nếu có) lên root
fs.copyFileSync(pkgPath, path.join(buildDir, 'package.json'));
const lockPath = path.join(appDir, 'package-lock.json');
if (fs.existsSync(lockPath)) {
  fs.copyFileSync(lockPath, path.join(buildDir, 'package-lock.json'));
  console.log('[eas-pre-install] Copied package-lock.json to root');
}

// 2. Xóa các workspace khác (KHÔNG xóa app đang build - cần move trước)
const otherApps = ['apps/web', 'apps/web-admin', 'apps/mobile-driver', 'apps/mobile-merchant', 'apps/mobile-app', 'apps/zalo-mini-app'];
const toRemove = [...otherApps, 'services', 'packages', 'backend', 'infrastructure', 'docs', 'pnpm-lock.yaml'];

toRemove.forEach((rel) => {
  const full = path.join(buildDir, rel);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true });
    console.log('[eas-pre-install] Removed', rel);
  }
});

// 3. Di chuyển nội dung app lên root
const entries = fs.readdirSync(appDir, { withFileTypes: true });
for (const e of entries) {
  if (e.name === 'package.json' || e.name === 'package-lock.json') continue;
  const src = path.join(appDir, e.name);
  const dest = path.join(buildDir, e.name);
  if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
  fs.renameSync(src, dest);
}

// 4. Xóa thư mục apps còn lại
try {
  const appsPath = path.join(buildDir, 'apps');
  if (fs.existsSync(appsPath)) fs.rmSync(appsPath, { recursive: true });
} catch (err) {
  console.warn('[eas-pre-install] Could not remove apps dir:', err.message);
}

console.log('[eas-pre-install] Done. Root now contains', appName, 'only.');
