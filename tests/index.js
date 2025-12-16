import { Engine, WorkerRuntime } from '../dist/index.js'

const worker = new Worker(new URL('../dist/workers/main.worker.js', import.meta.url), { type: 'module' })
const runtime = new WorkerRuntime(worker)

const engine = new Engine(runtime)

runtime.on('engine:tick', fps => {
  console.log(`Main: Received tick with fps ${fps}`)
})

engine.start()
