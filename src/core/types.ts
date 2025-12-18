import { DeltaTime } from '@common/delta-time'
import { IEventEmitterDispatcher, IEventEmitterRegister } from '@common/event/event-emitter'
import { EventMap } from '@common/event/types'

export type EngineEvents = {
  'engine:start': undefined
  'engine:tick': DeltaTime
  'engine:stop': undefined
}

export type EngineEventMap<InEvents extends EventMap = {}> = EngineEvents & Omit<InEvents, keyof EngineEvents>

export interface IEngine<InEvents extends EventMap = {}> extends IEventEmitterRegister<EngineEventMap<InEvents>>, IEventEmitterDispatcher<InEvents> {
  start(): void
  stop(): void
  tick(): void
}

export interface IEngineRegisterEvent<InEvents extends EventMap = {}> {
  registerEngine(engine: IEngine<InEvents>): void
}
