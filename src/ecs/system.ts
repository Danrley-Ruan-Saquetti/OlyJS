import { EngineContext } from '../runtime/contracts/engine-context'
import { IUpgradeable } from '../runtime/contracts/upgradeable'

export interface ISystem extends IUpgradeable {
  initialize(context: EngineContext): void
  start(): void
  stop(): void
}
