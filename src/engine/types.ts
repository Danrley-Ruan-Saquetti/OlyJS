import { ISystem } from '@ecs/system.js'
import { EventMap, IEventEmitterDispatcher, IEventEmitterRegister } from '@runtime/contracts/event.js'

export type EngineEvents = {
  'engine:start': undefined
  'engine:stop': undefined
}

export type EngineEventMap<InEvents extends EventMap = {}> = EngineEvents & Omit<InEvents, keyof EngineEvents>

export interface IEngine<InEvents extends EventMap = {}> extends IEventEmitterRegister<EngineEventMap<InEvents>>, IEventEmitterDispatcher<InEvents> {
  start(): void
  stop(): void
  tick(): void
  registerSystem(system: ISystem): void
}
