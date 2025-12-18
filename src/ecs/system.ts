import { World } from '@ecs/world.js'
import { DeltaTime } from '@runtime/contracts/time.js'

export interface ISystem {
  start(): void
  stop(): void
  update(world: World, deltaTime: DeltaTime): void
}
