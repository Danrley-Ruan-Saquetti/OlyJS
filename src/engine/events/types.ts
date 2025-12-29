import { IBufferStream } from '../../runtime/buffer/type'
import {
  EventMap,
  IEventEmitter,
  IEventListenerRegistry,
  IEventListenerRegistryPriority,
  IEventSender,
  ListenerHandler
} from '../../runtime/contracts/event'

export type PriorityBucket<T = any> = ListenerHandler<T>[][]

export type ListenersPriorityMap<Events extends EventMap = {}> = {
  [KEvent in keyof Events]?: PriorityBucket<Events[KEvent]>
}

export type ListenersMap<Events extends EventMap = {}> = {
  [KEvent in keyof Events]?: ListenerHandler<Events[KEvent]>[]
}

export interface IEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventEmitter<Events> { }

export interface IEventBusPriority<Events extends EventMap = {}> extends
  IEventListenerRegistryPriority<Events>,
  IEventEmitter<Events> { }

export interface IEventQueueExecuter {
  execute(): void
}

export interface IBufferedEventBus<Events extends EventMap = {}> extends
  IEventSender<Events>,
  IEventQueueExecuter { }

export type IBufferedEventQueue<Events extends EventMap = {}> = IBufferStream<Events>
