export enum EventPriority {
  HIGH = 0,
  NORMAL = 1,
  LOW = 2
}

export type ListenerHandler<T = unknown> = (data: T) => void | boolean

export interface IEventSender {
  send(event: string, data: unknown): void
}

export interface IEventEmitter {
  emit(event: string, data: unknown): void
}

export interface IEventSubscriptionPriority {
  on(event: string, listener: ListenerHandler, priority?: EventPriority): void
}

export interface IEventUnsubscription {
  off(event: string, listener: ListenerHandler): void
  clear(event?: string): void
}

export interface IEventListenerRegistryPriority extends
  IEventSubscriptionPriority,
  IEventUnsubscription { }

export interface IEventPublisher extends
  IEventSender,
  IEventListenerRegistryPriority { }

export type IEventSink = IEventSender

export type EventTuple = [string, unknown]
