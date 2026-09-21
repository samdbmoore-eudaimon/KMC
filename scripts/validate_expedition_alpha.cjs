const sharp = require("sharp");

const files = process.argv.slice(2);
if (!files.length) throw new Error("Pass one or more expedition art files to validate");

async function check(file) {
  const { data } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let opaque = 0;
  let opaqueNeutralLight = 0;
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] < 8) continue;
    opaque += 1;
    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];
    if (Math.max(red, green, blue) - Math.min(red, green, blue) < 13 && red > 178 && green > 178 && blue > 178) opaqueNeutralLight += 1;
  }
  if (opaqueNeutralLight > Math.max(800, opaque * 0.015)) throw new Error(`${file}: likely opaque checkerboard background (${opaqueNeutralLight} neutral light pixels)`);
  console.log(`${file}: alpha pass`);
}

Promise.all(files.map(check)).catch((error) => { console.error(error.message); process.exit(1); });
