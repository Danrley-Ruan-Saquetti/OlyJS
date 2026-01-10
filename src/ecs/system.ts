import { EngineContext } from '../runtime/contracts/context/engine.context'
import { SystemContext } from '../runtime/contracts/context/system.context'

export interface ISystem {
  initialize(context: EngineContext): void
  start(): void
  stop(): void
  update(context: SystemContext): void
}
