import { EventMap, EventName } from '@runtime/contracts/event.js'

type EventBuffer<Event extends EventName = any, Data = any> = {
  event: Event
  data: Data
}

export class EventQueue<Events extends EventMap = any> {

  private buffer: EventBuffer[]
  private swap: EventBuffer[]

  push<E extends keyof Events>(event: E, data: Events[E]) {
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
