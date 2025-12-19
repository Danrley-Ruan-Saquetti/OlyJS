import esbuild from 'esbuild'
import dtsPlugin from 'esbuild-plugin-d.ts'
import path from 'path'

const ctx = await esbuild.context({
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  plugins: [
    dtsPlugin({
      tsconfigPath: './tsconfig.dev.json',
    }),
  ],
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2020',
  sourcemap: true,
  minify: false,
  tsconfig: 'tsconfig.dev.json',
  alias: {
    '@': path.resolve('./src')
  }
})

await ctx.watch()
console.log('Watch mode activated.')
