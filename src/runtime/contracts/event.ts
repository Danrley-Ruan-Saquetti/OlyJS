export type EventName = string
export type EventMap = Record<EventName, unknown>

export enum EventPriority {
  HIGH = 0,
  NORMAL = 1,
  LOW = 2
}

export type ListenerHandler<T = {}> = (data: T) => void | boolean

export interface IEventSender<Events extends EventMap = {}> {
  send<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventEmitter<Events extends EventMap = {}> {
  emit<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventListenerRegistry<Events extends EventMap = {}> {
  on<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>, priority?: EventPriority): void
  off<E extends keyof Events>(event: E, listener: ListenerHandler<Events[E]>): void
  clear(event?: keyof Events): void
}

export interface IEventPublisher<Events extends EventMap = {}> extends
  IEventSender<Events>,
  IEventListenerRegistry<Events> { }

export type IEventSink<Events extends EventMap = {}> = IEventSender<Events>
