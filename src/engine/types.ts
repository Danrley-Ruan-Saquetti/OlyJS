import { ISystem } from '../ecs/system'
import { EngineContext, EngineStartContext } from '../runtime/contracts/engine-context'
import { SystemContext } from './../runtime/contracts/system-context'

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
