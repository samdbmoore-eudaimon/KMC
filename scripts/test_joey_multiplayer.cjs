const path = require('node:path');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');
const output = buildSync({
  absWorkingDir: root,
  entryPoints: ['./joey-multiplayer.test.js'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  logLevel: 'silent',
}).outputFiles[0].text;

const execute = new Function('require', 'module', 'exports', '__filename', '__dirname', output);
execute(require, module, module.exports, __filename, __dirname);
