import { ISystem } from '@ecs/system'
import { EventMap, IEventListenerRegistry } from '@runtime/contracts/event'

export interface IEngineController {
  start(): void
  stop(): void
  tick(): void
  registerSystem(system: ISystem): void
}

export interface IEngineEvents<Events extends EventMap = {}> extends IEventListenerRegistry<Events> { }

export interface IEngine<Events extends EventMap = {}> extends
  IEngineController,
  IEngineEvents<Events> { }
