import { EventName } from '../../runtime/contracts/event'
import { BufferedEventQueue } from './buffered-event-queue'
import { IBufferedEventBus, IBufferedEventQueue, IEventBusPriority } from './types'

export class BufferedEventBus implements IBufferedEventBus {

  protected eventQueue: IBufferedEventQueue = new BufferedEventQueue()

  constructor(
    protected emitter: IEventBusPriority
  ) { }

  send(event: EventName, data: unknown) {
    this.eventQueue.send(event, data)
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
