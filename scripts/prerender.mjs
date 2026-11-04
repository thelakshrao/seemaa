
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const serverDir = path.join(root, "dist-server");

const serverFile = (await readdir(serverDir)).find((f) => /^entry-server\.m?js$/.test(f));
if (!serverFile) throw new Error("dist-server/entry-server.js not found. Did the SSR build run?");

const { render } = await import(pathToFileURL(path.join(serverDir, serverFile)).href);
const seoData = await import(pathToFileURL(path.join(root, "src/seo/seoData.js")).href);
const { pages, getSeo, SITE_URL, SITE_NAME, OG_IMAGE } = seoData;

const template = await readFile(path.join(dist, "index.html"), "utf-8");
for (const marker of ["<!--app-head-->", "<!--app-html-->"]) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`);
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function headTags(seo) {
  const tags = [
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${seo.noindex ? "noindex, follow" : "index, follow"}" />`,
  ];
  if (seo.canonical) {
    tags.push(`<link rel="canonical" href="${esc(seo.canonical)}" />`);
    tags.push(`<meta property="og:url" content="${esc(seo.canonical)}" />`);
  }
  tags.push(
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:image" content="${esc(OG_IMAGE)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`
  );
  if (seo.jsonLd) {
    const json = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    tags.push(`<script type="application/ld+json" data-seo-jsonld>${json}</script>`);
  }
  return tags.join("\n    ");
}

function buildHtml(url) {
  const seo = getSeo(url);
  const appHtml = render(url);
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(seo.title)}</title>`)
    .replace("<!--app-head-->", () => headTags(seo))
    .replace("<!--app-html-->", () => appHtml);
}

async function writePage(url, outFile) {
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, buildHtml(url), "utf-8");
}

const urls = Object.keys(pages);
for (const url of urls) {
  const outFile = url === "/" ? path.join(dist, "index.html") : path.join(dist, url, "index.html");
  await writePage(url, outFile);
  console.log("prerendered", url);
}

await writePage("/page-not-found", path.join(dist, "404.html"));
console.log("prerendered 404.html");

const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url><loc>${SITE_URL}${u === "/" ? "/" : u}</loc></url>`).join("\n") +
  `\n</urlset>\n`;
await writeFile(path.join(dist, "sitemap.xml"), sitemap, "utf-8");
console.log(`sitemap.xml written (${urls.length} URLs)`);
