import { EventMap, EventName } from '@common/event/types.js'

type EventBuffer<Type extends EventName = any, Payload = any> = {
  type: keyof Type
  payload: Payload
}

export class EventQueue<Events extends EventMap = any> {

  private buffer: EventBuffer[] = []
  private swap: EventBuffer[] = []

  push<KEvent extends keyof Events>(type: KEvent, payload: Events[KEvent]) {
    this.buffer.push({ type, payload })
  }

  flush() {
    const temp = this.buffer

    this.buffer = this.swap
    this.swap = temp

    this.buffer.length = 0

    return this.swap
  }
}
