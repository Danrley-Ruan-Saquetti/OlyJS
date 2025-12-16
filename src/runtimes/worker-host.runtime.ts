import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class WorkerHostRuntime<In extends EventMap = any, Out extends EventMap = any> extends Runtime<In, Out> {

  constructor() {
    super()

    self.onmessage = ({ data }) => {
      const { type, payload } = data

      this.emit(type, payload)
    }
  }

  send<KEvent extends keyof In>(event: KEvent, payload: In[KEvent]): void {
    self.postMessage({ type: event, payload })
  }
}
