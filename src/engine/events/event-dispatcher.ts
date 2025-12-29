import { EventPriority, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBusPriority } from './types'

export class EventDispatcher {

  constructor(
    private bus: IEventBusPriority
  ) { }

  on(event: string, listener: ListenerHandler, priority: EventPriority = EventPriority.NORMAL) {
    this.bus.on(event, listener, priority)
  }

  off(event: string, listener: ListenerHandler) {
    this.bus.off(event, listener)
  }

  clear(event?: string) {
    this.bus.clear(event)
  }

  dispatch(event: string, data: unknown) {
    this.bus.emit(event, data)
  }
}
