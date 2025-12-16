import { EventMap } from '@common/event/types.js'
import { Runtime } from '@runtimes/runtime.js'

export class Engine<In extends EventMap = any, Out extends EventMap = any> {

  constructor(
    private runtime: Runtime<In, Out>
  ) { }

  start() {
    this.runtime.send('engine:start' as keyof In, undefined as In[keyof In])
  }
}
