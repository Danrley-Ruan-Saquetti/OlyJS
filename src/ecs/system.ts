import { SystemContext } from '@runtime/contracts/system-context.js'

export interface ISystem {
  start(): void
  stop(): void
  update(context: SystemContext): void
}
