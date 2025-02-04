export type ListenerHandler<T = any | null> = (data: T) => void

export type IEvents = Record<string, any | null>

export class ObserverListener<Events extends IEvents> {

  private listeners = new Map<keyof Events, ListenerHandler[]>()

  on<EventName extends keyof Events>(event: EventName, handler: ListenerHandler<Events[EventName]>) {
    const listeners = this.getListenersByEvent(event)

    listeners.push(handler)

    this.listeners.set(event, listeners)
  }

  off<EventName extends keyof Events>(event: EventName, handler: ListenerHandler<Events[EventName]>) {
    if (!this.listeners.has(event)) {
      return
    }

    const listeners = this.listeners.get(event)?.filter(event => event !== handler) || []

    if (listeners.length) {
      this.listeners.set(event, listeners)
    } else {
      this.listeners.delete(event)
    }
  }

  emit<EventName extends keyof Events>(event: EventName, data: Events[EventName] = null as any) {
    if (!this.listeners.has(event)) {
      return
    }

    const listeners = this.getListenersByEvent(event)

    for (const listenerHandler of listeners) {
      listenerHandler(data)
    }
  }

  getListenersByEvent<EventName extends keyof Events>(event: EventName) {
    return (this.listeners.get(event) || []) as ListenerHandler<Events[EventName]>[]
  }

  getAllListeners() {
    return [...this.listeners.values()]
  }

  removeAllListeners() {
    this.listeners.clear()
  }
}