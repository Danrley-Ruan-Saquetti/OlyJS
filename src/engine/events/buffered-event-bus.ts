import { EventBus } from '@engine/events/event-bus'
import { BufferedEventQueue } from '@engine/events/event-queue'
import { IBufferedEventBus } from '@engine/events/types.d'
import { EventMap, Listener } from '@runtime/contracts/event.d'

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
    for (const { event, data } of this.eventQueue.flush()) {
      this.emitter.emit(event, data)
    }
  }

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    this.emitter.off(event, listener)
  }

  clear(event?: keyof Events) {
    this.emitter.clear(event)
  }
}
