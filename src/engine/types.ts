import { ISystem } from '@ecs/system'
import { EventMap, IEventListenerRegistry, IEventQueueSender } from '@runtime/contracts/event'

export type EngineEvents = {
  'engine:start': undefined
  'engine:stop': undefined
}

export type EngineEventMap<ExternalEvents extends EventMap = {}> = EngineEvents & Omit<ExternalEvents, keyof EngineEvents>

export interface IEngine<ExternalEvents extends EventMap = {}> extends IEventListenerRegistry<EngineEventMap<ExternalEvents>>, IEventQueueSender<ExternalEvents> {
  start(): void
  stop(): void
  tick(): void
  registerSystem(system: ISystem): void
}
