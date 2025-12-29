import { EventName, ListenerHandler } from '../../runtime/contracts/event'
import { IEventBus, ListenersMap } from './types'

export class EventBus implements IEventBus {

  protected listeners: ListenersMap = Object.create(null)

  on(event: EventName, listener: ListenerHandler) {
    const listeners = this.listeners[event]

    if (listeners) {
      listeners.push(listener)
    } else {
      this.listeners[event] = [listener]
    }
  }

  emit(event: EventName, data: unknown) {
    const listeners = this.listeners[event]

    if (!listeners) {
      return
    }

    for (let i = 0, length = listeners.length; i < length; i++) {
      listeners[i](data)
    }
  }

  off(event: EventName, listener: ListenerHandler) {
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

  clear(event?: EventName) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = Object.create(null)
    }
  }
}
