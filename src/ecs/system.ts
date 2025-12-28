import { EventMap } from '../runtime'
import { EngineContext } from '../runtime/contracts/engine-context'
import { IUpgradeable } from '../runtime/contracts/upgradeable'

export interface ISystem<Events extends EventMap = {}> extends IUpgradeable<Events> {
  start(context: EngineContext<Events>): void
  stop(): void
}
