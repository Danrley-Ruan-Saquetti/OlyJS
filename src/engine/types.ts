import { ICommandDomain } from '../contracts'
import { EngineInitializeContext } from '../contracts/context/engine.context'
import { SystemInitializeContext, SystemUpdateContext } from '../contracts/context/system.context'
import { ISystem } from '../ecs/system'

export interface IEngine {
  readonly systemContext: SystemInitializeContext

  initialize(context: EngineInitializeContext): void
  start(): void
  stop(): void
  tick(context: SystemUpdateContext): void
  registerSystem(system: ISystem): void
  registerCommandDomain(domain: ICommandDomain): void
  isRunning(): boolean
}
