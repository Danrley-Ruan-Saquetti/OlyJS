import { EngineContext } from '../runtime/contracts/engine-context'
import { IUpgradeable } from '../runtime/contracts/upgradeable'

export interface ISystem extends IUpgradeable {
  start(context: EngineContext): void
  stop(): void
}
