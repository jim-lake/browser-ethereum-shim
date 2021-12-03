import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import * as fs from 'fs/promises';
import * as util from 'util';
import path from 'path';
import rimraf from 'rimraf';

import pkg from './package.json';

export default [
  {
    input: 'src/browser_ethereum_shim.ts',
    output: {
      name: 'browser-ethereum-shim',
      file: pkg.rollupOutput,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      typescript(),
      terser(),
      {
        buildStart,
        writeBundle,
      },
    ],
  },
];

async function buildStart() {
  await util.promisify(rimraf)(path.join(__dirname, 'dist'));
}
async function writeBundle(arg1, arg2) {
  console.log('writeBundle:');
  const content = await fs.readFile(path.join(__dirname, pkg.rollupOutput), {
    encoding: 'utf8',
  });
  if (content && content.length > 0) {
    const blob = `export const RAW_JS = ${JSON.stringify(content)};
`;
    await fs.writeFile(path.join(__dirname, pkg.main), blob);
  } else {
    this.error('bad content');
  }
}
