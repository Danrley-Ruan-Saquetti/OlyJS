import { SystemContext } from './system-context'

export interface IUpgradeable {
  update(context: SystemContext): void
}
