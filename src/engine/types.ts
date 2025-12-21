import { ISystem } from '../ecs/system'
import { EventMap, IEventListenerRegistry } from '../runtime/contracts/event'

export interface IEngineController<Events extends EventMap = {}> {
  start(): void
  stop(): void
  tick(deltaTime: number): void
  registerSystem(system: ISystem<Events>): void
}

export type IEngineEvents<Events extends EventMap = {}> = IEventListenerRegistry<Events>

export interface IEngine<Events extends EventMap = {}> extends
  IEngineController<Events>,
  IEngineEvents<Events> { }
