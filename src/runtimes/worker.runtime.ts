import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class WorkerRuntime<Events extends EventMap = any> extends Runtime<Events> {

  constructor(
    private worker: Worker
  ) {
    super()

    worker.onmessage = ({ data }) => {
      const { type, payload } = data

      this.emit(type, payload)
    }
  }

  send<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]) {
    this.worker.postMessage({ type: event, payload })
  }
}
