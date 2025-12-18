import { EventBuffer, EventMap, IEventQueueFlusher, IEventQueueSender } from '@runtime/contracts/event.js'

export class BufferedEventQueue<Events extends EventMap = {}> implements IEventQueueSender<Events>, IEventQueueFlusher {

  private buffer: EventBuffer<Events>[] = []
  private swap: EventBuffer<Events>[] = []

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.buffer.push({ event, data })
  }

  flush() {
    const temp = this.buffer

    this.buffer = this.swap
    this.swap = temp

    this.buffer.length = 0

    return this.swap
  }
}
