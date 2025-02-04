export type EventHandler = (data: any | null) => void

export class EventBus {

  private static listeners = new Map<string, EventHandler[]>()

  static on(event: string, handler: EventHandler) {
    const listeners = this.getListenersByEvent(event)

    listeners.push(handler)

    this.listeners.set(event, listeners)
  }

  static off(event: string, handler: EventHandler) {
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

  static emit(event: string, data: any | null = null) {
    if (!this.listeners.has(event)) {
      return
    }

    const listeners = this.getListenersByEvent(event)

    for (const listenerHandler of listeners) {
      listenerHandler(data)
    }
  }

  static getListenersByEvent(event: string) {
    return (this.listeners.get(event) || []) as EventHandler[]
  }

  static getAllListeners() {
    return [...this.listeners.values()]
  }

  static removeAllListeners() {
    this.listeners.clear()
  }
}