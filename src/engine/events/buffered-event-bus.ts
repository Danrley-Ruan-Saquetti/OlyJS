import { EventMap, Listener } from '../../runtime/contracts/event'
import { BufferedEventQueue } from './buffered-event-queue'
import { EventBus } from './event-bus'
import { IBufferedEventBus } from './types'

export class BufferedEventBus<Events extends EventMap = {}> implements IBufferedEventBus<Events> {

  protected emitter = new EventBus<Events>()
  protected eventQueue = new BufferedEventQueue<Events>()

  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.emitter.on(event, listener)
  }

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.eventQueue.send(event as keyof Events, data as any)
  }

  emit<E extends keyof Events>(event: E, data: Events[E]): void {
    this.emitter.emit(event, data)
  }

  execute() {
    const count = this.eventQueue.flush()

    let i = 0
    while (i < count) {
      const event = this.eventQueue.getFlushedEvent(i)
      const data = this.eventQueue.getFlushedData(i)

      this.emitter.emit(event, data)

      i++
    }
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof Events) {
    this.emitter.clear(event)
  }
}
