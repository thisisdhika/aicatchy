import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { defineConfig } from 'rollup';

const pkg = JSON.parse(readFileSync(fileURLToPath(new URL('./package.json', import.meta.url)), 'utf8'));

export default defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      exports: 'named',
      sourcemap: true,
    },
  ],
  external: [],
  plugins: [
    {
      name: 'typescript',
      generateBundle(options, bundle) {
        this.emitFile({
          type: 'asset',
          fileName: 'package.json',
          source: JSON.stringify(pkg, null, 2),
        });
      },
    },
  ],
});