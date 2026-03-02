#!/usr/bin/env node
/**
 * Generate favicon sizes from apple-touch-icon.png
 * Run: pnpm generate-favicons
 */
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { writeFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const srcPath = join(publicDir, 'apple-touch-icon.png');

async function main() {
  const sharp = (await import('sharp')).default;
  const img = await sharp(srcPath);

  await img.clone().resize(32, 32).toFile(join(publicDir, 'favicon-32x32.png'));
  await img.clone().resize(16, 16).toFile(join(publicDir, 'favicon-16x16.png'));

  try {
    const png16 = await sharp(srcPath).resize(16, 16).png().toBuffer();
    const png32 = await sharp(srcPath).resize(32, 32).png().toBuffer();
    const toIco = (await import('to-ico')).default;
    const icoBuffer = await toIco([png16, png32]);
    await writeFile(join(publicDir, 'favicon.ico'), icoBuffer);
  } catch {
    const { copyFile } = await import('fs/promises');
    await copyFile(join(publicDir, 'favicon-32x32.png'), join(publicDir, 'favicon.ico'));
    console.warn('to-ico not found, favicon.ico is PNG format (install to-ico for proper ICO)');
  }

  console.log('Favicons generated: favicon-16x16.png, favicon-32x32.png, favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
