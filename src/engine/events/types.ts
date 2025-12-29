import { IBufferStream } from '../../runtime/buffer/type'
import {
  IEventEmitter,
  IEventListenerRegistryPriority,
  IEventSender,
  ListenerHandler
} from '../../runtime/contracts/event'

export type PriorityBucket<T = unknown> = ListenerHandler<T>[][]

export type ListenersPriorityMap = {
  [K in string]?: PriorityBucket
}

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
