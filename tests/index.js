import { Engine, MainWorker, WorkerRuntime } from '../dist/index.js'

const runtime = new WorkerRuntime(new MainWorker())

const engine = new Engine(runtime)

runtime.on('engine:tick', fps => {
  console.log(`Main: Received tick with fps ${fps}`)
})

engine.start()
