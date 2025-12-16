import { EventMap } from '@common/event/types.js'

export type Listener<T = any> = (payload: T) => void

type ListenersMap<Events extends EventMap = any> = {
  [KEvent in keyof Events]?: Listener<Events[KEvent]>[]
}

export interface IEmitter<Events extends EventMap = any> {
  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void
  on<KEvent extends keyof Events>(event: KEvent, listener: Listener<Events[KEvent]>): void
  emit<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]): void
  off<KEvent extends keyof Events>(event: KEvent, listener: Listener<Events[KEvent]>): void
  clear<K extends keyof Events>(event?: K): void
}

export class EventEmitter<Events extends EventMap = any> implements IEmitter<Events> {

  protected listeners: ListenersMap<Events> = Object.create(null)

  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    const wrapper: Listener<Events[K]> = (payload) => {
      this.off(event, wrapper)
      listener(payload)
    }

    this.on(event, wrapper)
  }

  on<KEvent extends keyof Events>(event: KEvent, listener: Listener<Events[KEvent]>) {
    const listeners = this.listeners[event]

    if (listeners) {
      listeners.push(listener)
    } else {
      this.listeners[event] = [listener]
    }
  }

  emit<KEvent extends keyof Events>(event: KEvent, payload: Events[KEvent]) {
    const listeners = this.listeners[event]

    if (!listeners) {
      return
    }

    for (let i = 0, length = listeners.length; i < length; i++) {
      listeners[i](payload)
    }
  }

  off<KEvent extends keyof Events>(event: KEvent, listener: Listener<Events[KEvent]>) {
    const listeners = this.listeners[event]

    if (!listeners) {
      return
    }

    const index = listeners.indexOf(listener)

    if (index !== -1) {
      listeners[index] = listeners[listeners.length - 1]
      listeners.pop()
    }

    if (listeners.length === 0) {
      delete this.listeners[event]
    }
  }

  clear<K extends keyof Events>(event?: K) {
    if (event) {
      delete this.listeners[event]
    } else {
      this.listeners = Object.create(null)
    }
  }
}
