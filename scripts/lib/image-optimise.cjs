// esbuild plugin: re-encodes every bundled image as a resized WebP data URL.
// Source art is never modified; encoded results are cached in .cache/wm-images/ keyed by
// content hash + settings, so only new or changed art is re-encoded on later builds.
// Covers both imported image files and large base64 data URLs inlined in the *-art.js
// modules (and WallabyMaths.jsx), which are decoded, re-encoded and substituted in place.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const QUALITY = 80;
const ALPHA_QUALITY = 90;
const MIN_INLINE_BASE64 = 20000;

// Longest-side caps. Expedition board sprites render at 96-160px (EXPEDITIONS_ART_PIPELINE.md
// specifies 384px runtime WebPs), so they get a tight cap; full-screen plates keep the most.
function maxSideFor(file) {
  const p = (file || "").replace(/\\/g, "/").toLowerCase();
  if (/background|backdrop|-bg[-.]|title/.test(p)) return 1280;
  if (/\/expeditions\/.*\/runtime\/(characters|enemies|objectives|mechanisms|props|terrain)\//.test(p)) return 512;
  if (/\/expeditions\/.*\/runtime\/effects\//.test(p)) return 768;
  return 1024;
}

function imageOptimisePlugin({ root, stats = { files: 0, inline: 0, before: 0, after: 0 } } = {}) {
  const cacheDir = path.join(root, ".cache", "wm-images");
  fs.mkdirSync(cacheDir, { recursive: true });

  async function optimise(buf, mime, maxSide) {
    const settings = `v1:${maxSide}:${QUALITY}:${ALPHA_QUALITY}`;
    const key = crypto.createHash("sha1").update(settings).update(buf).digest("hex");
    const cached = path.join(cacheDir, key + ".bin");
    if (fs.existsSync(cached)) {
      const out = fs.readFileSync(cached);
      return out.length ? { buf: out, mime: "image/webp" } : { buf, mime };
    }
    let out;
    try {
      out = await sharp(buf)
        .resize({ width: maxSide, height: maxSide, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, alphaQuality: ALPHA_QUALITY, effort: 5 })
        .toBuffer();
    } catch (err) {
      return { buf, mime };
    }
    // An empty cache file records "the original was already smaller; keep it".
    if (out.length >= buf.length) {
      fs.writeFileSync(cached, Buffer.alloc(0));
      return { buf, mime };
    }
    fs.writeFileSync(cached, out);
    return { buf: out, mime: "image/webp" };
  }

  const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

  return {
    name: "wm-image-optimise",
    setup(build) {
      build.onLoad({ filter: /\.(png|jpe?g|webp)$/i }, async (args) => {
        const src = fs.readFileSync(args.path);
        const { buf, mime } = await optimise(src, MIME[path.extname(args.path).toLowerCase()], maxSideFor(args.path));
        stats.files++;
        stats.before += src.length;
        stats.after += buf.length;
        return {
          contents: `export default ${JSON.stringify(`data:${mime};base64,${buf.toString("base64")}`)};`,
          loader: "js",
        };
      });

      build.onLoad({ filter: /(-art\.js|WallabyMaths\.jsx)$/ }, async (args) => {
        if (args.path.includes("node_modules")) return undefined;
        const text = fs.readFileSync(args.path, "utf-8");
        const re = /data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)/g;
        const jobs = [];
        let m;
        while ((m = re.exec(text))) {
          if (m[2].length < MIN_INLINE_BASE64) continue;
          jobs.push({ start: m.index, end: m.index + m[0].length, mime: m[1], b64: m[2] });
        }
        if (!jobs.length) return undefined;
        const results = await Promise.all(
          jobs.map((j) => optimise(Buffer.from(j.b64, "base64"), j.mime, 1024))
        );
        let out = "";
        let pos = 0;
        jobs.forEach((j, i) => {
          const { buf, mime } = results[i];
          stats.inline++;
          stats.before += Math.floor((j.b64.length * 3) / 4);
          stats.after += buf.length;
          out += text.slice(pos, j.start) + `data:${mime};base64,${buf.toString("base64")}`;
          pos = j.end;
        });
        out += text.slice(pos);
        return { contents: out, loader: args.path.endsWith(".jsx") ? "jsx" : "js" };
      });
    },
  };
}

module.exports = { imageOptimisePlugin };
