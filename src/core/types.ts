import { DeltaTime } from '@common/delta-time'
import { IEventEmitter } from '@common/event/event-emitter'
import { EventMap } from '@common/event/types'

export interface IEngine<Events extends EventMap = any> extends IEventEmitter<Events> {
  start(): void
  stop(): void
  tick(): void
}

export type EngineEvents = {
  'engine:start': undefined
  'engine:tick': DeltaTime
  'engine:stop': undefined
}

export interface IEngineRegisterEvent<Events extends EventMap = any> {
  registerEngine(engine: IEngine<Events>): void
}
