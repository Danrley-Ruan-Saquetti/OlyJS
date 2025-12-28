import { IBufferStream } from '../../runtime/buffer/type'
import { EventMap, IEventEmitter, IEventListenerRegistry, IEventSender, ListenerHandler } from '../../runtime/contracts/event'

export type PriorityBucket<T = any> = ListenerHandler<T>[][]

export type ListenersMap<Events extends EventMap = {}> = {
  [KEvent in keyof Events]?: PriorityBucket<Events[KEvent]>
}

export interface IEventBus<Events extends EventMap = {}> extends
  IEventListenerRegistry<Events>,
  IEventEmitter<Events> { }

export interface IEventQueueExecuter {
  execute(): void
}

export interface IBufferedEventBus<Events extends EventMap = {}> extends
  IEventSender<Events>,
  IEventQueueExecuter { }

export type IBufferedEventQueue<Events extends EventMap = {}> = IBufferStream<Events>
