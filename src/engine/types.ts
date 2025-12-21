import { ISystem } from '../ecs/system'
import { EventMap, IEventListenerRegistry } from '../runtime/contracts/event'

export interface IEngineController {
  start(): void
  stop(): void
  tick(deltaTime: number): void
  registerSystem(system: ISystem): void
}

export type IEngineEvents<Events extends EventMap = {}> = IEventListenerRegistry<Events>

export interface IEngine<Events extends EventMap = {}> extends
  IEngineController,
  IEngineEvents<Events> { }
