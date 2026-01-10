import {
  IEventEmitter,
  IEventListenerRegistryPriority,
  IEventSender,
  ListenerHandler
} from '../../contracts/engine/event'
import { IBuffer } from '../../runtime/buffer/type'

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

export type IBufferedEventQueue = IBuffer
