import { ISystem } from '../ecs/system'
import { EngineStartContext } from '../runtime/contracts/engine-context'
import { IEventListenerRegistryPriority, IEventSender } from '../runtime/contracts/event'
import { SystemContext } from './../runtime/contracts/system-context'

export interface IEngineController {
  start(context: EngineStartContext): void
  stop(): void
  tick(context: SystemContext): void
  registerSystem(system: ISystem): void
  isRunning(): boolean
}

export interface IEngineEvents extends IEventListenerRegistryPriority, IEventSender { }

export interface IEngine extends
  IEngineController,
  IEngineEvents { }
