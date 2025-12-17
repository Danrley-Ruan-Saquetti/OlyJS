import { EventMap } from '@common/event/types';

export type Listener<T = any> = (data: T) => void

type ListenersMap<Events extends EventMap = any> = {
  [KEvent in keyof Events]?: Listener<Events[KEvent]>[]
}

export interface IEventEmitter<Events extends EventMap = any> {
  once<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void;
  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void;
  emit<E extends keyof Events>(event: E, data: Events[E]): void;
  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void;
  clear(event?: keyof Events): void;
}

export class EventEmitter<Events extends EventMap = any> implements IEventEmitter<Events> {

  protected listeners: ListenersMap<Events> = Object.create(null)

  once<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
    const wrapper: Listener<Events[E]> = data => {
      this.off(event, wrapper)
      listener(data)
    }

    this.on(event, wrapper)
  }

  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
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

  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>) {
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
