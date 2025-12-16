import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class WorkerHostRuntime<Events extends EventMap = any> extends Runtime<Events> {

  constructor() {
    super()

    self.onmessage = ({ data }) => {
      const { type, payload } = data

      this.emit(type, payload)
    }
  }

  send<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]): void {
    self.postMessage({ type: event, payload })
  }
}
