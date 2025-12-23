import { EventMap, IEventEmitter, IEventListenerRegistry, IEventSender, Listener } from '../../runtime/contracts/event'

export type ListenersMap<Events extends EventMap = {}> = {
  [KEvent in keyof Events]?: Listener<Events[KEvent]>[]
}

export interface IEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventEmitter<Events> { }

export interface IEventQueue<Events extends EventMap = {}> {
  flush(): number
  getFlushedEvent(index: number): keyof Events
  getFlushedData(index: number): Events[keyof Events]
}

export interface IEventQueueExecuter {
  execute(): void
}

export interface IBufferedEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventEmitter<Events>,
  IEventSender<Events>,
  IEventQueueExecuter { }

export interface IEventQueueProcessor<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventSender<Events> { }
