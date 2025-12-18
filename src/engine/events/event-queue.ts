import { EventBuffer, EventMap, IEventQueueExecuter, IEventQueueSender } from '@runtime/contracts/event.js'

export class BufferedEventQueue<Events extends EventMap = {}> implements IEventQueueSender<Events>, IEventQueueExecuter<Events> {

  private buffer: EventBuffer<Events>[] = []
  private swap: EventBuffer<Events>[] = []

  send<E extends keyof Events>(event: E, data: Events[E]) {
    this.buffer.push({ event, data })
  }

  execute() {
    const temp = this.buffer

    this.buffer = this.swap
    this.swap = temp

    this.buffer.length = 0

    return this.swap
  }
}
