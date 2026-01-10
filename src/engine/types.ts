import { EngineContext, EngineStartContext } from '../contracts/context/engine.context'
import { SystemContext } from '../contracts/context/system.context'
import { ISystem } from '../ecs/system'

export interface IEngineController {
  start(context: EngineStartContext): void
  stop(): void
  tick(context: SystemContext): void
  registerSystem(system: ISystem): void
  isRunning(): boolean
}

export interface IEngine extends IEngineController {
  readonly context: EngineContext
}
