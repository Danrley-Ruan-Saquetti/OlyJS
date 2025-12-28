import { ISystem } from '../ecs/system'
import { EngineStartContext } from '../runtime/contracts/engine-context'
import { EventMap, IEventListenerRegistryPriority, IEventSender } from '../runtime/contracts/event'
import { SystemContext } from './../runtime/contracts/system-context'

export interface IEngineController<Events extends EventMap = {}> {
  start(context: EngineStartContext): void
  stop(): void
  tick(context: SystemContext): void
  registerSystem(system: ISystem<Events>): void
  isRunning(): boolean
}

export interface IEngineEvents<Events extends EventMap = {}> extends IEventListenerRegistryPriority<Events>, IEventSender<Events> { }

export interface IEngine<Events extends EventMap = {}> extends
  IEngineController<Events>,
  IEngineEvents<Events> { }
