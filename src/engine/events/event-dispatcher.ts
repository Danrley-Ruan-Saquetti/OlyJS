import { IDispatcher } from '../../runtime/buffer/type'
import { EventPriority, EventTuple, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBusPriority } from './types'

export class EventDispatcher implements IDispatcher<EventTuple> {

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

  dispatch(event: EventTuple) {
    this.bus.emit(event[0], event[1])
  }
}
