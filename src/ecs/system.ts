import { SystemInitializeContext, SystemUpdateContext } from '../contracts/context/system.context'

export interface ISystem {
  initialize?(context: SystemInitializeContext): void
  start?(): void
  stop?(): void
  update?(context: SystemUpdateContext): void
}
