import { ISystem } from '@ecs/system'
import { EventMap, IEventListenerRegistry } from '@runtime/contracts/event'
import { IEventSink } from '@runtime/contracts/system-context'

export type EngineEvents = {
  'engine:start': undefined
  'engine:stop': undefined
}

export type EngineEventMap<ExternalEvents extends EventMap = {}> = EngineEvents & Omit<ExternalEvents, keyof EngineEvents>

export interface IEngine<ExternalEvents extends EventMap = {}> extends IEventListenerRegistry<EngineEventMap<ExternalEvents>>, IEventSink<ExternalEvents> {
  start(): void
  stop(): void
  tick(): void
  registerSystem(system: ISystem): void
}
