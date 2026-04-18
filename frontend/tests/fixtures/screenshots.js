import fs from 'fs';
import path from 'path';

export function getRunScreenshotDir(testInfo) {
  const specName = path.basename(testInfo.file).replace(/\.[jt]s$/, '');
  const dir = path.join(testInfo.outputDir, '..', '..', 'screenshots', specName, testInfo.title.replace(/[^\w\-]+/g, '_'));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function shot(page, dir, name) {
  await page.screenshot({
    path: path.join(dir, `${name}.png`),
    fullPage: true,
  });
}