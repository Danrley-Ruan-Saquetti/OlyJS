import { ICommandDomain } from '../contracts'
import { EngineContext, EngineInitializeContext } from '../contracts/context/engine.context'
import { SystemContext } from '../contracts/context/system.context'
import { ISystem } from '../ecs/system'

export interface IEngineController {
  initialize(context: EngineInitializeContext): void
  start(): void
  stop(): void
  tick(context: SystemContext): void
  registerSystem(system: ISystem): void
  registerCommandDomain(domain: ICommandDomain): void
  isRunning(): boolean
}

export interface IEngine extends IEngineController {
  readonly context: EngineContext
}
