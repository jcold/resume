import { readFileSync } from "fs";
import { access, readdir } from "fs/promises";
import { createRequire } from "module";
import path from "path";
import { pathToFileURL } from "url";

const playwrightBin = process.env.PLAYWRIGHT ?? "/Users/dayu/Library/pnpm/playwright";
const shim = readFileSync(playwrightBin, "utf8");
const rel = shim.match(/"(\$basedir\/[^"]+\/playwright)\/cli\.js"/);
if (!rel) {
  console.error(`cannot locate playwright package from ${playwrightBin}`);
  process.exit(1);
}
const pkg = rel[1].replace("$basedir", path.dirname(playwrightBin));
const { chromium } = createRequire(import.meta.url)(pkg);

const SKIP_DIRS = new Set(["node_modules", ".git", "cache"]);

// 只收 dist/<side>/index.html，跳过 dist/index.html 以及 dist 以外的页面。
async function findIndexHtml(dir, acc) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.name.startsWith(".") || SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (!ent.isDirectory()) continue;
    if (ent.name === "dist") {
      const children = await readdir(full, { withFileTypes: true });
      for (const child of children) {
        if (!child.isDirectory() || child.name.startsWith(".")) continue;
        const html = path.join(full, child.name, "index.html");
        try {
          await access(html);
          acc.push(html);
        } catch {
          // 子目录没有 index.html 时跳过
        }
      }
      continue;
    }
    await findIndexHtml(full, acc);
  }
}

const root = path.resolve(process.argv[2] ?? ".");
const htmlFiles = [];
const entries = await readdir(root, { withFileTypes: true });
for (const ent of entries) {
  if (!ent.isDirectory()) continue;
  if (ent.name.startsWith(".") || SKIP_DIRS.has(ent.name)) continue;
  await findIndexHtml(path.join(root, ent.name), htmlFiles);
}

if (htmlFiles.length === 0) {
  console.error(`no dist/*/index.html under ${root}`);
  process.exit(1);
}

const browser = await chromium.launch();
try {
  for (const file of htmlFiles) {
    const dir = path.dirname(file);
    const out = path.join(dir, `余广伟-${path.basename(dir)}.pdf`);
    const page = await browser.newPage();
    try {
      await page.goto(pathToFileURL(file).href, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.pdf({
        path: out,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
      });
      console.log(out);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
