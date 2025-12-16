import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class WorkerRuntime<In extends EventMap, Out extends EventMap> extends Runtime<In, Out> {

  constructor(
    private worker: Worker
  ) {
    super()

    worker.onmessage = ({ data }) => {
      const { type, payload } = data

      this.emit(type, payload)
    }
  }

  send<KEvent extends keyof In>(event: KEvent, payload: In[KEvent]) {
    this.worker.postMessage({ type: event, payload })
  }
}
