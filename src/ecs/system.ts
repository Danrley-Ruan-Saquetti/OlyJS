import { SystemContext, SystemInitializeContext } from '../contracts/context/system.context'

export interface ISystem {
  initialize(context: SystemInitializeContext): void
  start(): void
  stop(): void
  update(context: SystemContext): void
}
