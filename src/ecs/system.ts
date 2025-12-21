import { EventMap } from '../runtime'
import { EngineContext } from '../runtime/contracts/engine-context'
import { SystemContext } from '../runtime/contracts/system-context'

export interface ISystem<Events extends EventMap = {}> {
  start(context: EngineContext<Events>): void
  stop(): void
  update(context: SystemContext<Events>): void
}
