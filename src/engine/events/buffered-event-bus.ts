import { EventMap } from '../../runtime/contracts/event'
import { BufferedEventQueue } from './buffered-event-queue'
import { IBufferedEventBus, IBufferedEventQueue, IEventBus } from './types'

export class BufferedEventBus<Events extends EventMap = {}> implements IBufferedEventBus<Events> {

  protected eventQueue: IBufferedEventQueue<Events> = new BufferedEventQueue<Events>()

  constructor(
    protected emitter: IEventBus<Events>
  ) { }

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.eventQueue.send(event as keyof Events, data as any)
  }

  execute() {
    const count = this.eventQueue.flush()

    let i = 0
    while (i < count) {
      this.emitter.emit(
        this.eventQueue.getFlushedKey(i),
        this.eventQueue.getFlushedData(i)
      )
      i++
    }
  }
}
