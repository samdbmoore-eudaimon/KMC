// One-off processor for the new pixel-art UI kit (button, panel frame, compact logo).
// Crops/trims/keys-out backgrounds as needed, resizes, and writes base64 data-URI
// snippets to scratch files for review before hand-pasting into kq-art.js.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const DL = "C:/Users/samdb/Downloads";
const OUT = path.join(__dirname, "ui-asset-work");

async function trimToContent(buf) {
  return sharp(buf).trim({ threshold: 10 }).toBuffer();
}

async function toDataUri(buf, mime = "image/png") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

(async () => {
  // 1) Button: crop into left (default) / right (pressed) halves, trim, resize.
  const buttonSrc = path.join(DL, "ChatGPT Image Jul 13, 2026, 09_42_05 PM.png");
  const bMeta = await sharp(buttonSrc).metadata();
  const half = Math.floor(bMeta.width / 2);
  const leftBuf = await sharp(buttonSrc).extract({ left: 0, top: 0, width: half, height: bMeta.height }).toBuffer();
  const rightBuf = await sharp(buttonSrc).extract({ left: half, top: 0, width: bMeta.width - half, height: bMeta.height }).toBuffer();
  const btnDefault = await sharp(await trimToContent(leftBuf)).resize({ width: 480 }).png({ quality: 90 }).toBuffer();
  const btnPressed = await sharp(await trimToContent(rightBuf)).resize({ width: 480 }).png({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(OUT, "btn-default.png"), btnDefault);
  fs.writeFileSync(path.join(OUT, "btn-pressed.png"), btnPressed);
  console.log("button default:", (await sharp(btnDefault).metadata()).width, "x", (await sharp(btnDefault).metadata()).height, btnDefault.length, "bytes");
  console.log("button pressed:", (await sharp(btnPressed).metadata()).width, "x", (await sharp(btnPressed).metadata()).height, btnPressed.length, "bytes");

  // 2) Panel frame: already has real alpha at centre, just resize down for file size.
  const frameSrc = path.join(DL, "ChatGPT Image Jul 13, 2026, 09_42_53 PM.png");
  const frameBuf = await sharp(frameSrc).resize({ width: 512 }).png({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(OUT, "panel-frame.png"), frameBuf);
  const fMeta = await sharp(frameBuf).metadata();
  console.log("panel frame:", fMeta.width, "x", fMeta.height, frameBuf.length, "bytes");

  // 3) Logo: key out the near-white background to alpha, trim, resize.
  const logoSrc = path.join(DL, "ChatGPT Image Jul 13, 2026, 09_49_08 PM.png");
  const { data, info } = await sharp(logoSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    // Near-white/light-grey checkerboard background -> transparent. The logo art itself
    // is orange/gold/black so this threshold won't touch it.
    if (r > 225 && g > 225 && b > 225) out[i + 3] = 0;
  }
  const keyedBuf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  const trimmedLogo = await sharp(keyedBuf).trim({ threshold: 10 }).resize({ width: 900 }).png({ quality: 90 }).toBuffer();
  fs.writeFileSync(path.join(OUT, "logo-compact.png"), trimmedLogo);
  const lMeta = await sharp(trimmedLogo).metadata();
  console.log("logo compact:", lMeta.width, "x", lMeta.height, trimmedLogo.length, "bytes", "alpha:", lMeta.hasAlpha);
})().catch((e) => { console.error(e); process.exit(1); });
