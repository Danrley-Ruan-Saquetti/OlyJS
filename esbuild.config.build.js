import { build } from 'esbuild'
import common from './esbuild.config.common.js'

build({
  ...common,
  tsconfig: 'tsconfig.build.json',
}).catch(() => process.exit(1))
