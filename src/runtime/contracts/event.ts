export type EventName = string
export type EventMap = Record<EventName, unknown>

export enum EventPriority {
  HIGH = 0,
  NORMAL = 1,
  LOW = 2
}

export type ListenerHandler<T = unknown> = (data: T) => void | boolean

export interface IEventSender {
  send(event: EventName, data: unknown): void
}

export interface IEventEmitter {
  emit(event: EventName, data: unknown): void
}

export interface IEventSubscription {
  on(event: EventName, listener: ListenerHandler): void
}

export interface IEventSubscriptionPriority {
  on(event: EventName, listener: ListenerHandler, priority?: EventPriority): void
}

export interface IEventUnsubscription {
  off(event: EventName, listener: ListenerHandler): void
  clear(event?: EventName): void
}

export interface IEventListenerRegistry extends
  IEventSubscription,
  IEventUnsubscription { }

export interface IEventListenerRegistryPriority extends
  IEventSubscriptionPriority,
  IEventUnsubscription { }

export interface IEventPublisher extends
  IEventSender,
  IEventListenerRegistryPriority { }

export type IEventSink = IEventSender
