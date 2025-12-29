import { IBufferStream } from '../../runtime/buffer/type'
import {
  EventName,
  IEventEmitter,
  IEventListenerRegistry,
  IEventListenerRegistryPriority,
  IEventSender,
  ListenerHandler
} from '../../runtime/contracts/event'

export type PriorityBucket<T = unknown> = ListenerHandler<T>[][]

export type ListenersPriorityMap = {
  [K in EventName]?: PriorityBucket
}

export type ListenersMap = {
  [K in EventName]?: ListenerHandler[]
}

export interface IEventBus extends
  IEventListenerRegistry,
  IEventEmitter { }

export interface IEventBusPriority extends
  IEventListenerRegistryPriority,
  IEventEmitter { }

export interface IEventQueueExecuter {
  execute(): void
}

export interface IBufferedEventBus extends
  IEventSender,
  IEventQueueExecuter { }

export type IBufferedEventQueue = IBufferStream
