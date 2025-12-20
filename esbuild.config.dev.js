import esbuild from 'esbuild'
import common from './esbuild.config.common.js'

const ctx = await esbuild.context({
  ...common,
  tsconfig: 'tsconfig.dev.json',
})

await ctx.watch()
console.log('Watch mode activated.')
