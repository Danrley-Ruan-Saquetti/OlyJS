import { SystemContext } from '../runtime/contracts/system-context'

export interface ISystem {
  start(): void
  stop(): void
  update(context: SystemContext): void
}
