import { WorkerHostRuntime } from '@runtimes/worker-host.runtime.js'

type WorkerInEvents = {
  'engine:tick': number
}

type WorkerOutEvents = {
  'engine:start': undefined
}

const runtime = new WorkerHostRuntime<WorkerInEvents, WorkerOutEvents>()

runtime.on('engine:start', () => {
  console.log('Worker: Engine started, starting tick loop')

  setInterval(() => {
    const fps = 60
    runtime.send('engine:tick', fps)
  }, 1000 / 60)
})
