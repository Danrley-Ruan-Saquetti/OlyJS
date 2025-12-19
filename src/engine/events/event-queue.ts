import { EventBuffer, IEventQueue } from '@engine/events/types'
import { EventMap, IEventSender } from '@runtime/contracts/event'

export class BufferedEventQueue<Events extends EventMap = {}> implements IEventSender<Events>, IEventQueue {

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
