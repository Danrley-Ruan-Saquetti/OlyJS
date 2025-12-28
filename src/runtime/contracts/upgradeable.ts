import { EventMap } from './event'
import { SystemContext } from './system-context'

export interface IUpgradeable<Events extends EventMap = {}> {
  update(context: SystemContext<Events>): void
}
