/**
 * EAS Build Pre-Install Hook
 * Chỉ giữ apps/mobile-driver, loại bỏ các workspace khác để tránh lỗi @lifestyle/* workspace:*
 */
const fs = require('fs');
const path = require('path');

const buildDir = process.env.EAS_BUILD_WORKINGDIR || process.cwd();

// Nếu đang ở root monorepo, chuyển nội dung apps/mobile-driver lên root
const mobileDriverPath = path.join(buildDir, 'apps', 'mobile-driver');
if (fs.existsSync(mobileDriverPath)) {
  console.log('[eas-pre-install] Monorepo detected. Isolating apps/mobile-driver...');
  
  const pkgPath = path.join(mobileDriverPath, 'package.json');
  if (fs.existsSync(pkgPath)) {
    // Copy package.json và package-lock.json lên root (ghi đè)
    const lockPath = path.join(mobileDriverPath, 'package-lock.json');
    fs.copyFileSync(pkgPath, path.join(buildDir, 'package.json'));
    if (fs.existsSync(lockPath)) {
      fs.copyFileSync(lockPath, path.join(buildDir, 'package-lock.json'));
      console.log('[eas-pre-install] Copied package-lock.json to root');
    }
    
    // Xóa root package.json workspace cũ (đã copy mobile-driver's)
    // Xóa các thư mục khác để npm chỉ thấy 1 package
    const toRemove = ['apps/web', 'apps/web-admin', 'apps/mobile-user', 'apps/mobile-merchant', 
                      'apps/mobile-app', 'apps/zalo-mini-app', 'services', 'packages', 
                      'backend', 'infrastructure', 'docs', 'pnpm-lock.yaml'];
    
    toRemove.forEach(rel => {
      const full = path.join(buildDir, rel);
      if (fs.existsSync(full)) {
        fs.rmSync(full, { recursive: true });
        console.log('[eas-pre-install] Removed', rel);
      }
    });
    
    // Di chuyển nội dung mobile-driver lên root
    const entries = fs.readdirSync(mobileDriverPath, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === 'package.json' || e.name === 'package-lock.json') continue; // already copied
      const src = path.join(mobileDriverPath, e.name);
      const dest = path.join(buildDir, e.name);
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true });
      fs.renameSync(src, dest);
    }
    
    // Xóa thư mục apps (đã di chuyển nội dung)
    try {
      fs.rmSync(path.join(buildDir, 'apps'), { recursive: true });
    } catch (e) {
      console.warn('[eas-pre-install] Could not remove apps dir:', e.message);
    }
    
    console.log('[eas-pre-install] Done. Root now contains mobile-driver only.');
  }
}
