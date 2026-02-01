import { ICommandDomain } from '../contracts'
import { EngineInitializeContext } from '../contracts/context/engine.context'
import { SystemContext } from '../contracts/context/system.context'
import { ISystem } from '../ecs/system'

export interface IEngine {
  initialize(context: EngineInitializeContext): void
  start(): void
  stop(): void
  tick(context: SystemContext): void
  registerSystem(system: ISystem): void
  registerCommandDomain(domain: ICommandDomain): void
  isRunning(): boolean
}
