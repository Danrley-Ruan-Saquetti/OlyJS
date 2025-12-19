import { build } from 'esbuild'
import dtsPlugin from 'esbuild-plugin-d.ts'
import path from 'path'

build({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  plugins: [
    dtsPlugin({
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  minify: false,
  tsconfig: 'tsconfig.build.json',
  alias: {
    '@': path.resolve('./src')
  }
}).catch(() => process.exit(1))
