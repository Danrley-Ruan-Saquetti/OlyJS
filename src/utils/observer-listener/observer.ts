import { Listener, ListenerHandle } from './listener.js'

export class ObserverListener {

  private listeners = new Map<string, Listener[]>()

  on(event: string, handler: ListenerHandle) {
    const listeners = this.getListenersByEvent(event)
    const listener = new Listener(handler)

    listeners.push(listener)
    this.listeners.set(event, listeners)

    return listener
  }

  off(event: string, listener: Listener) {
    const listeners = this.getListenersByEvent(event)

    const index = listeners.indexOf(listener)

    if (index < 0) {
      return
    }

    listeners.splice(index, 1)

    if (listeners.length) {
      this.listeners.set(event, listeners)
    } else {
      this.listeners.delete(event)
    }
  }

  emit(event: string, data: any) {
    const listeners = this.getListenersByEvent(event)

    const len = listeners.length
    let i = 0

    while (i < len) {
      listeners[i].handler(data)
      i++
    }
  }

  getListenersByEvent(event: string) {
    return this.listeners.get(event) || []
  }
}
