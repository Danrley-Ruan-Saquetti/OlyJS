export type EventName = string | symbol
export type EventMap = Record<EventName, unknown>

export type Listener<T = any> = (data: T) => void

export type ListenersMap<Events extends EventMap = {}> = {
  [KEvent in keyof Events]?: Listener<Events[KEvent]>[]
}

export interface IEventListenerRegistry<Events extends EventMap = {}> {
  on<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void
  off<E extends keyof Events>(event: E, listener: Listener<Events[E]>): void
  clear(event?: keyof Events): void
}

export interface IEventDispatcher<Events extends EventMap = {}> {
  emit<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventDispatcher<Events> { }

export type EventBuffer<Events extends EventMap = {}> = {
  event: keyof Events
  data: Events[keyof Events]
}

export interface IEventQueueSender<Events extends EventMap = {}> {
  send<E extends keyof Events>(event: E, data: Events[E]): void
}

export interface IEventQueueFlusher {
  flush(): void
}

export interface IEventQueueExecuter {
  execute(): void
}

export interface IBufferedEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventDispatcher<Events>,
  IEventQueueSender<Events>,
  IEventQueueExecuter { }

export interface IEventQueueProcessor<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventQueueSender<Events> { }
