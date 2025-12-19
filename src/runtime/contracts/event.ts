export type EventName = string | symbol
export type EventMap = Record<EventName, unknown>

export type Listener<T = any> = (data: T) => void

export interface IEventSender<Events extends EventMap = {}> {
  send<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventEmitter<Events extends EventMap = {}> {
  emit<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventListenerRegistry<Events extends EventMap = {}> {
  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void
  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void
  clear(event?: keyof Events): void
}
