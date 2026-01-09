export default {
  entryPoints: ['./src/index.ts'],
  outfile: './dist/engine/index.js',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  minify: false,
}
