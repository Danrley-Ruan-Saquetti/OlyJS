import { SystemContext } from './context/system.context'

export interface IUpgradeable {
  update(context: SystemContext): void
}
