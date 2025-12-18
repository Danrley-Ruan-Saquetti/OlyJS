import { DeltaTime } from '@runtime/contracts/time.js'

export interface ISystem {
  start(): void
  stop(): void
  update(deltaTime: DeltaTime): void
}
