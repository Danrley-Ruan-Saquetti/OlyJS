import { EventMap, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBus, ListenersMap } from './types'

export class EventBus<Events extends EventMap = {}> implements IEventBus<Events> {

  protected listeners: ListenersMap<Events> = Object.create(null)

  on<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>) {
    const listeners = this.listeners[event]

    if (listeners) {
      listeners.push(listener)
    } else {
      this.listeners[event] = [listener]
    }
  }

  emit<E extends keyof Events>(event: E, data: Events[E]) {
    const listeners = this.listeners[event]

    if (!listeners) {
      return
    }

    for (let i = 0, length = listeners.length; i < length; i++) {
      listeners[i](data)
    }
  }

  off<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>) {
    const listeners = this.listeners[event]

    if (!listeners) {
      return
    }

    const index = listeners.indexOf(listener)

    if (index !== -1) {
      listeners[index] = listeners[listeners.length - 1]
      listeners.pop()
    }

    if (!listeners.length) {
      delete this.listeners[event]
    }
  }

  clear(event?: keyof Events) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = Object.create(null)
    }
  }
}
